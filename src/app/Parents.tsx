import { useStore } from '../lib/store'
import { Button, Card } from '../ui/kit'

/** Coin parents — enrichi plus tard (stats détaillées, porte adulte). */
export default function Parents() {
  const { profile, signOut } = useStore()
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-10">
      <Card className="p-6 text-center">
        <div className="mb-2 text-5xl">{profile?.avatar}</div>
        <h1 className="text-2xl font-bold">{profile?.display_name}</h1>
        <p className="mt-1 text-white/60">⭐ {profile?.xp} points · 🔥 série de {profile?.streak_count} jour(s)</p>
      </Card>
      <Button variant="secondary" onClick={() => signOut()}>
        Se déconnecter
      </Button>
    </div>
  )
}
