import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import type { LessonMeta, QuizContent, World } from '../curriculum/types'
import { nextLessonId } from '../curriculum'
import { useStore } from '../lib/store'
import Cosmo from '../ui/Cosmo'
import { Button, Card } from '../ui/kit'

/** Quiz de prédiction : lire un programme et deviner ce qu'il fait (PRIMM). */
export default function QuizPlayer({
  lesson,
  world,
  content,
}: {
  lesson: LessonMeta
  world: World
  content: QuizContent
}) {
  const navigate = useNavigate()
  const { recordLessonResult } = useStore()
  const [qIndex, setQIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [wrongPicks, setWrongPicks] = useState<number[]>([])
  const [mistakes, setMistakes] = useState(0)
  const [done, setDone] = useState<{ stars: number; xp: number } | null>(null)

  const q = content.questions[qIndex]
  const correct = picked === q.answer

  function choose(i: number) {
    if (correct) return
    setPicked(i)
    if (i !== q.answer) {
      setMistakes((m) => m + 1)
      setWrongPicks((w) => [...w, i])
    }
  }

  async function nextQuestion() {
    if (qIndex < content.questions.length - 1) {
      setQIndex(qIndex + 1)
      setPicked(null)
      setWrongPicks([])
    } else {
      const stars = mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1
      const { xpGained } = await recordLessonResult(lesson.id, stars)
      setDone({ stars, xp: xpGained })
      confetti({ particleCount: 90, spread: 60, origin: { y: 0.7 }, colors: ['#8B63F7', '#17C3DE', '#FFD23F'] })
    }
  }

  const next = nextLessonId(lesson.id)

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
        <div className="flex-1">
          <p className="font-display font-bold leading-tight">{lesson.title}</p>
          <p className="text-xs text-white/50">
            Question {qIndex + 1}/{content.questions.length}
          </p>
        </div>
        <Cosmo pose={correct ? 'cheer' : 'think'} className="h-12 w-12" />
      </header>

      <div className="flex flex-1 flex-col justify-center gap-4 py-4">
        <p className="text-lg font-bold">{q.question}</p>

        {q.program && (
          <Card className="p-4">
            {q.program.map((line, i) => {
              const indent = line.length - line.trimStart().length
              return (
                <div
                  key={i}
                  className="mb-1.5 w-fit rounded-lg px-3 py-1.5 font-display text-sm font-semibold text-white"
                  style={{
                    marginLeft: indent * 8,
                    backgroundColor: line.includes('répéter') || line.includes('tant que')
                      ? '#17C3DE'
                      : line.includes('si') || line.includes('sinon')
                        ? '#C08A00'
                        : line.includes('départ')
                          ? '#B67B00'
                          : '#8B63F7',
                  }}
                >
                  {line.trim()}
                </div>
              )
            })}
          </Card>
        )}

        <div className="flex flex-col gap-2">
          {q.choices.map((c, i) => {
            const isRight = correct && i === q.answer
            const isWrong = wrongPicks.includes(i)
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={isWrong}
                className={`rounded-2xl border-b-4 px-4 py-3 text-left font-semibold transition active:translate-y-[2px] active:border-b-2
                  ${isRight
                    ? 'border-mint-600 bg-mint-500 text-space-950'
                    : isWrong
                      ? 'border-coral-600 bg-coral-500/40 text-white/60 line-through'
                      : 'border-space-900 bg-space-700 hover:bg-space-600'
                  }`}
              >
                {c}
              </button>
            )
          })}
        </div>

        {picked !== null && !correct && (
          <p className="animate-pop-in font-semibold text-coral-400">
            Pas tout à fait… regarde bien le programme et réessaie !
          </p>
        )}
        {correct && (
          <Card className="animate-pop-in border-mint-500/40 p-4">
            <p className="font-semibold text-mint-400">✓ Exact !</p>
            <p className="mt-1 text-sm text-white/80">{q.explain}</p>
          </Card>
        )}
      </div>

      <div className="pb-4">
        <Button className="w-full" size="lg" disabled={!correct} onClick={nextQuestion}>
          {qIndex < content.questions.length - 1 ? 'Question suivante →' : 'Terminer ✓'}
        </Button>
      </div>

      {done && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center">
          <div className="w-full max-w-md animate-slide-up rounded-t-3xl bg-space-800 p-6 text-center sm:rounded-3xl">
            <Cosmo pose="cheer" className="mx-auto h-24 w-24" />
            <h2 className="mt-2 font-display text-2xl font-bold text-star-400">Quiz terminé !</h2>
            <div className="my-3 flex justify-center gap-2 text-4xl">
              {[1, 2, 3].map((i) => (
                <span key={i} className={i <= done.stars ? 'animate-pop-in' : 'opacity-20 grayscale'} style={{ animationDelay: `${i * 0.2}s` }}>
                  ⭐
                </span>
              ))}
            </div>
            <p className="font-display font-bold text-comet-400">+{done.xp} points ✨</p>
            <Button
              className="mt-4 w-full"
              size="lg"
              onClick={() => navigate(next ? `/app/lecon/${next}` : '/app')}
            >
              Continuer →
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
