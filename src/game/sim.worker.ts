/// <reference lib="webworker" />
import { SimWorld } from './world'
import type { PuzzleContent } from '../curriculum/types'

/**
 * Exécute le code de l'enfant dans un worker : si le code part en boucle
 * infinie, le fil principal peut simplement arrêter le worker.
 */
self.onmessage = (e: MessageEvent<{ def: Pick<PuzzleContent, 'map' | 'start' | 'goal'>; code: string }>) => {
  const { def, code } = e.data
  const sim = new SimWorld(def)
  try {
    const result = sim.run(code)
    self.postMessage({ ok: true, result, steps: sim.steps })
  } catch (err) {
    self.postMessage({ ok: false, message: err instanceof Error ? err.message : String(err) })
  }
}
