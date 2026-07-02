import * as Blockly from 'blockly/core'
import { SPRITE_TYPES, type StudioAction, type StudioEvent, type StudioRules, type SpriteTypeId } from './model'

const SPRITE_OPTIONS = SPRITE_TYPES.map((s) => [`${s.emoji} ${s.name}`, s.id])

const EV_COLOR = '#FFB020'
const ACT_COLOR = '#8B63F7'
const SCORE_COLOR = '#FF6B81'
const FIN_COLOR = '#34D186'

let installed = false

/** Déclare les blocs du Studio (événements + actions de jeu). */
export function installStudioBlocks() {
  if (installed) return
  installed = true

  Blockly.defineBlocksWithJsonArray([
    {
      type: 'ev_demarre',
      message0: '🏁 quand le jeu démarre',
      nextStatement: null,
      colour: EV_COLOR,
      tooltip: 'Ces actions se lancent au début de la partie.',
    },
    {
      type: 'ev_clic',
      message0: '👆 quand on touche %1',
      args0: [{ type: 'field_dropdown', name: 'S', options: SPRITE_OPTIONS }],
      nextStatement: null,
      colour: EV_COLOR,
      tooltip: 'Quand on clique ou tape sur ce personnage.',
    },
    {
      type: 'ev_toutes',
      message0: '⏰ toutes les %1 secondes',
      args0: [{ type: 'field_number', name: 'N', value: 2, min: 1, max: 20, precision: 1 }],
      nextStatement: null,
      colour: EV_COLOR,
      tooltip: 'Se répète sans arrêt, à ce rythme.',
    },
    {
      type: 'ev_collision',
      message0: '💥 quand %1 touche %2',
      args0: [
        { type: 'field_dropdown', name: 'A', options: SPRITE_OPTIONS },
        { type: 'field_dropdown', name: 'B', options: SPRITE_OPTIONS },
      ],
      nextStatement: null,
      colour: EV_COLOR,
      tooltip: 'Quand ces deux personnages se rencontrent.',
    },
    {
      type: 'ev_bord',
      message0: '🧱 quand %1 touche le bord %2',
      args0: [
        { type: 'field_dropdown', name: 'S', options: SPRITE_OPTIONS },
        {
          type: 'field_dropdown',
          name: 'SIDE',
          options: [
            ['du bas', 'bas'],
            ['du haut', 'haut'],
            ['des côtés', 'cote'],
          ],
        },
      ],
      nextStatement: null,
      colour: EV_COLOR,
      tooltip: 'Quand ce personnage atteint le bord de l’écran.',
    },
    {
      type: 'act_fleches',
      message0: '🕹️ les flèches dirigent %1',
      args0: [{ type: 'field_dropdown', name: 'S', options: SPRITE_OPTIONS }],
      previousStatement: null,
      nextStatement: null,
      colour: ACT_COLOR,
      tooltip: 'Flèches du clavier, ou le doigt sur tablette.',
    },
    {
      type: 'act_glisser',
      message0: '➡️ %1 glisse vers %2 à vitesse %3',
      args0: [
        { type: 'field_dropdown', name: 'S', options: SPRITE_OPTIONS },
        {
          type: 'field_dropdown',
          name: 'DIR',
          options: [
            ['le bas', 'bas'],
            ['le haut', 'haut'],
            ['la gauche', 'gauche'],
            ['la droite', 'droite'],
            ['où il veut 🎲', 'hasard'],
          ],
        },
        { type: 'field_number', name: 'V', value: 2, min: 1, max: 5, precision: 1 },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: ACT_COLOR,
      tooltip: 'Fait bouger tous les personnages de ce type.',
    },
    {
      type: 'act_stop',
      message0: '✋ %1 s’arrête',
      args0: [{ type: 'field_dropdown', name: 'S', options: SPRITE_OPTIONS }],
      previousStatement: null,
      nextStatement: null,
      colour: ACT_COLOR,
    },
    {
      type: 'act_teleport',
      message0: '✨ téléporter %1 %2',
      args0: [
        { type: 'field_dropdown', name: 'S', options: SPRITE_OPTIONS },
        {
          type: 'field_dropdown',
          name: 'W',
          options: [
            ['en haut, au hasard', 'haut'],
            ['en bas, au hasard', 'bas'],
            ['au centre', 'centre'],
            ['n’importe où 🎲', 'hasard'],
          ],
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: ACT_COLOR,
    },
    {
      type: 'act_dire',
      message0: '💬 %1 dit %2',
      args0: [
        { type: 'field_dropdown', name: 'S', options: SPRITE_OPTIONS },
        { type: 'field_input', name: 'T', text: 'Bonjour !' },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: ACT_COLOR,
    },
    {
      type: 'act_score',
      message0: '🏆 ajouter %1 au score',
      args0: [{ type: 'field_number', name: 'N', value: 1, min: -10, max: 10, precision: 1 }],
      previousStatement: null,
      nextStatement: null,
      colour: SCORE_COLOR,
    },
    {
      type: 'si_score',
      message0: '❓ si le score atteint %1',
      args0: [{ type: 'field_number', name: 'N', value: 5, min: 1, max: 99, precision: 1 }],
      message1: '%1',
      args1: [{ type: 'input_statement', name: 'DO' }],
      previousStatement: null,
      nextStatement: null,
      colour: SCORE_COLOR,
    },
    {
      type: 'act_gagner',
      message0: '🎉 gagner la partie !',
      previousStatement: null,
      colour: FIN_COLOR,
    },
    {
      type: 'act_perdre',
      message0: '💥 perdre la partie…',
      previousStatement: null,
      colour: FIN_COLOR,
    },
  ])
}

export const STUDIO_TOOLBOX = {
  kind: 'flyoutToolbox',
  contents: [
    { kind: 'label', text: 'ÉVÉNEMENTS' },
    { kind: 'block', type: 'ev_demarre' },
    { kind: 'block', type: 'ev_clic' },
    { kind: 'block', type: 'ev_toutes' },
    { kind: 'block', type: 'ev_collision' },
    { kind: 'block', type: 'ev_bord' },
    { kind: 'label', text: 'ACTIONS' },
    { kind: 'block', type: 'act_fleches' },
    { kind: 'block', type: 'act_glisser' },
    { kind: 'block', type: 'act_stop' },
    { kind: 'block', type: 'act_teleport' },
    { kind: 'block', type: 'act_dire' },
    { kind: 'label', text: 'SCORE ET FIN' },
    { kind: 'block', type: 'act_score' },
    { kind: 'block', type: 'si_score' },
    { kind: 'block', type: 'act_gagner' },
    { kind: 'block', type: 'act_perdre' },
  ],
}

/* ---- Compilation : blocs → règles interprétables ---- */

function readActions(first: Blockly.Block | null): StudioAction[] {
  const out: StudioAction[] = []
  let b = first
  while (b) {
    switch (b.type) {
      case 'act_fleches':
        out.push({ type: 'fleches', sprite: b.getFieldValue('S') as SpriteTypeId })
        break
      case 'act_glisser':
        out.push({
          type: 'glisser',
          sprite: b.getFieldValue('S') as SpriteTypeId,
          dir: b.getFieldValue('DIR') as 'bas',
          v: Number(b.getFieldValue('V')),
        })
        break
      case 'act_stop':
        out.push({ type: 'stop', sprite: b.getFieldValue('S') as SpriteTypeId })
        break
      case 'act_teleport':
        out.push({
          type: 'teleport',
          sprite: b.getFieldValue('S') as SpriteTypeId,
          where: b.getFieldValue('W') as 'haut',
        })
        break
      case 'act_dire':
        out.push({
          type: 'dire',
          sprite: b.getFieldValue('S') as SpriteTypeId,
          text: String(b.getFieldValue('T') ?? ''),
        })
        break
      case 'act_score':
        out.push({ type: 'score', n: Number(b.getFieldValue('N')) })
        break
      case 'si_score':
        out.push({
          type: 'si_score',
          n: Number(b.getFieldValue('N')),
          actions: readActions(b.getInputTargetBlock('DO')),
        })
        break
      case 'act_gagner':
        out.push({ type: 'gagner' })
        break
      case 'act_perdre':
        out.push({ type: 'perdre' })
        break
    }
    b = b.getNextBlock()
  }
  return out
}

/** Lit toutes les règles de l'atelier Studio. */
export function compileRules(ws: Blockly.Workspace): StudioRules {
  const events: StudioEvent[] = []
  for (const top of ws.getTopBlocks(true)) {
    const actions = readActions(top.getNextBlock())
    switch (top.type) {
      case 'ev_demarre':
        events.push({ kind: 'demarre', actions })
        break
      case 'ev_clic':
        events.push({ kind: 'clic', sprite: top.getFieldValue('S') as SpriteTypeId, actions })
        break
      case 'ev_toutes':
        events.push({ kind: 'toutes', sec: Number(top.getFieldValue('N')), actions })
        break
      case 'ev_collision':
        events.push({
          kind: 'collision',
          a: top.getFieldValue('A') as SpriteTypeId,
          b: top.getFieldValue('B') as SpriteTypeId,
          actions,
        })
        break
      case 'ev_bord':
        events.push({
          kind: 'bord',
          sprite: top.getFieldValue('S') as SpriteTypeId,
          side: top.getFieldValue('SIDE') as 'bas',
          actions,
        })
        break
    }
  }
  return { events }
}
