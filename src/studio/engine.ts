import type { Scene, SpriteTypeId, StudioAction, StudioRules } from './model'
import { SPRITE_TYPES } from './model'

interface Instance {
  uid: string
  type: SpriteTypeId
  x: number // %
  y: number // %
  vx: number // %/s
  vy: number // %/s
  size: number
  el: HTMLDivElement
  bubble?: HTMLDivElement
  bubbleUntil?: number
  atBorder: Set<string>
}

const EMOJI: Record<string, string> = Object.fromEntries(SPRITE_TYPES.map((s) => [s.id, s.emoji]))

/** Le moteur de jeu du Studio : il anime la scène selon les règles. */
export class StudioEngine {
  private instances: Instance[] = []
  private raf = 0
  private last = 0
  private timers: { period: number; next: number; actions: StudioAction[] }[] = []
  private collisionCooldown = new Map<string, number>()
  private controlled: SpriteTypeId | null = null
  private keys = new Set<string>()
  private score = 0
  private status: 'running' | 'won' | 'lost' = 'running'
  private now = 0

  constructor(
    private container: HTMLElement,
    private scene: Scene,
    private rules: StudioRules,
    private cb: {
      onScore: (score: number) => void
      onEnd: (won: boolean) => void
      onSound?: (kind: 'score' | 'win' | 'lose' | 'pop') => void
    },
  ) {}

