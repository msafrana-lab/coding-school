import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { LessonMeta, StudioContent, World } from '../curriculum/types'
import { nextLessonId } from '../curriculum'
import { useStore } from '../lib/store'
import StudioView, { type GuidedStep } from '../studio/StudioView'
import type { SceneSprite } from '../studio/model'
import Cosmo from '../ui/Cosmo'
import { Button } from '../ui/kit'

/** Une mission Studio : le Studio + des objectifs à cocher. */
export default function StudioLessonPlayer({
  lesson,
  world,
  content,
}: {
  lesson: LessonMeta
  world: World
  content: StudioContent
}) {
  const navigate = useNavigate()
  const { recordLessonResult } = useStore()
  const [done, setDone] = useState<{ xp: number } | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const next = nextLessonId(lesson.id)

  async function complete() {
    const { xpGained } = await recordLessonResult(lesson.id, 3)
    setDone({ xp: xpGained })
  }

  return (
    <div className="flex h-[100dvh] flex-col px-3 pb-2">
      <header className="relative z-20 flex items-center gap-2 py-2">
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
            {world.name} · {world.concept}
          </p>
        </div>
      </header>

      <div className="relative mb-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-space-900 shadow-card">
        {content.brief}
      </div>

      <div className="relative min-h-0 flex-1">
        <StudioView
          storageKey={lesson.id}
          steps={content.steps as GuidedStep[]}
          starter={content.starter as { sprites?: Partial<SceneSprite>[]; xml?: string; bg?: string } | undefined}
          onAllDone={complete}
        />
      </div>

      {done && !dismissed && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center">
          <div className="w-full max-w-md animate-slide-up rounded-t-3xl bg-space-800 p-6 text-center sm:rounded-3xl">
            <Cosmo pose="cheer" className="mx-auto h-28 w-28" />
            <h2 className="mt-2 font-display text-3xl font-bold text-star-400">
              Tous les objectifs accomplis !
            </h2>
            <p className="mt-1 text-white/70">Ton jeu est sauvegardé dans ton Studio 💾</p>
            <p className="mt-1 font-display font-bold text-comet-400">+{done.xp} points ✨</p>
            <div className="mt-5 flex flex-col gap-2">
              <Button size="lg" onClick={() => navigate(next ? `/app/lecon/${next}` : '/app')}>
                {next ? 'Mission suivante →' : 'Retour à la carte'}
              </Button>
              <Button variant="ghost" onClick={() => setDismissed(true)}>
                Continuer à bricoler mon jeu
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
