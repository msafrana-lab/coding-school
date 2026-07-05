import { useState } from 'react'
import { Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { useStore } from '../lib/store'
import type { LessonMeta } from '../curriculum/types'
import Cosmo from '../ui/Cosmo'
import { Button } from '../ui/kit'

function today(): string {
  return new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Le diplôme de fin de voyage — à imprimer et encadrer ! */
export default function DiplomaPlayer({ lesson }: { lesson: LessonMeta }) {
  const { profile, recordLessonResult, progress } = useStore()
  const [revealed, setRevealed] = useState(progress[lesson.id]?.completed ?? false)

  async function reveal() {
    await recordLessonResult(lesson.id, 3)
    setRevealed(true)
    confetti({ particleCount: 250, spread: 110, origin: { y: 0.6 }, colors: ['#FFD23F', '#8B63F7', '#17C3DE', '#FF6B81', '#5CE8A4'] })
    setTimeout(() => confetti({ particleCount: 150, spread: 90, origin: { y: 0.3 } }), 600)
  }

  if (!revealed) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-4 text-center">
        <Cosmo pose="cheer" float className="h-36 w-36" />
        <h1 className="font-display text-3xl font-bold">
          Tu as traversé toute la galaxie du code…
        </h1>
        <p className="text-white/70">
          Les ordres, les boucles, les choix, la mémoire, les recettes, les jeux, le vrai
          JavaScript — et TON propre jeu. Il ne reste qu’une chose à faire.
        </p>
        <Button size="lg" onClick={reveal}>
          🎓 Recevoir mon diplôme
        </Button>
        <Link to="/app" className="text-sm text-white/50 hover:underline">
          ← Retour à la carte
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center gap-6 px-4 py-10">
      <div className="print-diplome w-full rounded-[28px] border-[6px] border-star-400 bg-gradient-to-b from-space-800 to-space-900 p-8 text-center shadow-glow sm:p-12">
        <p className="font-display text-sm font-bold tracking-[0.3em] text-star-400">ASTROCODE</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">Diplôme</h1>
        <p className="mt-1 font-display text-xl text-comet-300">de Créatrice de Jeux</p>

        <div className="mx-auto my-6 h-px w-2/3 bg-white/20" />

        <p className="text-white/70">est fièrement décerné à</p>
        <p className="my-3 font-display text-4xl font-bold text-star-300">
          {profile?.display_name ?? 'Astronaute'} {profile?.avatar}
        </p>
        <p className="mx-auto max-w-md text-white/70">
          pour avoir traversé les 8 planètes de la galaxie du code : les ordres, les boucles,
          les choix, la mémoire, les recettes, la création de jeux… jusqu’au vrai JavaScript,
          et pour avoir créé son propre jeu vidéo de A à Z.
        </p>

        <div className="mt-8 flex items-end justify-between">
          <div className="text-left">
            <p className="text-sm text-white/50">Fait dans la galaxie, le</p>
            <p className="font-display font-bold">{today()}</p>
          </div>
          <div className="flex flex-col items-center">
            <Cosmo pose="cheer" className="h-20 w-20" />
            <p className="font-display text-sm font-bold text-nebula-300">Cosmo, copilote officiel</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 print:hidden">
        <Button variant="star" size="lg" onClick={() => window.print()}>
          🖨️ Imprimer mon diplôme
        </Button>
        <Link to="/app">
          <Button variant="secondary" size="lg">
            ← La carte
          </Button>
        </Link>
      </div>
      <p className="max-w-md text-center text-white/60 print:hidden">
        Et maintenant ? Le <b>Studio libre</b> t’attend pour inventer tous les jeux que tu veux.
        Un jour, peut-être, tu écriras les tiens en vrai code, comme les pros. 💜
      </p>
    </div>
  )
}
