import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useStore } from '../lib/store'
import StarField from '../ui/StarField'
import Logo from '../ui/Logo'
import Cosmo from '../ui/Cosmo'
import { Button, Card } from '../ui/kit'

function messageFr(raw: string): string {
  const m = raw.toLowerCase()
  if (m.includes('invalid login credentials')) return 'Email ou mot de passe incorrect.'
  if (m.includes('email not confirmed')) return 'Il faut d’abord cliquer sur le lien reçu par email pour confirmer le compte.'
  if (m.includes('already registered')) return 'Un compte existe déjà avec cet email. Essaie de te connecter.'
  if (m.includes('at least 6 characters')) return 'Le mot de passe doit faire au moins 6 caractères.'
  if (m.includes('unable to validate email') || m.includes('invalid format')) return 'Cet email ne semble pas valide.'
  if (m.includes('rate limit')) return 'Trop d’essais d’un coup — attends une minute et réessaie.'
  if (m.includes('provider is not enabled') || m.includes('validation_failed')) return 'La connexion Google n’est pas encore activée — utilise l’email en attendant.'
  return 'Oups, ça n’a pas marché. Réessaie dans un instant.'
}

export default function Connexion() {
  const navigate = useNavigate()
  const { session, ready, init } = useStore()
  const [mode, setMode] = useState<'connexion' | 'inscription'>('connexion')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => init(), [init])
  useEffect(() => {
    if (ready && session) navigate('/app', { replace: true })
  }, [ready, session, navigate])

  async function google() {
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/app` },
    })
    if (error) setError(messageFr(error.message))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setBusy(true)
    try {
      if (mode === 'inscription') {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) setError(messageFr(error.message))
        else if (data.session) navigate('/app')
        else setInfo('Presque ! Un email de confirmation vient d’être envoyé. Clique sur le lien, puis reviens te connecter ici.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setError(messageFr(error.message))
        else navigate('/app')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden px-4 py-8">
      <StarField />
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-5">
        <Link to="/">
          <Logo className="h-10" />
        </Link>
        <Cosmo pose="hello" float className="h-28 w-28" />

        <Card className="w-full p-6">
          <h1 className="mb-4 text-center text-2xl font-bold">
            {mode === 'connexion' ? 'Content de te revoir !' : 'Crée ton compte'}
          </h1>

          <button
            onClick={google}
            className="mb-4 flex w-full items-center justify-center gap-3 rounded-2xl border-b-4 border-gray-300 bg-white px-4 py-3 font-display font-semibold text-space-900 transition hover:brightness-95 active:translate-y-[3px] active:border-b-0"
          >
            <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.3l-6.3-5.4C29.3 34.9 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.3 5.4C36.9 40.4 44 35 44 24c0-1.3-.1-2.6-.4-3.9z"/>
            </svg>
            Continuer avec Google
          </button>

          <div className="mb-4 flex items-center gap-3 text-white/40">
            <div className="h-px flex-1 bg-white/15" />
            <span className="text-sm font-semibold">ou avec un email</span>
            <div className="h-px flex-1 bg-white/15" />
          </div>

          <form onSubmit={submit} className="flex flex-col gap-3">
            <input
              type="email"
              required
              placeholder="Email du parent"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-white/15 bg-space-900/70 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-nebula-400"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Mot de passe (6 caractères min.)"
              autoComplete={mode === 'connexion' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-white/15 bg-space-900/70 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-nebula-400"
            />
            {error && <p className="rounded-xl bg-coral-500/20 px-3 py-2 text-sm font-semibold text-coral-400">{error}</p>}
            {info && <p className="rounded-xl bg-mint-500/15 px-3 py-2 text-sm font-semibold text-mint-400">{info}</p>}
            <Button type="submit" disabled={busy}>
              {busy ? 'Un instant…' : mode === 'connexion' ? 'Se connecter' : 'Créer le compte'}
            </Button>
          </form>

          <button
            onClick={() => {
              setMode(mode === 'connexion' ? 'inscription' : 'connexion')
              setError(null)
              setInfo(null)
            }}
            className="mt-4 w-full text-center text-sm font-semibold text-comet-400 hover:underline"
          >
            {mode === 'connexion' ? 'Pas encore de compte ? Créer un compte' : 'Déjà un compte ? Se connecter'}
          </button>
        </Card>

        <p className="max-w-xs text-center text-xs text-white/40">
          Astuce : un parent crée le compte, puis l’enfant choisit son prénom d’astronaute à l’intérieur.
        </p>
      </div>
    </div>
  )
}
