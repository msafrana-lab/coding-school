import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type * as BlocklyNS from 'blockly/core'
import confetti from 'canvas-confetti'
import type { LessonMeta, PuzzleContent, World } from '../curriculum/types'
import { nextLessonId } from '../curriculum'
import { useStore } from '../lib/store'
import { SimWorld, type RunResult, type Step } from './world'
import { sounds } from '../lib/sounds'
import GridView, { angleFor, initialVisual, type GridVisual } from './GridView'
import BlocklyWorkspace from './BlocklyWorkspace'
import { generateCode, starsFor } from './runner'
import Cosmo, { type CosmoPose } from '../ui/Cosmo'
import { Button, Pill } from '../ui/kit'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const FAIL_MESSAGES: Record<string, { pose: CosmoPose; text: string }> = {
  asteroide: { pose: 'oops', text: 'Boum ! Ta fusée a foncé dans un rocher spatial. Regarde bien où elle doit tourner.' },
  vide: { pose: 'oops', text: 'Oups, ta fusée est sortie du chemin ! Compte les cases une par une.' },
  bord: { pose: 'oops', text: 'Ta fusée est partie hors de la carte ! Compte les cases une par une.' },
  'pas-arrivee': { pose: 'think', text: 'Presque ! Le programme s’est terminé avant d’atteindre la planète. Il manque peut-être un bloc.' },
  'cristaux-restants': { pose: 'think', text: 'Bien joué pour le chemin… mais il reste des cristaux à ramasser !' },
  rien: { pose: 'point', text: 'Attache des blocs sous « 🚀 au départ », puis appuie sur TESTER.' },
  'boucle-infinie': { pose: 'oops', text: 'Ta boucle tourne sans jamais s’arrêter ! Il lui faut une sortie.' },
  'trop-actions': { pose: 'oops', text: 'Ta fusée tourne en rond sans jamais atteindre le but ! Regarde bien où elle fait demi-tour, puis modifie ton programme.' },
  'motif-manquant': { pose: 'think', text: 'Ta fusée ne connaît pas ce motif. Ajoute d’abord le bloc « définir le motif » !' },
  inconnu: { pose: 'oops', text: 'Quelque chose cloche dans le programme. Essaie de le modifier puis reteste !' },
}

type Phase = 'edit' | 'running' | 'win' | 'fail'

