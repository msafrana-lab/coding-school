/** Petits sons de l'app, générés en direct (aucun fichier à télécharger). */

export const soundConfig = { on: true }

let ctx: AudioContext | null = null

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(freq: number, start: number, duration: number, type: OscillatorType = 'sine', volume = 0.12) {
  const ac = audio()
  if (!ac || !soundConfig.on) return
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0, ac.currentTime + start)
  gain.gain.linearRampToValueAtTime(volume, ac.currentTime + start + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + start + duration)
  osc.connect(gain).connect(ac.destination)
  osc.start(ac.currentTime + start)
  osc.stop(ac.currentTime + start + duration + 0.05)
}

export const sounds = {
  click() {
    tone(660, 0, 0.08, 'triangle', 0.08)
  },
  pickup() {
    tone(880, 0, 0.09, 'triangle')
    tone(1320, 0.07, 0.12, 'triangle')
  },
  win() {
    tone(523, 0, 0.14, 'triangle')
    tone(659, 0.12, 0.14, 'triangle')
    tone(784, 0.24, 0.16, 'triangle')
    tone(1047, 0.38, 0.3, 'triangle', 0.15)
  },
  lose() {
    tone(330, 0, 0.18, 'sawtooth', 0.07)
    tone(247, 0.16, 0.22, 'sawtooth', 0.07)
    tone(165, 0.34, 0.3, 'sawtooth', 0.07)
  },
  crash() {
    tone(110, 0, 0.25, 'sawtooth', 0.1)
    tone(82, 0.05, 0.3, 'square', 0.06)
  },
  star() {
    tone(1175, 0, 0.1, 'sine', 0.1)
    tone(1568, 0.08, 0.18, 'sine', 0.1)
  },
  correct() {
    tone(784, 0, 0.1, 'triangle')
    tone(1047, 0.09, 0.15, 'triangle')
  },
  wrong() {
    tone(220, 0, 0.15, 'square', 0.05)
  },
}
