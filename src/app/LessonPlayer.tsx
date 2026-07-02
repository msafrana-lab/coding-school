import { Link, useParams } from 'react-router-dom'
import { findLesson } from '../curriculum'
import { getContent } from '../curriculum/content'
import PuzzlePlayer from '../game/PuzzlePlayer'
import StoryPlayer from '../game/StoryPlayer'
import QuizPlayer from '../game/QuizPlayer'
import StudioLessonPlayer from '../game/StudioLessonPlayer'
import Cosmo from '../ui/Cosmo'
import { Button, SpeechBubble } from '../ui/kit'

/** Aiguillage : chaque mission ouvre le bon lecteur selon son contenu. */
export default function LessonPlayer() {
  const { id } = useParams()
  const found = id ? findLesson(id) : null
  const content = id ? getContent(id) : undefined

  if (!found) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <Cosmo pose="oops" className="h-28 w-28" />
        <p className="font-display text-xl">Cette mission n’existe pas…</p>
        <Link to="/app">
          <Button variant="secondary">Retour à la carte</Button>
        </Link>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-5 px-4 text-center">
        <SpeechBubble tail="bottom">
          <b>{found.lesson.title}</b> — cette mission ouvre très bientôt !
        </SpeechBubble>
        <Cosmo pose="think" float className="h-32 w-32" />
        <Link to="/app">
          <Button variant="secondary">← Retour à la carte</Button>
        </Link>
      </div>
    )
  }

  switch (content.kind) {
    case 'story':
      return <StoryPlayer lesson={found.lesson} world={found.world} content={content} />
    case 'quiz':
      return <QuizPlayer lesson={found.lesson} world={found.world} content={content} />
    case 'grid':
      return <PuzzlePlayer lesson={found.lesson} world={found.world} content={content} />
    case 'studio':
      return <StudioLessonPlayer lesson={found.lesson} world={found.world} content={content} />
    default:
      return null
  }
}