export default function PuzzlePlayer({
  lesson,
  world,
  content,
  demo = false,
}: {
  lesson: LessonMeta
  world: World
  content: PuzzleContent
  demo?: boolean
}) {
  const navigate = useNavigate()
  const { recordLessonResult } = useStore()
  const wsRef = useRef<BlocklyNS.WorkspaceSvg | null>(null)
  const cancelRef = useRef(0)

  const [visual, setVisual] = useState<GridVisual>(() => initialVisual(content))
  const [phase, setPhase] = useState<Phase>('edit')
  const [bubble, setBubble] = useState<string>(content.brief)
  const [bubbleOpen, setBubbleOpen] = useState(true)
  const [gridBig, setGridBig] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [failInfo, setFailInfo] = useState(FAIL_MESSAGES.inconnu)
  const [earned, setEarned] = useState({ stars: 0, xp: 0, blocks: 0 })
  const horizontal = useMemo(() => window.innerWidth < 1024, [])

  const W = Math.max(...content.map.map((r) => r.length))
  const H = content.map.length

  const reset = useCallback(() => {
    cancelRef.current++
    wsRef.current?.highlightBlock(null)
    setVisual(initialVisual(content))
    setPhase('edit')
    setGridBig(false)
  }, [content])

  useEffect(() => reset(), [lesson.id, reset])

  async function animate(allSteps: Step[], result: RunResult) {
    const token = ++cancelRef.current
    // Un programme qui boucle sans fin produit des centaines de pas : on montre
    // le début, puis on coupe court pour afficher l'explication tout de suite.
    const steps =
      result.outcome !== 'win' && allSteps.length > 140 ? allSteps.slice(0, 140) : allSteps
    const speed = steps.length > 60 ? 0.45 : steps.length > 30 ? 0.7 : 1
    let v = initialVisual(content)
    setVisual(v)
    await sleep(350)
    let angle = angleFor(content.start.dir)

    for (const s of steps) {
      if (cancelRef.current !== token) return
      if (s.t === 'trace') {
        wsRef.current?.highlightBlock(s.id)
        await sleep(60 * speed)
      } else if (s.t === 'move') {
        v = { ...v, x: s.x, y: s.y, visited: [...v.visited, `${s.x},${s.y}`] }
        setVisual(v)
        await sleep(280 * speed)
      } else if (s.t === 'turn') {
        // Rotation continue (pas de saut de 270° à 0°)
        const target = angleFor(s.dir)
        let delta = ((target - (((angle % 360) + 360) % 360)) + 540) % 360 - 180
        angle += delta
        v = { ...v, angle }
        setVisual(v)
        await sleep(220 * speed)
      } else if (s.t === 'pickup') {
        v = { ...v, collected: new Set([...v.collected, `${s.x},${s.y}`]) }
        setVisual(v)
        sounds.pickup()
        await sleep(200 * speed)
      } else if (s.t === 'crash') {
        v = { ...v, crash: { x: s.x, y: s.y } }
        setVisual(v)
        sounds.crash()
        await sleep(700)
      } else if (s.t === 'win') {
        v = { ...v, won: true }
        setVisual(v)
        sounds.win()
        await sleep(350)
      }
    }
    if (cancelRef.current !== token) return
    wsRef.current?.highlightBlock(null)

    if (result.outcome === 'win') {
      const { blockCount } = generateCode(wsRef.current!)
      const stars = starsFor(blockCount, content.par)
      let xp = 0
      if (!demo) {
        const r = await recordLessonResult(lesson.id, stars)
        xp = r.xpGained
      }
      setEarned({ stars, xp, blocks: blockCount })
      setPhase('win')
      confetti({
        particleCount: 130,
        spread: 75,
        origin: { y: 0.65 },
        colors: ['#8B63F7', '#17C3DE', '#FFD23F', '#FF6B81', '#5CE8A4'],
      })
    } else {
      const reason = 'reason' in result ? result.reason : 'inconnu'
      setFailInfo(FAIL_MESSAGES[reason] ?? FAIL_MESSAGES.inconnu)
      setPhase('fail')
    }
  }

  function runProgram() {
    if (!wsRef.current || phase === 'running') return
    sounds.click()
    if (horizontal) {
      setGridBig(true)
      setBubbleOpen(false)
    }
    setVisual(initialVisual(content))
    setPhase('running')
    const { code } = generateCode(wsRef.current)
    // Trace de diagnostic (lisible dans la console du navigateur)
    ;(window as unknown as Record<string, unknown>).__astroLastCode = code
    const sim = new SimWorld(content)
    const result = sim.run(code)
    ;(window as unknown as Record<string, unknown>).__astroLastRun = {
      outcome: result.outcome,
      steps: sim.steps.length,
    }
    void animate(sim.steps, result)
  }

  function showHint() {
    const hint = content.hints[Math.min(hintIndex, content.hints.length - 1)]
    setBubble('💡 ' + hint)
    setBubbleOpen(true)
    setHintIndex((i) => Math.min(i + 1, content.hints.length - 1))
  }

  const next = nextLessonId(lesson.id)

  return (
    <div className="flex h-[100dvh] flex-col">
      {/* Barre du haut */}
      <header className="flex items-center gap-2 px-3 py-2">
        <Link
          to={demo ? '/' : '/app'}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-space-700 text-lg hover:bg-space-600"
          aria-label="Quitter la mission"
        >
          ✕
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display font-bold leading-tight">{lesson.title}</p>
          <p className="truncate text-xs text-white/50">
            {world.name} · {world.concept}
          </p>
        </div>
        <Pill className="shrink-0 border border-star-400/30 bg-star-400/10 text-star-300">
          ⭐⭐⭐ ≤ {content.par} blocs
        </Pill>
      </header>

      {horizontal ? (
        /* ---- TÉLÉPHONE : l'atelier occupe tout l'écran, la carte flotte ---- */
        <div className="relative min-h-0 flex-1">
          <div className="absolute inset-0 overflow-hidden border-t border-white/10">
            <BlocklyWorkspace
              blocks={content.blocks}
              starterXml={content.starterXml}
              horizontal
              maxInstances={content.maxInstances}
              onWorkspace={(ws) => (wsRef.current = ws)}
            />
          </div>

          {/* Consigne repliable */}
          {bubbleOpen ? (
            <button
              onClick={() => setBubbleOpen(false)}
              className="absolute left-2 top-[104px] z-20 max-w-[58%] rounded-2xl bg-white px-3 py-2 text-left text-[13px] font-semibold leading-snug text-space-900 shadow-card"
            >
              {bubble}
              <span className="mt-1 block text-[10px] font-bold text-space-900/40">
                toucher pour replier ▲
              </span>
            </button>
          ) : (
            <button
              onClick={() => setBubbleOpen(true)}
              className="absolute left-2 top-[104px] z-20 grid h-11 w-11 place-items-center rounded-full bg-white text-xl shadow-card"
              aria-label="Voir la consigne"
            >
              💬
            </button>
          )}

          {/* Mini-carte flottante : toucher pour agrandir */}
          <button
            onClick={() => setGridBig(true)}
            className="absolute right-2 top-[104px] z-10 w-[37%] rounded-xl border border-white/25 bg-space-900/90 p-1 shadow-card active:scale-95"
            aria-label="Agrandir la carte"
          >
            <GridView def={content} visual={visual} />
            <span className="block pt-0.5 text-center text-[10px] font-bold text-white/50">
              🔍 toucher pour agrandir
            </span>
          </button>

          {/* Barre d'actions collée en bas */}
          <div className="absolute inset-x-2 bottom-2 z-20 flex items-center gap-2">
            {phase === 'running' ? (
              <Button variant="danger" onClick={reset} className="flex-1">
                ■ STOP
              </Button>
            ) : (
              <Button variant="success" onClick={runProgram} className="flex-1">
                ▶ TESTER
              </Button>
            )}
            <Button variant="secondary" onClick={reset} aria-label="Recommencer">
              ↺
            </Button>
            <Button variant="star" onClick={showHint} aria-label="Indice">
              💡
            </Button>
          </div>
        </div>
      ) : (
        /* ---- ORDINATEUR : mission à gauche, atelier à droite ---- */
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row lg:gap-3 lg:px-3 lg:pb-3">
          <div className="flex flex-col gap-2 px-3 lg:w-[42%] lg:px-0">
            <div className="relative rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-space-900 shadow-card">
              <span className="absolute -bottom-1.5 left-8 h-3 w-3 rotate-45 bg-white" aria-hidden />
              {bubble}
            </div>
            <div className="mx-auto w-full" style={{ width: `min(100%, ${(52 * W) / H}dvh)` }}>
              <GridView def={content} visual={visual} />
            </div>
            <div className="flex items-center justify-center gap-2 pb-1">
              {phase === 'running' ? (
                <Button variant="danger" size="lg" onClick={reset} className="flex-1 max-w-56">
                  ■ STOP
                </Button>
              ) : (
                <Button variant="success" size="lg" onClick={runProgram} className="flex-1 max-w-56">
                  ▶ TESTER
                </Button>
              )}
              <Button variant="secondary" size="lg" onClick={reset} aria-label="Recommencer">
                ↺
              </Button>
              <Button variant="star" size="lg" onClick={showHint} aria-label="Indice">
                💡
              </Button>
            </div>
          </div>

          <div className="relative min-h-0 flex-1 overflow-hidden rounded-3xl border border-white/10">
            <BlocklyWorkspace
              blocks={content.blocks}
              starterXml={content.starterXml}
              horizontal={false}
              maxInstances={content.maxInstances}
              onWorkspace={(ws) => (wsRef.current = ws)}
            />
          </div>
        </div>
      )}

      {/* Grande carte (téléphone) : s'ouvre au toucher et pendant le vol */}
      {horizontal && gridBig && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-4"
          onClick={() => phase !== 'running' && setGridBig(false)}
        >
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="rounded-2xl border border-white/20 bg-space-900/95 p-2 shadow-card">
              <GridView def={content} visual={visual} />
            </div>
            <div className="mt-3 flex justify-center">
              {phase === 'running' ? (
                <Button variant="danger" onClick={reset}>
                  ■ STOP — retour aux blocs
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => setGridBig(false)}>
                  ✕ Retour aux blocs
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Victoire */}
      {phase === 'win' && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center">
          <div className="w-full max-w-md animate-slide-up rounded-t-3xl bg-space-800 p-6 text-center sm:rounded-3xl">
            <Cosmo pose="cheer" className="mx-auto h-28 w-28" />
            <h2 className="mt-2 font-display text-3xl font-bold text-star-400">Mission réussie !</h2>
            <div className="my-3 flex justify-center gap-2 text-5xl">
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={i <= earned.stars ? 'animate-pop-in' : 'opacity-20 grayscale'}
                  style={{ animationDelay: `${i * 0.25}s` }}
                >
                  ⭐
                </span>
              ))}
            </div>
            <p className="text-white/70">
              {earned.blocks} bloc{earned.blocks > 1 ? 's' : ''} utilisé{earned.blocks > 1 ? 's' : ''}
              {earned.stars < 3 && <> — essaie avec {content.par} ou moins pour 3 étoiles !</>}
            </p>
            {!demo && <p className="mt-1 font-display font-bold text-comet-400">+{earned.xp} points ✨</p>}
            <div className="mt-5 flex flex-col gap-2">
              {demo ? (
                <Button size="lg" onClick={() => navigate('/connexion')}>
                  Créer mon compte pour continuer 🚀
                </Button>
              ) : next ? (
                <Button size="lg" onClick={() => navigate(`/app/lecon/${next}`)}>
                  Mission suivante →
                </Button>
              ) : (
                <Button size="lg" onClick={() => navigate('/app')}>
                  Retour à la carte
                </Button>
              )}
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={reset}>
                  Rejouer
                </Button>
                {!demo && (
                  <Button variant="ghost" className="flex-1" onClick={() => navigate('/app')}>
                    Carte
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Échec pédagogique */}
      {phase === 'fail' && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center">
          <div className="w-full max-w-md animate-slide-up rounded-t-3xl bg-space-800 p-6 text-center sm:rounded-3xl">
            <Cosmo pose={failInfo.pose} className="mx-auto h-24 w-24" />
            <p className="mt-3 text-lg font-semibold">{failInfo.text}</p>
            <div className="mt-5 flex gap-2">
              <Button className="flex-1" onClick={reset}>
                Réessayer
              </Button>
              <Button
                variant="star"
                onClick={() => {
                  reset()
                  showHint()
                }}
              >
                💡 Indice
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
