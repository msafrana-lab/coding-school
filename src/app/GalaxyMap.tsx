import { useStore } from '../lib/store'
import Cosmo from '../ui/Cosmo'
import { SpeechBubble } from '../ui/kit'

/** Carte de la galaxie — remplacée par la vraie carte à l'étape suivante. */
export default function GalaxyMap() {
  const { profile } = useStore()
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-16 text-center">
      <SpeechBubble tail="bottom">
        Bienvenue à bord, <b>{profile?.display_name}</b> ! La carte de la galaxie arrive bientôt…
      </SpeechBubble>
      <Cosmo pose="cheer" float className="h-36 w-36" />
    </div>
  )
}
