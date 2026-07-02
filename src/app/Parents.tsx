import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useStore } from '../lib/store'
import { WORLDS } from '../curriculum'
import { Button, Card } from '../ui/kit'
import Cosmo from '../ui/Cosmo'
import { soundConfig } from '../lib/sounds'

/** Une petite porte que seuls les grands savent ouvrir. */
function AdultGate({ onOpen }: { onOpen: () => void }) {
  const [q] = useState(() => {
    const a = 6 + Math.floor(Math.random() * 4) // 6-9
    const b = 6 + Math.floor(Math.random() * 4)
    return { a, b }
  })
  const [answer, setAnswer] = useState('')
  const [wrong, setWrong] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (Number(answer) === q.a * q.b) {
      sessionStorage.setItem('porte-parents', 'ouverte')
      onOpen()
    } else {
      setWrong(true)
      setAnswer('')
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-5 px-4 py-16 text-center">
      <Cosmo pose="think" className="h-24 w-24" />
      <h1 className="font-display text-2xl font-bold">Le coin des parents</h1>
      <p className="text-white/70">
        Cette porte est réservée aux grandes personnes. Pour l’ouvrir, réponds à cette question :
      </p>
      <Card className="w-full p-6">
        <p className="mb-3 font-display text-3xl font-bold">
          {q.a} × {q.b} = ?
        </p>
        <form onSubmit={submit} className="flex gap-2">
          <input
            type="number"
            inputMode="numeric"
            autoFocus
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-space-900/70 px-4 py-3 text-center text-xl font-bold text-white outline-none focus:border-nebula-400"
          />
          <Button type="submit">Entrer</Button>
        </form>
        {wrong && <p className="mt-2 text-sm font-semibold text-coral-400">Hmm, pas tout à fait…</p>}
      </Card>
    </div>
  )
}

type DayActivity = { day: string; minutes: number; lessons_done: number }

/** Tableau de bord simple : où en est l'enfant, en un coup d'œil. */
export default function Parents() {
  const { profile, progress, signOut, saveProfile, session } = useStore()
  const [open, setOpen] = useState(() => sessionStorage.getItem('porte-parents') === 'ouverte')
  const [week, setWeek] = useState<DayActivity[]>([])

  useEffect(() => {
    if (!open || !session) return
    supabase
      .from('activity_log')
      .select('day, minutes, lessons_done')
      .order('day', { ascending: false })
      .limit(7)
      .then(({ data }) => setWeek((data as DayActivity[] | null) ?? []))
  }, [open, session])

  const stats = useMemo(() => {
    let done = 0
    let stars = 0
    for (const p of Object.values(progress)) {
      if (p.completed) done++
      stars += p.stars
    }
    const total = WORLDS.reduce((n, w) => n + w.lessons.length, 0)
    return { done, stars, total }
  }, [progress])

  const weekMinutes = week.reduce((n, d) => n + d.minutes, 0)
  const currentWorld =
    WORLDS.find((w) => w.lessons.some((l) => !progress[l.id]?.completed)) ?? WORLDS[WORLDS.length - 1]

  if (!open) return <AdultGate onOpen={() => setOpen(true)} />

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-8 pb-16">
      <div className="flex items-center gap-3">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-space-700 text-3xl">
          {profile?.avatar}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">{profile?.display_name}</h1>
          <p className="text-sm text-white/60">
            En ce moment : <b style={{ color: currentWorld.color }}>{currentWorld.name}</b> ·{' '}
            {currentWorld.concept}
          </p>
        </div>
      </div>

      {/* Chiffres clés */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { n: stats.done, label: `mission${stats.done > 1 ? 's' : ''} sur ${stats.total}`, icon: '✅' },
          { n: stats.stars, label: 'étoiles gagnées', icon: '⭐' },
          { n: profile?.streak_count ?? 0, label: 'jours d’affilée', icon: '🔥' },
          { n: weekMinutes, label: 'min cette semaine', icon: '⏱️' },
        ].map((s, i) => (
          <Card key={i} className="p-4 text-center">
            <p className="text-2xl">{s.icon}</p>
            <p className="font-display text-3xl font-bold">{s.n}</p>
            <p className="text-xs text-white/60">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Progression par planète */}
      <Card className="p-5">
        <h2 className="mb-3 font-display text-lg font-bold">Progression du voyage</h2>
        <div className="flex flex-col gap-2.5">
          {WORLDS.map((w, i) => {
            const done = w.lessons.filter((l) => progress[l.id]?.completed).length
            const pct = Math.round((done / w.lessons.length) * 100)
            return (
              <div key={w.id} className="flex items-center gap-3">
                <span className="w-6 text-right font-display text-xs font-bold text-white/40">
                  {i + 1}
                </span>
                <span className="w-28 truncate text-sm font-semibold">{w.name}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: w.color }}
                  />
                </div>
                <span className="w-10 text-right text-xs font-bold text-white/60">
                  {done}/{w.lessons.length}
                </span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Activité des 7 derniers jours */}
      <Card className="p-5">
        <h2 className="mb-3 font-display text-lg font-bold">Les 7 derniers jours</h2>
        {week.length === 0 ? (
          <p className="text-sm text-white/60">Pas encore d’activité enregistrée.</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {week.map((d) => (
              <div key={d.day} className="flex items-center gap-3 text-sm">
                <span className="w-24 text-white/60">
                  {new Date(d.day + 'T12:00:00').toLocaleDateString('fr-FR', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-comet-500"
                    style={{ width: `${Math.min(100, (d.minutes / 60) * 100)}%` }}
                  />
                </div>
                <span className="w-24 text-right text-white/60">
                  {d.minutes} min · {d.lessons_done} mission{d.lessons_done > 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* La méthode */}
      <Card className="p-5">
        <h2 className="mb-2 font-display text-lg font-bold">La méthode, en deux mots</h2>
        <p className="text-sm leading-relaxed text-white/70">
          AstroCode suit la progression recommandée par les références de l’enseignement du code
          (fondation Raspberry Pi, méthode PRIMM) : l’enfant <b>observe</b> un programme,{' '}
          <b>prédit</b> ce qu’il fait, le <b>teste</b>, le <b>répare</b>, puis <b>crée</b> le sien.
          Les blocs visuels laissent progressivement la place au vrai JavaScript. Deux à trois
          missions par séance suffisent — la régularité compte plus que la durée !
        </p>
      </Card>

      {/* Réglages */}
      <Card className="flex items-center justify-between p-5">
        <div>
          <p className="font-display font-bold">Les sons de l’application</p>
          <p className="text-sm text-white/60">Bips de victoire, confettis sonores…</p>
        </div>
        <Button
          variant={profile?.sound_on ? 'success' : 'secondary'}
          onClick={() => {
            const next = !(profile?.sound_on ?? true)
            soundConfig.on = next
            void saveProfile({ sound_on: next })
          }}
        >
          {profile?.sound_on ? '🔊 Activés' : '🔇 Coupés'}
        </Button>
      </Card>

      <Button variant="secondary" onClick={() => signOut()}>
        Se déconnecter
      </Button>
    </div>
  )
}
