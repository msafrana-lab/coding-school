import * as Blockly from 'blockly/core'
import 'blockly/blocks'
import { javascriptGenerator, Order } from 'blockly/javascript'
import * as Fr from 'blockly/msg/fr'

let installed = false

export const COLORS = {
  action: '#8B63F7',
  boucle: '#17C3DE',
  logique: '#F7B910',
  capteur: '#34D186',
  variable: '#FF6B81',
  motif: '#5CE8A4',
  depart: '#FFB020',
}

/** Déclare tous les blocs AstroCode (une seule fois). */
export function installBlocks() {
  if (installed) return
  installed = true

  Blockly.setLocale(Fr as unknown as { [key: string]: string })

  Blockly.defineBlocksWithJsonArray([
    {
      type: 'quand_demarre',
      message0: '🚀 au départ',
      nextStatement: null,
      colour: COLORS.depart,
      tooltip: 'Ton programme commence ici. Attache tes blocs en dessous !',
    },
    {
      type: 'avancer',
      message0: 'avancer ⬆️',
      previousStatement: null,
      nextStatement: null,
      colour: COLORS.action,
      tooltip: 'La fusée avance d’une case.',
    },
    {
      type: 'tourner_gauche',
      message0: 'tourner à gauche ↩️',
      previousStatement: null,
      nextStatement: null,
      colour: COLORS.action,
      tooltip: 'La fusée pivote vers la gauche (sans avancer).',
    },
    {
      type: 'tourner_droite',
      message0: 'tourner à droite ↪️',
      previousStatement: null,
      nextStatement: null,
      colour: COLORS.action,
      tooltip: 'La fusée pivote vers la droite (sans avancer).',
    },
    {
      type: 'repeter',
      message0: 'répéter %1 fois',
      args0: [{ type: 'field_number', name: 'N', value: 3, min: 1, max: 50, precision: 1 }],
      message1: '%1',
      args1: [{ type: 'input_statement', name: 'DO' }],
      previousStatement: null,
      nextStatement: null,
      colour: COLORS.boucle,
      tooltip: 'Répète les blocs à l’intérieur.',
    },
    {
      type: 'repeter_valeur',
      message0: 'répéter %1 fois',
      args0: [{ type: 'input_value', name: 'N', check: 'Number' }],
      message1: '%1',
      args1: [{ type: 'input_statement', name: 'DO' }],
      previousStatement: null,
      nextStatement: null,
      colour: COLORS.boucle,
      tooltip: 'Répète autant de fois que le nombre donné.',
    },
    {
      type: 'repeter_jusqua',
      message0: 'répéter jusqu’à l’arrivée 🪐',
      message1: '%1',
      args1: [{ type: 'input_statement', name: 'DO' }],
      previousStatement: null,
      nextStatement: null,
      colour: COLORS.boucle,
      tooltip: 'Répète les blocs jusqu’à ce que la fusée atteigne l’arrivée.',
    },
    {
      type: 'tant_que',
      message0: 'tant que %1',
      args0: [{ type: 'input_value', name: 'COND', check: 'Boolean' }],
      message1: '%1',
      args1: [{ type: 'input_statement', name: 'DO' }],
      previousStatement: null,
      nextStatement: null,
      colour: COLORS.boucle,
      tooltip: 'Répète tant que le capteur dit OUI.',
    },
    {
      type: 'si',
      message0: 'si %1 alors',
      args0: [{ type: 'input_value', name: 'COND', check: 'Boolean' }],
      message1: '%1',
      args1: [{ type: 'input_statement', name: 'DO' }],
      previousStatement: null,
      nextStatement: null,
      colour: COLORS.logique,
      tooltip: 'Fait les blocs seulement si le capteur dit OUI.',
    },
    {
      type: 'si_sinon',
      message0: 'si %1 alors',
      args0: [{ type: 'input_value', name: 'COND', check: 'Boolean' }],
      message1: '%1',
      args1: [{ type: 'input_statement', name: 'DO' }],
      message2: 'sinon',
      message3: '%1',
      args3: [{ type: 'input_statement', name: 'ELSE' }],
      previousStatement: null,
      nextStatement: null,
      colour: COLORS.logique,
      tooltip: 'Fait une chose si OUI, une autre si NON.',
    },
    {
      type: 'capteur',
      message0: '%1',
      args0: [
        {
          type: 'field_dropdown',
          name: 'SENS',
          options: [
            ['chemin devant ?', 'cheminDevant'],
            ['chemin à gauche ?', 'cheminAGauche'],
            ['chemin à droite ?', 'cheminADroite'],
            ['sur l’arrivée ?', 'surArrivee'],
          ],
        },
      ],
      output: 'Boolean',
      colour: COLORS.capteur,
      tooltip: 'Un capteur : il répond OUI ou NON.',
    },
    {
      type: 'non',
      message0: 'NON %1',
      args0: [{ type: 'input_value', name: 'COND', check: 'Boolean' }],
      output: 'Boolean',
      colour: COLORS.capteur,
      tooltip: 'Inverse la réponse : OUI devient NON.',
    },
    {
      type: 'var_mettre',
      message0: 'mettre la boîte 📦 à %1',
      args0: [{ type: 'field_number', name: 'N', value: 0, precision: 1 }],
      previousStatement: null,
      nextStatement: null,
      colour: COLORS.variable,
      tooltip: 'Range ce nombre dans la boîte.',
    },
    {
      type: 'var_ajouter',
      message0: 'ajouter %1 à la boîte 📦',
      args0: [{ type: 'field_number', name: 'N', value: 1, precision: 1 }],
      previousStatement: null,
      nextStatement: null,
      colour: COLORS.variable,
      tooltip: 'Ajoute ce nombre à ce qu’il y a déjà dans la boîte.',
    },
    {
      type: 'var_boite',
      message0: 'boîte 📦',
      output: 'Number',
      colour: COLORS.variable,
      tooltip: 'Le nombre rangé dans la boîte.',
    },
    {
      type: 'cristaux_ramasses',
      message0: '💎 cristaux ramassés',
      output: 'Number',
      colour: COLORS.variable,
      tooltip: 'Combien de cristaux la fusée a ramassés.',
    },
    {
      type: 'motif_def_a',
      message0: 'définir le motif ⭐',
      message1: '%1',
      args1: [{ type: 'input_statement', name: 'DO' }],
      colour: COLORS.motif,
      tooltip: 'Ta recette ⭐ : écris-la une fois, utilise-la partout !',
    },
    {
      type: 'motif_def_b',
      message0: 'définir le motif 🌙',
      message1: '%1',
      args1: [{ type: 'input_statement', name: 'DO' }],
      colour: COLORS.motif,
      tooltip: 'Ta recette 🌙 : écris-la une fois, utilise-la partout !',
    },
    {
      type: 'motif_a',
      message0: 'faire le motif ⭐',
      previousStatement: null,
      nextStatement: null,
      colour: COLORS.motif,
      tooltip: 'Joue la recette ⭐.',
    },
    {
      type: 'motif_b',
      message0: 'faire le motif 🌙',
      previousStatement: null,
      nextStatement: null,
      colour: COLORS.motif,
      tooltip: 'Joue la recette 🌙.',
    },
  ])

  const g = javascriptGenerator
  g.STATEMENT_PREFIX = 'trace(%1);\n'
  g.INFINITE_LOOP_TRAP = 'if (--LOOP_BUDGET < 0) throw new RangeError("boucle");\n'
  g.addReservedWords(
    'trace,avancer,tournerGauche,tournerDroite,cheminDevant,cheminAGauche,cheminADroite,surArrivee,cristaux,boite,motifA,motifB,LOOP_BUDGET,api',
  )

  g.forBlock['quand_demarre'] = () => ''
  g.forBlock['avancer'] = () => 'avancer();\n'
  g.forBlock['tourner_gauche'] = () => 'tournerGauche();\n'
  g.forBlock['tourner_droite'] = () => 'tournerDroite();\n'

  g.forBlock['repeter'] = (block, gen) => {
    const n = Number(block.getFieldValue('N'))
    let branch = gen.statementToCode(block, 'DO')
    branch = gen.addLoopTrap(branch, block)
    return `for (let i = 0; i < ${n}; i++) {\n${branch}}\n`
  }
  g.forBlock['repeter_valeur'] = (block, gen) => {
    const n = gen.valueToCode(block, 'N', Order.NONE) || '0'
    let branch = gen.statementToCode(block, 'DO')
    branch = gen.addLoopTrap(branch, block)
    return `for (let i = 0; i < (${n}); i++) {\n${branch}}\n`
  }
  g.forBlock['repeter_jusqua'] = (block, gen) => {
    let branch = gen.statementToCode(block, 'DO')
    branch = gen.addLoopTrap(branch, block)
    return `while (!surArrivee()) {\n${branch}}\n`
  }
  g.forBlock['tant_que'] = (block, gen) => {
    const cond = gen.valueToCode(block, 'COND', Order.NONE) || 'false'
    let branch = gen.statementToCode(block, 'DO')
    branch = gen.addLoopTrap(branch, block)
    return `while (${cond}) {\n${branch}}\n`
  }
  g.forBlock['si'] = (block, gen) => {
    const cond = gen.valueToCode(block, 'COND', Order.NONE) || 'false'
    const branch = gen.statementToCode(block, 'DO')
    return `if (${cond}) {\n${branch}}\n`
  }
  g.forBlock['si_sinon'] = (block, gen) => {
    const cond = gen.valueToCode(block, 'COND', Order.NONE) || 'false'
    const branch = gen.statementToCode(block, 'DO')
    const other = gen.statementToCode(block, 'ELSE')
    return `if (${cond}) {\n${branch}} else {\n${other}}\n`
  }
  g.forBlock['capteur'] = (block) => [`${block.getFieldValue('SENS')}()`, Order.FUNCTION_CALL]
  g.forBlock['non'] = (block, gen) => {
    const cond = gen.valueToCode(block, 'COND', Order.LOGICAL_NOT) || 'false'
    return [`!${cond}`, Order.LOGICAL_NOT]
  }
  g.forBlock['var_mettre'] = (block) => `boite = ${Number(block.getFieldValue('N'))};\n`
  g.forBlock['var_ajouter'] = (block) => `boite = boite + ${Number(block.getFieldValue('N'))};\n`
  g.forBlock['var_boite'] = () => ['boite', Order.ATOMIC]
  g.forBlock['cristaux_ramasses'] = () => ['cristaux()', Order.FUNCTION_CALL]
  g.forBlock['motif_def_a'] = (block, gen) => {
    const branch = gen.statementToCode(block, 'DO')
    return `function motifA() {\n${branch}}\n`
  }
  g.forBlock['motif_def_b'] = (block, gen) => {
    const branch = gen.statementToCode(block, 'DO')
    return `function motifB() {\n${branch}}\n`
  }
  g.forBlock['motif_a'] = () => 'motifA();\n'
  g.forBlock['motif_b'] = () => 'motifB();\n'
}

export const astroTheme = Blockly.Theme.defineTheme('astrocode', {
  name: 'astrocode',
  base: Blockly.Themes.Zelos,
  componentStyles: {
    workspaceBackgroundColour: '#0B1035',
    toolboxBackgroundColour: '#141B4D',
    flyoutBackgroundColour: '#141B4D',
    flyoutOpacity: 1,
    scrollbarColour: '#3A4699',
    insertionMarkerColour: '#ffffff',
    insertionMarkerOpacity: 0.4,
  },
  fontStyle: { family: 'Nunito, sans-serif', weight: 'bold', size: 11 },
})

/** Construit la boîte à outils (flyout simple) pour une liste de blocs. */
export function buildToolbox(blockIds: string[]) {
  const contents = blockIds.map((id) => {
    if (id === 'si' || id === 'si_sinon' || id === 'tant_que') {
      return {
        kind: 'block',
        type: id,
        inputs: { COND: { shadow: { type: 'capteur' } } },
      }
    }
    if (id === 'repeter_valeur') {
      return {
        kind: 'block',
        type: id,
        inputs: { N: { shadow: { type: 'var_boite' } } },
      }
    }
    return { kind: 'block', type: id }
  })
  return { kind: 'flyoutToolbox', contents }
}
