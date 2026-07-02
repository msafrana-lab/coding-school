import { useEffect } from 'react'
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { useStore } from '../lib/store'
import StarField from '../ui/StarField'
import Cosmo from '../ui/Cosmo'
import Logo from '../ui/Logo'
import { Pill } from '../ui/kit'
import Onboarding from './Onboarding'

function Loading() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 overflow-hidden">
      <StarField />
      <Cosmo pose="think" float className="relative z-10 h-28 w-28" />
      <p className="relative z-10 font-display text-lg text-white/70">Décollage en cours…</p>
    </div>
  )
}

/** Coquille des pages connectées : vérifie la session, gère l'accueil du 1er jour, affiche l'en-tête. */
export default function AppShell() {
  const { ready, session, profile, init, addMinutes } = useStore()
  const location = useLocation()

  useEffect(() => init(), [init])

  // Compte le temps passé (1 tick par minute d'app ouverte)
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') addMinutes(1)
    }, 60_000)
    return () => clearInterval(id)
  }, [addMinutes])

  if (!ready) return <Loading />
  if (!session) return <Navigate to="/connexion" replace />
  if (profile && !profile.display_name) return <Onboarding />
  if (!profile) return <Loading />

  const inLesson = location.pathname.includes('/lecon/')

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <StarField />
      {!inLesson && (
        <header className="relative z-20 mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <Link to="/app">
            <Logo className="h-8" />
          </Link>
          <div className="flex items-center gap-2">
            <Pill className="bg-star-400/15 text-star-400 border border-star-400/30">
              ⭐ {profile.xp}
            </Pill>
            <Pill className="bg-coral-500/15 text-coral-400 border border-coral-500/30">
              🔥 {profile.streak_count}
            </Pill>
            <Link
              to="/app/parents"
              className="grid h-9 w-9 place-items-center rounded-full bg-space-700 text-lg transition hover:bg-space-600"
              aria-label="Profil et parents"
            >
              {profile.avatar}
            </Link>
          </div>
        </header>
      )}
      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  )
}