  start() {
    this.container.innerHTML = ''
    this.instances = this.scene.sprites.map((s) => {
      const el = document.createElement('div')
      el.textContent = EMOJI[s.type]
      el.style.cssText = `position:absolute;transform:translate(-50%,-50%);cursor:pointer;
        user-select:none;-webkit-user-select:none;line-height:1;z-index:5;`
      el.style.fontSize = `${Math.round(30 * s.size)}px`
      this.container.appendChild(el)
      const inst: Instance = {
        uid: s.uid, type: s.type, x: s.x, y: s.y, vx: 0, vy: 0, size: s.size, el,
        atBorder: new Set(),
      }
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault()
        this.fire('clic', inst)
      })
      return inst
    })

    // Événements « au démarrage »
    for (const e of this.rules.events) if (e.kind === 'demarre') this.run(e.actions, null)
    // Minuteries
    this.timers = this.rules.events
      .filter((e) => e.kind === 'toutes')
      .map((e) => ({ period: (e as { sec: number }).sec * 1000, next: (e as { sec: number }).sec * 1000, actions: e.actions }))

    // Clavier
    window.addEventListener('keydown', this.onKey)
    window.addEventListener('keyup', this.onKeyUp)
    // Doigt / souris : on suit le pointeur si un type est contrôlé
    this.container.addEventListener('pointermove', this.onPointer)

    this.last = performance.now()
    this.now = 0
    this.raf = requestAnimationFrame(this.tick)
    this.render()
  }

  stop() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener('keydown', this.onKey)
    window.removeEventListener('keyup', this.onKeyUp)
    this.container.removeEventListener('pointermove', this.onPointer)
  }

  destroy() {
    this.stop()
    this.container.innerHTML = ''
  }

  private onKey = (e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault()
      this.keys.add(e.key)
    }
  }
  private onKeyUp = (e: KeyboardEvent) => this.keys.delete(e.key)

  private onPointer = (e: PointerEvent) => {
    if (!this.controlled || e.buttons === 0) return
    const r = this.container.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    for (const i of this.instances) {
      if (i.type === this.controlled) {
        i.x = Math.max(3, Math.min(97, x))
        i.y = Math.max(4, Math.min(96, y))
      }
    }
  }

  private targets(type: SpriteTypeId, subject: Instance | null): Instance[] {
    if (subject && subject.type === type) return [subject]
    return this.instances.filter((i) => i.type === type)
  }

  private run(actions: StudioAction[], subject: Instance | null, other: Instance | null = null) {
    if (this.status !== 'running') return
    for (const a of actions) {
      switch (a.type) {
        case 'fleches':
          this.controlled = a.sprite
          break
        case 'glisser':
          for (const i of this.targets(a.sprite, subject) .concat(other && other.type === a.sprite ? [other] : [])) {
            const sp = 11 * a.v
            if (a.dir === 'bas') { i.vx = 0; i.vy = sp }
            else if (a.dir === 'haut') { i.vx = 0; i.vy = -sp }
            else if (a.dir === 'gauche') { i.vx = -sp; i.vy = 0 }
            else if (a.dir === 'droite') { i.vx = sp; i.vy = 0 }
            else {
              const ang = Math.random() * Math.PI * 2
              i.vx = Math.cos(ang) * sp
              i.vy = Math.sin(ang) * sp
            }
          }
          break
        case 'stop':
          for (const i of this.targets(a.sprite, subject)) { i.vx = 0; i.vy = 0 }
          break
        case 'teleport':
          for (const i of this.targets(a.sprite, subject)) {
            if (a.where === 'haut') { i.y = 6; i.x = 8 + Math.random() * 84 }
            else if (a.where === 'bas') { i.y = 92; i.x = 8 + Math.random() * 84 }
            else if (a.where === 'centre') { i.x = 50; i.y = 50 }
            else { i.x = 8 + Math.random() * 84; i.y = 8 + Math.random() * 84 }
            i.atBorder.clear()
          }
          break
        case 'dire':
          for (const i of this.targets(a.sprite, subject)) this.say(i, a.text)
          break
        case 'score':
          this.score += a.n
          this.cb.onScore(this.score)
          this.cb.onSound?.('score')
          break
        case 'si_score':
          if (this.score >= a.n) this.run(a.actions, subject, other)
          break
        case 'gagner':
          this.status = 'won'
          this.cb.onSound?.('win')
          this.cb.onEnd(true)
          return
        case 'perdre':
          this.status = 'lost'
          this.cb.onSound?.('lose')
          this.cb.onEnd(false)
          return
      }
    }
  }

  private say(i: Instance, text: string) {
    if (!i.bubble) {
      i.bubble = document.createElement('div')
      i.bubble.style.cssText = `position:absolute;transform:translate(-50%,-115%);background:white;
        color:#0B1035;font-weight:700;font-family:Nunito,sans-serif;font-size:12px;
        padding:4px 10px;border-radius:12px;white-space:nowrap;z-index:9;pointer-events:none;`
      this.container.appendChild(i.bubble)
    }
    i.bubble.textContent = text
    i.bubble.style.display = 'block'
    i.bubbleUntil = this.now + 2200
  }

  private fire(kind: 'clic', subject: Instance) {
    if (this.status !== 'running') return
    for (const e of this.rules.events) {
      if (e.kind === 'clic' && e.sprite === subject.type) {
        this.cb.onSound?.('pop')
        this.run(e.actions, subject)
      }
    }
  }

  private tick = (t: number) => {
    const dt = Math.min(50, t - this.last) / 1000
    this.last = t
    this.now += dt * 1000
    if (this.status === 'running') {
      // Contrôle clavier
      if (this.controlled) {
        const sp = 38
        for (const i of this.instances) {
          if (i.type !== this.controlled) continue
          let kx = 0, ky = 0
          if (this.keys.has('ArrowLeft')) kx -= 1
          if (this.keys.has('ArrowRight')) kx += 1
          if (this.keys.has('ArrowUp')) ky -= 1
          if (this.keys.has('ArrowDown')) ky += 1
          if (kx || ky) {
            i.x += kx * sp * dt
            i.y += ky * sp * dt
          }
        }
      }

      // Déplacements
      for (const i of this.instances) {
        i.x += i.vx * dt
        i.y += i.vy * dt
        // Bords
        const hits: Array<'bas' | 'haut' | 'cote'> = []
        if (i.y >= 96) { i.y = 96; hits.push('bas') }
        if (i.y <= 4) { i.y = 4; hits.push('haut') }
        if (i.x <= 3) { i.x = 3; hits.push('cote') }
        if (i.x >= 97) { i.x = 97; hits.push('cote') }
        for (const side of hits) {
          if (!i.atBorder.has(side)) {
            i.atBorder.add(side)
            for (const e of this.rules.events) {
              if (e.kind === 'bord' && e.sprite === i.type && e.side === side) this.run(e.actions, i)
            }
          }
        }
        if (!hits.length) i.atBorder.clear()
        if (i.bubble && i.bubbleUntil && this.now > i.bubbleUntil) i.bubble.style.display = 'none'
      }

      // Collisions
      for (const e of this.rules.events) {
        if (e.kind !== 'collision') continue
        for (const ia of this.instances) {
          if (ia.type !== e.a) continue
          for (const ib of this.instances) {
            if (ib.type !== e.b || ia === ib) continue
            const dx = ia.x - ib.x
            const dy = (ia.y - ib.y) * 0.75 // l'écran est plus large que haut
            const rr = 6 * (ia.size + ib.size) * 0.5 + 3
            if (dx * dx + dy * dy < rr * rr) {
              const key = `${ia.uid}|${ib.uid}`
              const until = this.collisionCooldown.get(key) ?? 0
              if (this.now > until) {
                this.collisionCooldown.set(key, this.now + 600)
                this.run(e.actions, ia, ib)
              }
            }
          }
        }
      }

      // Minuteries
      for (const timer of this.timers) {
        if (this.now >= timer.next) {
          timer.next += timer.period
          this.run(timer.actions, null)
        }
      }
    }

    this.render()
    this.raf = requestAnimationFrame(this.tick)
  }

  private render() {
    for (const i of this.instances) {
      i.el.style.left = `${i.x}%`
      i.el.style.top = `${i.y}%`
      if (i.bubble) {
        i.bubble.style.left = `${i.x}%`
        i.bubble.style.top = `${i.y}%`
      }
    }
  }
}
