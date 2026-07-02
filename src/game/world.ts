import type { Direction, PuzzleContent } from '../curriculum/types'

/** Un pas d'animation rejoué à l'écran après l'exécution. */
export type Step =
  | { t: 'trace'; id: string }
  | { t: 'move'; x: number; y: number }
  | { t: 'turn'; dir: Direction }
  | { t: 'pickup'; x: number; y: number }
  | { t: 'crash'; x: number; y: number; reason: CrashReason }
  | { t: 'win' }

export type CrashReason = 'vide' | 'asteroide' | 'bord'

export type RunResult =
  | { outcome: 'win'; steps: Step[] }
  | { outcome: 'crash'; steps: Step[]; reason: CrashReason }
  | { outcome: 'incomplete'; steps: Step[]; reason: 'pas-arrivee' | 'cristaux-restants' | 'rien' }
  | {
      outcome: 'error'
      steps: Step[]
      reason: 'boucle-infinie' | 'trop-actions' | 'motif-manquant' | 'inconnu'
    }

const DIRS: Record<Direction, { dx: number; dy: number }> = {
  N: { dx: 0, dy: -1 },
  E: { dx: 1, dy: 0 },
  S: { dx: 0, dy: 1 },
  O: { dx: -1, dy: 0 },
}
const LEFT: Record<Direction, Direction> = { N: 'O', O: 'S', S: 'E', E: 'N' }
const RIGHT: Record<Direction, Direction> = { N: 'E', E: 'S', S: 'O', O: 'N' }

class WinSignal extends Error {}
class CrashSignal extends Error {
  constructor(public reason: CrashReason, public x: number, public y: number) {
    super('crash')
  }
}
class BudgetSignal extends Error {}

/** Le monde simulé : il exécute les ordres instantanément et note chaque pas. */
export class SimWorld {
  width: number
  height: number
  tiles: string[][]
  x: number
  y: number
  dir: Direction
  crystals: Set<string>
  collected = 0
  steps: Step[] = []
  goal: 'arrivee' | 'cristaux' | 'les-deux'
  private actions = 0

  constructor(private def: Pick<PuzzleContent, 'map' | 'start' | 'goal'>) {
    this.tiles = def.map.map((row) => row.split(''))
    this.height = this.tiles.length
    this.width = Math.max(...this.tiles.map((r) => r.length))
    this.x = def.start.x
    this.y = def.start.y
    this.dir = def.start.dir
    this.goal = def.goal ?? 'arrivee'
    this.crystals = new Set()
    this.tiles.forEach((row, y) =>
      row.forEach((c, x) => {
        if (c === 'C') this.crystals.add(`${x},${y}`)
      }),
    )
  }

  private tile(x: number, y: number): string {
    if (y < 0 || y >= this.height || x < 0 || x >= (this.tiles[y]?.length ?? 0)) return '!'
    return this.tiles[y][x]
  }

  private walkable(x: number, y: number): boolean {
    const t = this.tile(x, y)
    return t === '#' || t === 'C' || t === 'G'
  }

  private spend() {
    if (++this.actions > 500) throw new BudgetSignal()
  }

  private checkWin() {
    const onGoal = this.tile(this.x, this.y) === 'G'
    const allCrystals = this.crystals.size === 0
    const done =
      this.goal === 'arrivee' ? onGoal : this.goal === 'cristaux' ? allCrystals : onGoal && allCrystals
    if (done) {
      this.steps.push({ t: 'win' })
      throw new WinSignal()
    }
  }

  /* ---- Ordres ---- */

  avancer() {
    this.spend()
    const { dx, dy } = DIRS[this.dir]
    const nx = this.x + dx
    const ny = this.y + dy
    if (!this.walkable(nx, ny)) {
      const t = this.tile(nx, ny)
      const reason: CrashReason = t === 'A' ? 'asteroide' : t === '!' ? 'bord' : 'vide'
      this.steps.push({ t: 'crash', x: nx, y: ny, reason })
      throw new CrashSignal(reason, nx, ny)
    }
    this.x = nx
    this.y = ny
    this.steps.push({ t: 'move', x: nx, y: ny })
    // Ramassage automatique ? Non : sur Mémora on ramasse avec un bloc.
    // Mais pour les 3 premières planètes, le cristal se ramasse en marchant dessus.
    if (this.crystals.has(`${nx},${ny}`)) {
      this.crystals.delete(`${nx},${ny}`)
      this.collected++
      this.steps.push({ t: 'pickup', x: nx, y: ny })
    }
    this.checkWin()
  }

  tournerGauche() {
    this.spend()
    this.dir = LEFT[this.dir]
    this.steps.push({ t: 'turn', dir: this.dir })
  }

  tournerDroite() {
    this.spend()
    this.dir = RIGHT[this.dir]
    this.steps.push({ t: 'turn', dir: this.dir })
  }

  /* ---- Capteurs ---- */

  private look(dir: Direction): boolean {
    const { dx, dy } = DIRS[dir]
    return this.walkable(this.x + dx, this.y + dy)
  }

  cheminDevant() {
    return this.look(this.dir)
  }
  cheminAGauche() {
    return this.look(LEFT[this.dir])
  }
  cheminADroite() {
    return this.look(RIGHT[this.dir])
  }
  surArrivee() {
    return this.tile(this.x, this.y) === 'G'
  }
  cristaux() {
    return this.collected
  }
  cristauxRestants() {
    return this.crystals.size
  }

  trace(id: string) {
    this.steps.push({ t: 'trace', id })
  }

  /** Lance le programme compilé et classe le résultat. */
  run(code: string): RunResult {
    const world = this
    try {
      // Le code généré n'utilise que l'API passée en argument.
      const fn = new Function(
        'api',
        `"use strict";
        let LOOP_BUDGET = 10000;
        let boite = 0;
        const trace = (id) => api.trace(id);
        const avancer = () => api.avancer();
        const tournerGauche = () => api.tournerGauche();
        const tournerDroite = () => api.tournerDroite();
        const cheminDevant = () => api.cheminDevant();
        const cheminAGauche = () => api.cheminAGauche();
        const cheminADroite = () => api.cheminADroite();
        const surArrivee = () => api.surArrivee();
        const cristaux = () => api.cristaux();
        ${code}`,
      )
      fn(world)
    } catch (e) {
      if (e instanceof WinSignal) return { outcome: 'win', steps: world.steps }
      if (e instanceof CrashSignal)
        return { outcome: 'crash', steps: world.steps, reason: e.reason }
      if (e instanceof BudgetSignal)
        return { outcome: 'error', steps: world.steps, reason: 'trop-actions' }
      if (e instanceof RangeError)
        return { outcome: 'error', steps: world.steps, reason: 'boucle-infinie' }
      if (e instanceof ReferenceError)
        return { outcome: 'error', steps: world.steps, reason: 'motif-manquant' }
      return { outcome: 'error', steps: world.steps, reason: 'inconnu' }
    }
    // Le programme s'est terminé sans gagner
    if (world.steps.filter((s) => s.t !== 'trace').length === 0)
      return { outcome: 'incomplete', steps: world.steps, reason: 'rien' }
    const reason =
      world.goal !== 'arrivee' && world.crystals.size > 0 ? 'cristaux-restants' : 'pas-arrivee'
    return { outcome: 'incomplete', steps: world.steps, reason }
  }
}
