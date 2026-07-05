import { Link } from 'react-router-dom'
import StarField from '../ui/StarField'
import PuzzlePlayer from '../game/PuzzlePlayer'
import { findLesson } from '../curriculum'
import { getContent } from '../curriculum/content'
import Logo from '../ui/Logo'

/** La mission d'essai : jouable sans compte, pour découvrir AstroCode. */
export default function Demo() {
  const found = findLesson('lune-1')
  const content = getContent('lune-1')

  if (!found || !content || content.kind !== 'grid') return null

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarField />
      <div className="relative z-10">
        <div className="flex items-center justify-between px-3 pt-2">
          <Link to="/">
            <Logo className="h-7" />
          </Link>
          <span className="rounded-full bg-star-400/15 px-3 py-1 text-xs font-bold text-star-300">
            Mission d’essai gratuite
          </span>
        </div>
        <PuzzlePlayer demo lesson={found.lesson} world={found.world} content={content} />
      </div>
    </div>
  )
}
