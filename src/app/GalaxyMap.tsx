import { useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { WORLDS } from '../curriculum'
import type { LessonMeta, LessonType, World } from '../curriculum/types'
import { useStore } from '../lib/store'
import Planet from '../ui/Planet'
import Cosmo from '../ui/Cosmo'

const ICONS: Record<LessonType, string> = {
  histoire: '📖',
  puzzle: '🧩',
  repare: '🔧',
  quiz: '❓',
  defi: '👑',
  code: '⌨️',
  studio: '🎮',
  projet: '🛠️',
}

/** Décalages horizontaux du chemin serpentin (répétés) */
const OFFSETS = [0, 76, 116, 76, 0, -76, -116, -76]

type Status = 'done' | 'current' | 'locked'

function StarsRow({ stars }: { stars: number }) {
  return (
    <div className="flex justify-center gap-0.5 text-sm" aria-label={`${stars} étoiles`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= stars ? '' : 'opacity-20 grayscale'}>
          ⭐
        </span>
      ))}
    </div>
  )
}

function LessonNode({
  lesson,
  status,
  stars,
  color,
  offset,
  isFirstOfAll,
  currentRef,
}: {
  lesson: LessonMeta
  status: Status
  stars: number
  color: string
  offset: number
  isFirstOfAll: boolean
  currentRef: React.RefObject<HTMLDivElement> | null
}) {
  const inner = (
    <div
      className={`grid h-[68px] w-[68px] place-items-center rounded-full text-3xl transition
        ${status === 'locked' ? 'bg-space-700/80 border-b-4 border-space-900 opacity-60' : 'border-b-4'}
        ${status !== 'locked' ? 'hover:scale-105 active:translate-y-[3px] active:border-b-0' : ''}`}
      style={
        status === 'locked'
          ? undefined
          : { backgroundColor: color, borderBottomColor: 'rgba(0,0,0,0.35)' }
      }
    >
      <span className={status === 'locked' ? 'opacity-60 grayscale' : ''}>
        {status === 'locked' ? '🔒' : ICONS[lesson.type]}
      </span>
    </div>
  )

  return (
    <div
      ref={currentRef ?? undefined}
      className="relative flex flex-col items-center py-3"
      style={{ transform: `translateX(${offset}px)` }}
    >
      {status === 'current' && (
        <>
          <div className="pointer-events-none absolute -top-5 z-10 animate-bounce whitespace-nowrap rounded-xl bg-white px-3 py-1 font-display text-xs font-bold text-space-900 shadow-card">
            {isFirstOfAll ? 'COMMENCE ICI !' : 'CONTINUE ICI !'}
          </div>
          <span
            className="pointer-events-none absolute top-3 h-[68px] w-[68px] animate-ping rounded-full opacity-30"
            style={{ backgroundColor: color }}
            aria-hidden
          />
          <div
            className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${offset >= 0 ? '-left-24' : '-right-24'} hidden sm:block`}
            aria-hidden
          >
            <Cosmo pose="point" float className="h-20 w-20" />
          </div>
        </>
      )}

      {status === 'locked' ? (
        <div aria-label={`${lesson.title} (verrouillée)`}>{inner}</div>
      ) : (
        <Link to={`/app/lecon/${lesson.id}`} aria-label={lesson.title}>
          {inner}
        </Link>
      )}

      <p
        className={`mt-1 max-w-[130px] text-center font-display text-sm font-semibold leading-tight ${
          status === 'locked' ? 'text-white/30' : 'text-white/85'
        }`}
      >
        {lesson.title}
      </p>
      {status === 'done' && <StarsRow stars={stars} />}
    </div>
  )
}

function WorldBanner({ world, index, done, total }: { world: World; index: number; done: number; total: number }) {
  const pct = Math.round((done / total) * 100)
  return (
    <div
      className="relative mx-auto mt-10 mb-2 flex w-full max-w-md items-center gap-4 overflow-hidden rounded-3xl border p-4"
      style={{
        borderColor: `${world.color}55`,
        background: `linear-gradient(120deg, ${world.color}26, rgba(11,16,53,0.6))`,
      }}
    >
      <div className="min-w-0 flex-1">
        <p className="font-display text-xs font-bold tracking-widest text-white/50">
          PLANÈTE {index + 1}
        </p>
        <h2 className="truncate font-display text-2xl font-bold">
          {world.name} <span className="text-white/60">· {world.concept}</span>
        </h2>
        <p className="mt-0.5 text-sm text-white/70">{world.intro}</p>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, backgroundColor: world.color }}
            />
          </div>
          <span className="font-display text-xs font-bold text-white/60">
            {done}/{total}
          </span>
        </div>
      </div>
      <Planet color={world.color} ring={world.ring} className="h-16 w-16 shrink-0 sm:h-20 sm:w-20" />
    </div>
  )
}

export default function GalaxyMap() {
  const { profile, progress } = useStore()
  const navigate = useNavigate()
  const currentRef = useRef<HTMLDivElement>(null)

  // Statut de chaque leçon : faites → done, la première non faite → current, le reste → locked
  const { statuses, currentId } = useMemo(() => {
    const statuses: Record<string, Status> = {}
    let currentId: string | null = null
    for (const w of WORLDS) {
      for (const l of w.lessons) {
        if (progress[l.id]?.completed) statuses[l.id] = 'done'
        else if (!currentId) {
          statuses[l.id] = 'current'
          currentId = l.id
        } else statuses[l.id] = 'locked'
      }
    }
    return { statuses, currentId }
  }, [progress])

  useEffect(() => {
    // Amène la carte sur la mission du jour
    const t = setTimeout(
      () => currentRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }),
      150,
    )
    return () => clearTimeout(t)
  }, [currentId])

  const doneCount = Object.values(statuses).filter((s) => s === 'done').length
  let flatIndex = -1

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24">
      <p className="mt-2 text-center font-display text-lg text-white/80">
        Salut <b className="text-white">{profile?.display_name}</b> !{' '}
        {doneCount === 0 ? 'Prête pour ta première mission ?' : 'On continue le voyage ?'}
      </p>

      {WORLDS.map((world, wi) => {
        const done = world.lessons.filter((l) => statuses[l.id] === 'done').length
        return (
          <section key={world.id}>
            <WorldBanner world={world} index={wi} done={done} total={world.lessons.length} />
            <div className="flex flex-col items-center">
              {world.lessons.map((lesson, li) => {
                flatIndex++
                const status = statuses[lesson.id]
                return (
                  <LessonNode
                    key={lesson.id}
                    lesson={lesson}
                    status={status}
                    stars={progress[lesson.id]?.stars ?? 0}
                    color={world.color}
                    offset={OFFSETS[li % OFFSETS.length]}
                    isFirstOfAll={flatIndex === 0}
                    currentRef={status === 'current' ? currentRef : null}
                  />
                )
              })}
            </div>
          </section>
        )
      })}

      {/* Accès rapide au Studio sur mobile */}
      <button
        onClick={() => navigate('/app/studio')}
        className="fixed bottom-5 right-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-nebula-500 text-2xl shadow-glow transition active:scale-90 sm:hidden"
        aria-label="Ouvrir le Studio"
      >
        🎮
      </button>

      <div className="mt-12 flex flex-col items-center gap-2 pb-8 text-center">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-star-400/15 text-5xl shadow-glow">
          🎓
        </div>
        <p className="font-display text-lg font-bold text-star-400">Le diplôme AstroCode</p>
        <p className="max-w-xs text-sm text-white/60">
          Termine le Grand Voyage pour recevoir ton diplôme de créatrice de jeux !
        </p>
      </div>
    </div>
  )
}
