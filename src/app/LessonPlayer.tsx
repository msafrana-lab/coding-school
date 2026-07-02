import { Link, useParams } from 'react-router-dom'
import { findLesson } from '../curriculum'
import Cosmo from '../ui/Cosmo'
import { Button, SpeechBubble } from '../ui/kit'

/** Lecteur de mission — le moteur de puzzles arrive à l'étape suivante. */
export default function LessonPlayer() {
  const { id } = useParams()
  const found = id ? findLesson(id) : null

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
