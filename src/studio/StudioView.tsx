import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type * as BlocklyNS from 'blockly/core'
import * as Blockly from 'blockly/core'
import confetti from 'canvas-confetti'
import { supabase } from '../lib/supabase'
import { sounds } from '../lib/sounds'
import { useStore } from '../lib/store'
import { BACKGROUNDS, SPRITE_TYPES, checkStep, emptyScene, type Scene, type SceneSprite, type SpriteTypeId } from './model'
import { compileRules } from './blocks'
import { StudioEngine } from './engine'
import StudioWorkspace from './StudioWorkspace'
import { Button, Card, Pill } from '../ui/kit'
import Cosmo from '../ui/Cosmo'

export interface GuidedStep {
  text: string
  check: string
}

let uidCounter = 1
const newUid = () => `s${Date.now().toString(36)}${uidCounter++}`

/** Le Studio : scène + règles + moteur de jeu + objectifs guidés. */
export default function StudioView({
  storageKey,
  steps,
  starter,
  onAllDone,
}: {
  storageKey: string
  steps?: GuidedStep[]
  starter?: { sprites?: Partial<SceneSprite>[]; xml?: string; bg?: string }
  onAllDone?: () => void
}) {
  const { session } = useStore()
  const wsRef = useRef<BlocklyNS.WorkspaceSvg | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const playLayerRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<StudioEngine | null>(null)
  const projectIdRef = useRef<string | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout>>()
  const [loaded, setLoaded] = useState(false)
  const [scene, setScene] = useState<Scene>(emptyScene)
  const [selected, setSelected] = useState<string | null>(null)
  const [tab, setTab] = useState<'scene' | 'regles'>('scene')
  const [playing, setPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [endState, setEndState] = useState<'won' | 'lost' | null>(null)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [wonOnce, setWonOnce] = useState(false)
  const [bestScore, setBestScore] = useState(0)
  const [rulesVersion, setRulesVersion] = useState(0)
  const [saved, setSaved] = useState(true)
  const [showSteps, setShowSteps] = useState(false)
  const horizontal = useMemo(() => window.innerWidth < 1024, [])

  /* ---- Chargement / sauvegarde ---- */
  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!session) return
      const { data } = await supabase
        .from('projects')
        .select('id, data')
        .eq('kind', storageKey)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (cancelled) return
      if (data?.data && typeof data.data === 'object') {
        projectIdRef.current = data.id
        const d = data.data as { scene?: Scene; xml?: string }
        if (d.scene) setScene(d.scene)
        if (d.xml) pendingXml.current = d.xml
      } else if (starter) {
        setScene({
          background: starter.bg ?? 'nuit',
          sprites: (starter.sprites ?? []).map((s) => ({
            uid: newUid(),
            type: (s.type ?? 'fusee') as SpriteTypeId,
            x: s.x ?? 50,
            y: s.y ?? 50,
            size: s.size ?? 1,
          })),
        })
        pendingXml.current = starter.xml
      }
      setLoaded(true)
    }
    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, storageKey])

  const pendingXml = useRef<string | undefined>(undefined)

  const scheduleSave = useCallback(() => {
    setSaved(false)
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      if (!session) return
      const xml = wsRef.current
        ? Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(wsRef.current))
        : pendingXml.current
      const payload = {
        user_id: session.user.id,
        kind: storageKey,
        title: storageKey === 'libre' ? 'Mon jeu libre' : storageKey,
        data: { scene, xml },
        updated_at: new Date().toISOString(),
      }
      if (projectIdRef.current) {
        await supabase.from('projects').update(payload).eq('id', projectIdRef.current)
      } else {
        const { data } = await supabase.from('projects').insert(payload).select('id').maybeSingle()
        if (data?.id) projectIdRef.current = data.id
      }
      setSaved(true)
    }, 1200)
  }, [scene, session, storageKey])

  useEffect(() => {
    if (loaded) scheduleSave()
  }, [scene, rulesVersion, loaded, scheduleSave])

  /* ---- Scène : ajout / déplacement / sélection ---- */

  function addSprite(type: SpriteTypeId) {
    const s: SceneSprite = {
      uid: newUid(),
      type,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      size: 1,
    }
    setScene((sc) => ({ ...sc, sprites: [...sc.sprites, s] }))
    setSelected(s.uid)
  }

  function patchSprite(uid: string, patch: Partial<SceneSprite>) {
    setScene((sc) => ({
      ...sc,
      sprites: sc.sprites.map((s) => (s.uid === uid ? { ...s, ...patch } : s)),
    }))
  }

  function removeSprite(uid: string) {
    setScene((sc) => ({ ...sc, sprites: sc.sprites.filter((s) => s.uid !== uid) }))
    setSelected(null)
  }

  const dragging = useRef<string | null>(null)
  function onStagePointerMove(e: React.PointerEvent) {
    if (!dragging.current || !stageRef.current) return
    const r = stageRef.current.getBoundingClientRect()
    const x = Math.max(3, Math.min(97, ((e.clientX - r.left) / r.width) * 100))
    const y = Math.max(4, Math.min(96, ((e.clientY - r.top) / r.height) * 100))
    patchSprite(dragging.current, { x, y })
  }

  /* ---- Jouer ---- */

  function play() {
    if (!wsRef.current || !playLayerRef.current) return
    const rules = compileRules(wsRef.current)
    setScore(0)
    setEndState(null)
    setPlaying(true)
    setHasPlayed(true)
    setTab('scene')
    engineRef.current?.destroy()
    const engine = new StudioEngine(playLayerRef.current, scene, rules, {
      onScore: (s) => {
        setScore(s)
        setBestScore((b) => Math.max(b, s))
      },
      onEnd: (won) => {
        setEndState(won ? 'won' : 'lost')
        if (won) {
          setWonOnce(true)
          confetti({ particleCount: 110, spread: 70, origin: { y: 0.6 }, colors: ['#8B63F7', '#17C3DE', '#FFD23F'] })
        }
      },
      onSound: (kind) => {
        if (kind === 'score') sounds.star()
        else if (kind === 'win') sounds.win()
        else if (kind === 'lose') sounds.lose()
        else sounds.click()
      },
    })
    engineRef.current = engine
    engine.start()
  }

  function stopPlay() {
    engineRef.current?.destroy()
    engineRef.current = null
    setPlaying(false)
    setEndState(null)
  }

  useEffect(() => () => engineRef.current?.destroy(), [])

  /* ---- Objectifs guidés ---- */

  const stepStatus = useMemo(() => {
    if (!steps || !wsRef.current) return []
    const rules = wsRef.current ? compileRules(wsRef.current) : { events: [] }
    return steps.map((st) =>
      checkStep(st.check, {
        scene,
        rules,
        hasPlayed,
        bestScore,
        won: wonOnce,
        lost: false,
        background: scene.background,
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps, scene, hasPlayed, bestScore, wonOnce, rulesVersion])

  const allDone = steps ? stepStatus.length === steps.length && stepStatus.every(Boolean) : false
  const doneNotified = useRef(false)
  useEffect(() => {
    if (allDone && !doneNotified.current) {
      doneNotified.current = true
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.5 }, colors: ['#FFD23F', '#8B63F7', '#5CE8A4'] })
      onAllDone?.()
    }
  }, [allDone, onAllDone])

  const bg = BACKGROUNDS.find((b) => b.id === scene.background) ?? BACKGROUNDS[0]

  if (!loaded) {
    return (
      <div className="flex h-full items-center justify-center">
        <Cosmo pose="think" float className="h-24 w-24" />
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-2 lg:flex-row lg:gap-3">
      {/* Colonne scène */}
      <div className={`flex flex-col gap-2 lg:w-[46%] ${tab !== 'scene' ? 'hidden lg:flex' : ''}`}>
        {/* La scène */}
        <div
          ref={stageRef}
          className="relative mx-auto w-full max-w-xl select-none overflow-hidden rounded-2xl border border-white/15"
          style={{ aspectRatio: '4 / 3', background: bg.css }}
          onPointerMove={onStagePointerMove}
          onPointerUp={() => (dragging.current = null)}
          onPointerLeave={() => (dragging.current = null)}
        >
          {/* Étoiles de fond */}
          <div className="pointer-events-none absolute inset-0 opacity-60">
            {[...Array(24)].map((_, i) => (
              <span
                key={i}
                className="absolute h-1 w-1 rounded-full bg-white/70"
                style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }}
              />
            ))}
          </div>

          {/* Sprites en mode édition */}
          {!playing &&
            scene.sprites.map((s) => (
              <div
                key={s.uid}
                onPointerDown={(e) => {
                  e.preventDefault()
                  dragging.current = s.uid
                  setSelected(s.uid)
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab leading-none active:cursor-grabbing ${
                  selected === s.uid ? 'rounded-full ring-4 ring-comet-400/80' : ''
                }`}
                style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: 30 * s.size }}
              >
                {SPRITE_TYPES.find((t) => t.id === s.type)?.emoji}
              </div>
            ))}

          {/* Couche de jeu */}
          <div ref={playLayerRef} className={`absolute inset-0 ${playing ? '' : 'hidden'}`} />

          {/* Score pendant le jeu */}
          {playing && (
            <div className="absolute left-2 top-2 z-20 rounded-xl bg-black/50 px-3 py-1 font-display text-lg font-bold">
              🏆 {score}
            </div>
          )}

          {/* Fin de partie */}
          {endState && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-black/60">
              <p className="font-display text-3xl font-bold">
                {endState === 'won' ? '🎉 GAGNÉ !' : '💥 Perdu…'}
              </p>
              <div className="flex gap-2">
                <Button variant="success" onClick={play}>
                  Rejouer
                </Button>
                <Button variant="secondary" onClick={stopPlay}>
                  Modifier
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Palette + contrôles */}
        {!playing ? (
          <>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {SPRITE_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => addSprite(t.id)}
                  className="grid h-11 w-11 place-items-center rounded-xl bg-space-700 text-2xl transition hover:bg-space-600 active:scale-95"
                  aria-label={`Ajouter ${t.name}`}
                  title={`Ajouter ${t.name}`}
                >
                  {t.emoji}
                </button>
              ))}
              <span className="mx-1 h-8 w-px bg-white/15" />
              {BACKGROUNDS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setScene((sc) => ({ ...sc, background: b.id }))}
                  className={`h-8 w-8 rounded-lg border-2 ${scene.background === b.id ? 'border-white' : 'border-white/20'}`}
                  style={{ background: b.css }}
                  aria-label={`Fond ${b.name}`}
                  title={b.name}
                />
              ))}
            </div>
            {selected && (
              <div className="flex items-center justify-center gap-2">
                <Pill className="bg-space-700 text-white/70">Personnage sélectionné :</Pill>
                <Button size="sm" variant="secondary" onClick={() => {
                  const s = scene.sprites.find((x) => x.uid === selected)
                  if (s) patchSprite(selected, { size: Math.min(2.2, s.size + 0.3) })
                }}>
                  ➕ grandir
                </Button>
                <Button size="sm" variant="secondary" onClick={() => {
                  const s = scene.sprites.find((x) => x.uid === selected)
                  if (s) patchSprite(selected, { size: Math.max(0.6, s.size - 0.3) })
                }}>
                  ➖ rétrécir
                </Button>
                <Button size="sm" variant="danger" onClick={() => removeSprite(selected)}>
                  🗑️
                </Button>
              </div>
            )}
          </>
        ) : (
          !endState && (
            <div className="flex justify-center">
              <Button variant="danger" onClick={stopPlay}>
                ■ Arrêter et modifier
              </Button>
            </div>
          )
        )}
      </div>

      {/* Colonne règles */}
      <div className={`min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/10 ${tab !== 'regles' ? 'hidden lg:block' : ''}`}>
        <StudioWorkspace
          initialXml={pendingXml.current}
          horizontal={horizontal}
          onWorkspace={(ws) => {
            wsRef.current = ws
            setRulesVersion((v) => v + 1)
          }}
          onChange={() => setRulesVersion((v) => v + 1)}
        />
      </div>

      {/* Barre mobile : onglets + objectifs + jouer */}
      <div className="sticky bottom-0 z-20 -mx-1 flex items-center gap-2 bg-space-950/90 p-2 backdrop-blur lg:hidden">
        <div className="flex flex-1 overflow-hidden rounded-xl border border-white/15">
          <button
            onClick={() => setTab('scene')}
            className={`flex-1 py-2 font-display text-sm font-bold ${tab === 'scene' ? 'bg-nebula-500' : 'bg-space-800'}`}
          >
            🎭 Scène
          </button>
          <button
            onClick={() => setTab('regles')}
            className={`flex-1 py-2 font-display text-sm font-bold ${tab === 'regles' ? 'bg-nebula-500' : 'bg-space-800'}`}
          >
            🧩 Règles
          </button>
        </div>
        {steps && (
          <button
            onClick={() => setShowSteps(true)}
            className="rounded-xl border border-star-400/40 bg-star-400/15 px-3 py-2 font-display text-sm font-bold text-star-300"
          >
            🎯 {stepStatus.filter(Boolean).length}/{steps.length}
          </button>
        )}
        <Button variant="success" onClick={playing ? stopPlay : play}>
          {playing ? '■' : '▶ JOUER'}
        </Button>
      </div>

      {/* Objectifs en plein écran (mobile) */}
      {steps && showSteps && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 lg:hidden" onClick={() => setShowSteps(false)}>
          <div className="w-full max-w-md animate-slide-up rounded-t-3xl bg-space-800 p-6" onClick={(e) => e.stopPropagation()}>
            <p className="mb-3 font-display text-lg font-bold text-star-400">🎯 Objectifs</p>
            <ul className="flex flex-col gap-2">
              {steps.map((st, i) => (
                <li key={i} className={`flex items-start gap-2 font-semibold ${stepStatus[i] ? 'text-mint-400' : 'text-white/80'}`}>
                  <span>{stepStatus[i] ? '✅' : '⬜'}</span>
                  <span>{st.text}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-4 w-full" variant="secondary" onClick={() => setShowSteps(false)}>
              Compris !
            </Button>
          </div>
        </div>
      )}

      {/* Bouton jouer desktop */}
      <div className="hidden lg:block absolute right-6 top-3 z-20">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">{saved ? 'Sauvegardé ✓' : 'Sauvegarde…'}</span>
          <Button variant="success" onClick={playing ? stopPlay : play}>
            {playing ? '■ Arrêter' : '▶ JOUER'}
          </Button>
        </div>
      </div>

      {/* Objectifs guidés (desktop) */}
      {steps && (
        <Card className="hidden lg:block lg:absolute lg:left-6 lg:bottom-4 lg:max-w-xs p-4 lg:z-20">
          <p className="mb-2 font-display font-bold text-star-400">🎯 Objectifs</p>
          <ul className="flex flex-col gap-1.5">
            {steps.map((st, i) => (
              <li key={i} className={`flex items-start gap-2 text-sm font-semibold ${stepStatus[i] ? 'text-mint-400' : 'text-white/75'}`}>
                <span>{stepStatus[i] ? '✅' : '⬜'}</span>
                <span>{st.text}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
