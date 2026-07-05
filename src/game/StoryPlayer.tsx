import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { LessonMeta, StoryContent, World } from '../curriculum/types'
import { nextLessonId } from '../curriculum'
import { useStore } from '../lib/store'
import Cosmo from '../ui/Cosmo'
import { Button, Card } from '../ui/kit'

/** Les histoires de Cosmo : la notion expliquée en 3-4 écrans illustrés. */
export default function StoryPlayer({
  lesson,
  world,
  content,
}: {
  lesson: LessonMeta
  world: World
  content: StoryContent
}) {
  const navigate = useNavigate()
  const { recordLessonResult } = useStore()
  const [page, setPage] = useState(0)
  const [busy, setBusy] = useState(false)
  const p = content.pages[page]
  const last = page === content.pages.length - 1

  async function finish() {
    setBusy(true)
    await recordLessonResult(lesson.id, 3)
    const next = nextLessonId(lesson.id)
    navigate(next ? `/app/lecon/${next}` : '/app')
  }

  return (
    <div className="mx-auto flex h-[100dvh] max-w-md flex-col px-4 py-3">
      <header className="flex items-center gap-2">
        <Link
          to="/app"
          className="grid h-9 w-9 place-items-center rounded-xl bg-space-700 text-lg hover:bg-space-600"
          aria-label="Quitter"
        >
          ✕
        </Link>
        <div>
          <p className="font-display font-bold leading-tight">{lesson.title}</p>
          <p className="text-xs text-white/50">
            {world.name} · {world.concept}
          </p>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        {p.art && <div className="animate-pop-in text-6xl" key={`art${page}`}>{p.art}</div>}
        <Card className="w-full p-6" key={`card${page}`}>
          <p className="animate-slide-up text-lg font-semibold leading-relaxed">{p.text}</p>
        </Card>
        <Cosmo pose={p.cosmo} float className="h-28 w-28" />
      </div>

      <div className="flex items-center justify-between gap-3 pb-4">
        <div className="flex gap-1.5">
          {content.pages.map((_, i) => (
            <span
              key={i}
              className={`h-2.5 w-2.5 rounded-full ${i === page ? 'bg-comet-400' : 'bg-white/20'}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          {page > 0 && (
            <Button variant="secondary" onClick={() => setPage(page - 1)}>
              ←
            </Button>
          )}
          {last ? (
            <Button variant="success" size="lg" disabled={busy} onClick={finish}>
              {busy ? '…' : 'J’ai compris ! ✓'}
            </Button>
          ) : (
            <Button size="lg" onClick={() => setPage(page + 1)}>
              Suivant →
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
