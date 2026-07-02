import type * as Blockly from 'blockly/core'
import { javascriptGenerator } from 'blockly/javascript'

/** Compile l'atelier en code : motifs d'abord, puis la pile « au départ ». */
export function generateCode(ws: Blockly.WorkspaceSvg): { code: string; blockCount: number } {
  const g = javascriptGenerator
  g.init(ws)
  let code = ''
  const tops = ws.getTopBlocks(true)
  for (const b of tops) {
    if (b.type === 'motif_def_a' || b.type === 'motif_def_b') {
      code += String(g.blockToCode(b)) + '\n'
    }
  }
  const start = tops.find((b) => b.type === 'quand_demarre')
  if (start) code += String(g.blockToCode(start))
  code = g.finish(code)

  const blockCount = ws
    .getAllBlocks(false)
    .filter((b) => !b.isShadow() && b.type !== 'quand_demarre').length
  return { code, blockCount }
}

export function starsFor(blockCount: number, par: number): number {
  if (blockCount <= par) return 3
  if (blockCount <= par + 2) return 2
  return 1
}
