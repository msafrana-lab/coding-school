import { useState } from 'react'
import { useStore } from '../lib/store'
import StarField from '../ui/StarField'
import Cosmo from '../ui/Cosmo'
import { Button, Card, SpeechBubble } from '../ui/kit'

const AVATARS = ['🦊', '🐱', '🐼', '🦄', '👾', '🤖', '🐸', '🐧', '🐯', '🦋', '🌟', '🚀']

/** Premier passage : l'enfant choisit son prénom d'astronaute et son avatar. */
export default function Onboarding() {
  const { saveProfile } = useStore()
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('🦊')
  const [busy, setBusy] = useState(false)

  async function go() {
    if (!name.trim()) return
    setBusy(true)
    await saveProfile({ display_name: name.trim(), avatar })
    setBusy(false)
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-8">
      <StarField />
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-4">
        <SpeechBubble tail="bottom" className="animate-pop-in">
          Salut, moi c’est <b>Cosmo</b> ! Et toi, comment tu t’appelles ?
        </SpeechBubble>
        <Cosmo pose="hello" float className="h-32 w-32" />

        <Card className="w-full p-6">
          <label className="mb-2 block font-display text-lg font-semibold">Ton prénom d’astronaute</label>
          <input
            autoFocus
            maxLength={20}
            placeholder="Écris ton prénom…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && go()}
            className="mb-5 w-full rounded-xl border border-white/15 bg-space-900/70 px-4 py-3 text-lg text-white placeholder-white/40 outline-none focus:border-nebula-400"
          />

          <p className="mb-2 font-display text-lg font-semibold">Choisis ton avatar</p>
          <div className="mb-6 grid grid-cols-6 gap-2">
            {AVATARS.map((a) => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                className={`grid aspect-square place-items-center rounded-xl text-2xl transition ${
                  avatar === a
                    ? 'bg-nebula-500 shadow-glow scale-110'
                    : 'bg-space-900/70 hover:bg-space-700'
                }`}
                aria-label={`Avatar ${a}`}
              >
                {a}
              </button>
            ))}
          </div>

          <Button className="w-full" size="lg" disabled={!name.trim() || busy} onClick={go}>
            {busy ? 'Préparation…' : '🚀 En route vers la galaxie !'}
          </Button>
        </Card>
      </div>
    </div>
  )
}
