import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { EditorView } from '@codemirror/view'
import confetti from 'canvas-confetti'
import type { CodeContent, LessonMeta, World } from '../curriculum/types'
import { nextLessonId } from '../curriculum'
import { useStore } from '../lib/store'
import type { RunResult, Step } from './world'
import GridView, { angleFor, initialVisual, type GridVisual } from './GridView'
import CodeEditor from './CodeEditor'
import Cosmo, { type CosmoPose } from '../ui/Cosmo'
import { Button, Pill } from '../ui/kit'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function frenchError(result: RunResult): { pose: CosmoPose; text: string } {
  if (result.outcome === 'crash') {
    return result.reason === 'asteroide'
      ? { pose: 'oops', text: 'Boum ! Ta fusée a percuté un rocher. Relis ton code ligne par ligne.' }
      : { pose: 'oops', text: 'Ta fusée est sortie du chemin ! Compte les cases et les répétitions.' }
  }
  if (result.outcome === 'incomplete') {
    if (result.reason === 'rien')
      return { pose: 'point', text: 'Ton code n’a donné aucun ordre à la fusée. Écris par exemple : avancer();' }
    if (result.reason === 'cristaux-restants')
      return { pose: 'think', text: 'Il reste des cristaux à ramasser !' }
    return { pose: 'think', text: 'Le code s’est terminé avant la planète. Il manque un ou deux ordres…' }
  }
  if (result.outcome === 'error') {
    if (result.reason === 'boucle-infinie' || result.reason === 'trop-actions')
      return { pose: 'oops', text: 'Ta boucle ne s’arrête jamais ! Vérifie sa condition de sortie.' }
    const detail = result.detail ?? ''
    const m = detail.match(/^(\w+) is not defined/)
    if (m)
      return {
        pose: 'think',
        text: `« ${m[1]} » ? Ta fusée ne connaît pas ce mot. Une faute de frappe, peut-être ? Regarde l’aide-mémoire !`,
      }
    if (detail.toLowerCase().includes('unexpected') || detail.toLowerCase().includes('missing'))
      return {
        pose: 'think',
        text: 'Il y a une petite faute d’écriture : une parenthèse ( ), une accolade { } ou un point-virgule ; oublié ?',
      }
    return { pose: 'oops', text: 'Quelque chose cloche dans le code. Modifie-le et reteste !' }
  }
  return { pose: 'oops', text: 'Hmm, réessaie !' }
}

type Phase = 'edit' | 'running' | 'win' | 'fail'

