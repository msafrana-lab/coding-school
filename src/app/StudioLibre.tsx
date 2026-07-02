import { Link } from 'react-router-dom'
import StudioView from '../studio/StudioView'

/** Le Studio en accès libre : créer sans consigne, juste pour le plaisir. */
export default function StudioLibre() {
  return (
    <div className="flex h-[calc(100dvh-64px)] flex-col px-3 pb-2">
      <div className="relative z-20 flex items-center gap-2 py-1">
        <p className="font-display text-lg font-bold">🎮 Mon Studio libre</p>
        <p className="hidden text-xs text-white/50 sm:block">
          — invente ce que tu veux, tout est sauvegardé automatiquement
        </p>
        <Link to="/app" className="ml-auto text-sm font-semibold text-comet-400 hover:underline">
          ← Carte
        </Link>
      </div>
      <div className="relative min-h-0 flex-1">
        <StudioView storageKey="libre" />
      </div>
    </div>
  )
}
