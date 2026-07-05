/** Le modèle du Studio : scène, sprites, règles compilées, validation des étapes. */

export const SPRITE_TYPES = [
  { id: 'fusee', emoji: '🚀', name: 'la fusée' },
  { id: 'etoile', emoji: '⭐', name: 'l’étoile' },
  { id: 'asteroide', emoji: '🪨', name: 'l’astéroïde' },
  { id: 'alien', emoji: '👾', name: 'l’alien' },
  { id: 'coeur', emoji: '💖', name: 'le cœur' },
  { id: 'ovni', emoji: '🛸', name: 'l’ovni' },
] as const

export type SpriteTypeId = (typeof SPRITE_TYPES)[number]['id']

export const BACKGROUNDS = [
  { id: 'nuit', name: 'Nuit étoilée', css: 'radial-gradient(ellipse at 30% 20%, #1E2765 0%, #0B1035 55%, #060A22 100%)' },
  { id: 'nebuleuse', name: 'Nébuleuse', css: 'linear-gradient(160deg, #2A1B54 0%, #5B36BE 45%, #17C3DE 130%)' },
  { id: 'aurore', name: 'Aurore verte', css: 'linear-gradient(180deg, #04122E 0%, #0A3D45 60%, #1FAF6B 130%)' },
  { id: 'couchant', name: 'Soleil couchant', css: 'linear-gradient(180deg, #2A1B54 0%, #B33A63 70%, #F7B910 130%)' },
] as const

export interface SceneSprite {
  uid: string
  type: SpriteTypeId
  x: number // % (0-100)
  y: number // % (0-100)
  size: number // 1 = taille normale
}

export interface Scene {
  background: string
  sprites: SceneSprite[]
}

export function emptyScene(): Scene {
  return { background: 'nuit', sprites: [] }
}

/* ---- Règles compilées depuis l'atelier de blocs ---- */

export type StudioAction =
  | { type: 'glisser'; sprite: SpriteTypeId; dir: 'bas' | 'haut' | 'gauche' | 'droite' | 'hasard'; v: number }
  | { type: 'stop'; sprite: SpriteTypeId }
  | { type: 'teleport'; sprite: SpriteTypeId; where: 'haut' | 'bas' | 'centre' | 'hasard' }
  | { type: 'score'; n: number }
  | { type: 'dire'; sprite: SpriteTypeId; text: string }
  | { type: 'gagner' }
  | { type: 'perdre' }
  | { type: 'fleches'; sprite: SpriteTypeId }
  | { type: 'si_score'; n: number; actions: StudioAction[] }

export type StudioEvent =
  | { kind: 'demarre'; actions: StudioAction[] }
  | { kind: 'clic'; sprite: SpriteTypeId; actions: StudioAction[] }
  | { kind: 'toutes'; sec: number; actions: StudioAction[] }
  | { kind: 'collision'; a: SpriteTypeId; b: SpriteTypeId; actions: StudioAction[] }
  | { kind: 'bord'; sprite: SpriteTypeId; side: 'bas' | 'haut' | 'cote'; actions: StudioAction[] }

export interface StudioRules {
  events: StudioEvent[]
}

/* ---- Validation des étapes guidées ---- */

export interface CheckContext {
  scene: Scene
  rules: StudioRules
  hasPlayed: boolean
  bestScore: number
  won: boolean
  lost: boolean
  background: string
}

function allActions(rules: StudioRules): StudioAction[] {
  const out: StudioAction[] = []
  const walk = (list: StudioAction[]) => {
    for (const a of list) {
      out.push(a)
      if (a.type === 'si_score') walk(a.actions)
    }
  }
  for (const e of rules.events) walk(e.actions)
  return out
}

/**
 * Codes de validation :
 *  sprite:fusee            → un sprite de ce type est sur la scène
 *  sprites:2               → au moins N types différents sur la scène
 *  fleches:fusee           → une action « les flèches dirigent » ce type
 *  glisser:etoile          → une action glisser sur ce type
 *  collision:fusee:etoile  → un événement collision entre ces deux types
 *  collision-score         → une collision dont les actions ajoutent au score
 *  event:toutes            → un événement « toutes les X secondes »
 *  event:bord              → un événement « touche le bord »
 *  action:gagner / action:perdre / action:dire / action:teleport
 *  action:fin              → gagner OU perdre présent
 *  si-score:N              → un bloc « si le score atteint N » (N minimal)
 *  fond-change             → le fond n'est plus celui de départ
 *  vitesse:4               → une action glisser avec vitesse ≥ N
 *  joue                    → la partie a été lancée au moins une fois
 *  gagne                   → la partie a été gagnée au moins une fois
 *  score:N                 → meilleur score ≥ N
 */
export function checkStep(code: string, ctx: CheckContext): boolean {
  const [kind, p1, p2] = code.split(':')
  const actions = allActions(ctx.rules)
  switch (kind) {
    case 'sprite':
      return ctx.scene.sprites.some((s) => s.type === p1)
    case 'sprites':
      return new Set(ctx.scene.sprites.map((s) => s.type)).size >= Number(p1)
    case 'fleches':
      return actions.some((a) => a.type === 'fleches' && a.sprite === p1)
    case 'glisser':
      return actions.some((a) => a.type === 'glisser' && a.sprite === p1)
    case 'collision':
      return ctx.rules.events.some(
        (e) =>
          e.kind === 'collision' &&
          ((e.a === p1 && e.b === p2) || (e.a === p2 && e.b === p1)),
      )
    case 'collision-score':
      return ctx.rules.events.some(
        (e) => e.kind === 'collision' && e.actions.some((a) => a.type === 'score'),
      )
    case 'event':
      return ctx.rules.events.some((e) => e.kind === (p1 as StudioEvent['kind']))
    case 'action':
      if (p1 === 'fin') return actions.some((a) => a.type === 'gagner' || a.type === 'perdre')
      return actions.some((a) => a.type === p1)
    case 'si-score':
      return actions.some((a) => a.type === 'si_score' && a.n >= Number(p1))
    case 'fond-change':
      return ctx.background !== 'nuit'
    case 'vitesse':
      return actions.some((a) => a.type === 'glisser' && a.v >= Number(p1))
    case 'joue':
      return ctx.hasPlayed
    case 'gagne':
      return ctx.won
    case 'score':
      return ctx.bestScore >= Number(p1)
    default:
      return false
  }
}