/** Les missions en vrai JavaScript : mêmes fusées, nouveau super-pouvoir. */
export default function CodePlayer({
  lesson,
  world,
  content,
}: {
  lesson: LessonMeta
  world: World
  content: CodeContent
}) {
  const navigate = useNavigate()
  const { recordLessonResult } = useStore()
  const viewRef = useRef<EditorView | null>(null)
  const cancelRef = useRef(0)

  const [visual, setVisual] = useState<GridVisual>(() => initialVisual(content))
  const [phase, setPhase] = useState<Phase>('edit')
  const [bubble, setBubble] = useState(content.brief)
  const [hintIndex, setHintIndex] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [failInfo, setFailInfo] = useState<{ pose: CosmoPose; text: string }>({ pose: 'oops', text: '' })
  const [earned, setEarned] = useState({ stars: 0, xp: 0 })

  const W = Math.max(...content.map.map((r) => r.length))
  const H = content.map.length
  const isMobile = window.innerWidth < 1024

  const reset = useCallback(() => {
    cancelRef.current++
    setVisual(initialVisual(content))
    setPhase('edit')
  }, [content])

  useEffect(() => reset(), [lesson.id, reset])

  async function animate(steps: Step[], result: RunResult) {
    const token = ++cancelRef.current
    const speed = steps.length > 60 ? 0.45 : steps.length > 30 ? 0.7 : 1
    let v = initialVisual(content)
    setVisual(v)
    await sleep(300)
    let angle = angleFor(content.start.dir)
    for (const s of steps) {
      if (cancelRef.current !== token) return
      if (s.t === 'move') {
        v = { ...v, x: s.x, y: s.y, visited: [...v.visited, `${s.x},${s.y}`] }
        setVisual(v)
        await sleep(260 * speed)
      } else if (s.t === 'turn') {
        const target = angleFor(s.dir)
        const delta = ((target - (((angle % 360) + 360) % 360)) + 540) % 360 - 180
        angle += delta
        v = { ...v, angle }
        setVisual(v)
        await sleep(200 * speed)
      } else if (s.t === 'pickup') {
        v = { ...v, collected: new Set([...v.collected, `${s.x},${s.y}`]) }
        setVisual(v)
        await sleep(180 * speed)
      } else if (s.t === 'crash') {
        v = { ...v, crash: { x: s.x, y: s.y } }
        setVisual(v)
        await sleep(700)
      } else if (s.t === 'win') {
        v = { ...v, won: true }
        setVisual(v)
        await sleep(350)
      }
    }
    if (cancelRef.current !== token) return

    if (result.outcome === 'win') {
      const stars = hintsUsed === 0 ? 3 : hintsUsed === 1 ? 2 : 1
      const { xpGained } = await recordLessonResult(lesson.id, stars)
      setEarned({ stars, xp: xpGained })
      setPhase('win')
      confetti({ particleCount: 130, spread: 75, origin: { y: 0.65 }, colors: ['#17C3DE', '#8B63F7', '#FFD23F'] })
    } else {
      setFailInfo(frenchError(result))
      setPhase('fail')
    }
  }

  function run() {
    if (!viewRef.current || phase === 'running') return
    const code = viewRef.current.state.doc.toString()
    setVisual(initialVisual(content))
    setPhase('running')

    const worker = new Worker(new URL('./sim.worker.ts', import.meta.url), { type: 'module' })
    const timeout = setTimeout(() => {
      worker.terminate()
      setFailInfo({ pose: 'oops', text: 'Ton code tourne sans jamais s’arrêter — une boucle infinie ! Vérifie sa sortie.' })
      setPhase('fail')
    }, 3000)

    worker.onmessage = (e) => {
      clearTimeout(timeout)
      worker.terminate()
      const data = e.data as { ok: boolean; result?: RunResult; message?: string }
      if (data.ok && data.result) {
        void animate(data.result.steps, data.result)
      } else {
        setFailInfo({ pose: 'oops', text: 'Quelque chose cloche dans le code. Modifie-le et reteste !' })
        setPhase('fail')
      }
    }
    worker.postMessage({ def: { map: content.map, start: content.start, goal: content.goal }, code })
  }

  function showHint() {
    const hint = content.hints[Math.min(hintIndex, content.hints.length - 1)]
    setBubble('💡 ' + hint)
    setHintIndex((i) => Math.min(i + 1, content.hints.length - 1))
    setHintsUsed((h) => h + 1)
  }

  function insertSnippet(snippet: string) {
    const view = viewRef.current
    if (!view) return
    const pos = view.state.selection.main.head
    view.dispatch({ changes: { from: pos, insert: snippet + '\n' }, selection: { anchor: pos + snippet.length + 1 } })
    view.focus()
  }

  const next = nextLessonId(lesson.id)

  return (
    <div className="flex h-[100dvh] flex-col">
      <header className="flex items-center gap-2 px-3 py-2">
        <Link
          to="/app"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-space-700 text-lg hover:bg-space-600"
          aria-label="Quitter"
        >
          ✕
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display font-bold leading-tight">{lesson.title}</p>
          <p className="truncate text-xs text-white/50">
            {world.name} · {world.concept} · vrai JavaScript
          </p>
        </div>
        <Pill className="shrink-0 border border-comet-400/30 bg-comet-500/10 text-comet-300">
          ⌨️ vrai code
        </Pill>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row lg:gap-3 lg:px-3 lg:pb-3">
        <div className="flex flex-col gap-2 px-3 lg:w-[42%] lg:px-0">
          <div className="relative rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-space-900 shadow-card">
            <span className="absolute -bottom-1.5 left-8 h-3 w-3 rotate-45 bg-white" aria-hidden />
            {bubble}
          </div>
          <div className="mx-auto w-full" style={{ width: `min(100%, ${((isMobile ? 30 : 48) * W) / H}dvh)` }}>
            <GridView def={content} visual={visual} />
          </div>
          <div className="flex items-center justify-center gap-2 pb-1">
            <Button variant="success" onClick={run} disabled={phase === 'running'} className="max-w-56 flex-1">
              {phase === 'running' ? '🚀 En vol…' : '▶ TESTER'}
            </Button>
            <Button variant="secondary" onClick={reset} aria-label="Recommencer">
              ↺
            </Button>
            <Button variant="star" onClick={showHint} aria-label="Indice">
              💡
            </Button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-3xl border border-white/10 lg:rounded-3xl">
          {/* Aide-mémoire : tape ou insère d'un geste */}
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-b border-white/10 bg-space-800/80 p-2">
            {content.api.map((fn) => (
              <button
                key={fn}
                onClick={() => insertSnippet(fn)}
                className="shrink-0 rounded-lg bg-space-700 px-2.5 py-1 font-mono text-xs font-bold text-comet-300 transition hover:bg-space-600"
              >
                {fn}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1">
            <CodeEditor initialCode={content.starterCode} onView={(v) => (viewRef.current = v)} />
          </div>
        </div>
      </div>

      {phase === 'win' && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center">
          <div className="w-full max-w-md animate-slide-up rounded-t-3xl bg-space-800 p-6 text-center sm:rounded-3xl">
            <Cosmo pose="cheer" className="mx-auto h-28 w-28" />
            <h2 className="mt-2 font-display text-3xl font-bold text-star-400">Du vrai code réussi !</h2>
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
            {earned.stars < 3 && (
              <p className="text-white/70">Réussis sans indice pour décrocher les 3 étoiles !</p>
            )}
            <p className="mt-1 font-display font-bold text-comet-400">+{earned.xp} points ✨</p>
            <div className="mt-5 flex flex-col gap-2">
              <Button size="lg" onClick={() => navigate(next ? `/app/lecon/${next}` : '/app')}>
                {next ? 'Mission suivante →' : 'Retour à la carte'}
              </Button>
              <Button variant="secondary" onClick={reset}>
                Rejouer
              </Button>
            </div>
          </div>
        </div>
      )}

      {phase === 'fail' && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center">
          <div className="w-full max-w-md animate-slide-up rounded-t-3xl bg-space-800 p-6 text-center sm:rounded-3xl">
            <Cosmo pose={failInfo.pose} className="mx-auto h-24 w-24" />
            <p className="mt-3 text-lg font-semibold">{failInfo.text}</p>
            <div className="mt-5 flex gap-2">
              <Button className="flex-1" onClick={() => setPhase('edit')}>
                Corriger mon code
              </Button>
              <Button
                variant="star"
                onClick={() => {
                  setPhase('edit')
                  showHint()
                }}
              >
                💡
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
