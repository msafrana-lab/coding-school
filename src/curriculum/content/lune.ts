import type { LessonContent } from '../types'

/** Planète 1 — La Lune : les séquences d'ordres. */
export const lune: Record<string, LessonContent> = {
  'lune-histoire': {
    kind: 'story',
    pages: [
      { cosmo: 'hello', art: '🛸', text: 'Bonjour ! Moi c’est Cosmo. Ma fusée est très obéissante… mais elle ne comprend que des ordres très précis, donnés dans le bon ordre.' },
      { cosmo: 'think', art: '🤖', text: 'Un programme, c’est ça : une liste d’ordres. La fusée les suit un par un, du haut vers le bas, sans jamais réfléchir.' },
      { cosmo: 'point', art: '🧩', text: 'Toi, tu vas assembler des blocs : « avancer », « tourner »… Attache-les sous le bloc « 🚀 au départ », et la fusée obéira exactement.' },
      { cosmo: 'cheer', art: '🪐', text: 'Prête ? Ta première mission t’attend : conduis la fusée jusqu’à la planète !' },
    ],
  },

  'lune-1': {
    kind: 'grid',
    map: ['.....', '###G.', '.....'],
    start: { x: 0, y: 1, dir: 'E' },
    blocks: ['avancer'],
    par: 3,
    goal: 'arrivee',
    brief: 'Amène la fusée jusqu’à la planète 🪐. Glisse des blocs « avancer » sous « au départ », puis appuie sur TESTER !',
    hints: [
      'Compte les cases entre la fusée et la planète.',
      'Il faut avancer 3 fois : mets 3 blocs « avancer » les uns sous les autres.',
    ],
  },

  'lune-2': {
    kind: 'grid',
    map: ['.....', '###..', '..#..', '..G..'],
    start: { x: 0, y: 1, dir: 'E' },
    blocks: ['avancer', 'tourner_gauche', 'tourner_droite'],
    par: 5,
    goal: 'arrivee',
    brief: 'Le chemin tourne ! Utilise « tourner à droite » au bon moment. Attention : tourner ne fait pas avancer.',
    hints: [
      'Avance jusqu’au coin, tourne, puis avance encore.',
      'Essaie : avancer, avancer, tourner à droite, avancer, avancer.',
    ],
  },

  'lune-3': {
    kind: 'grid',
    map: ['....', '.##G', '##..'],
    start: { x: 0, y: 2, dir: 'E' },
    blocks: ['avancer', 'tourner_gauche', 'tourner_droite'],
    par: 6,
    goal: 'arrivee',
    brief: 'Un zigzag ! Il faudra tourner à gauche PUIS à droite. Regarde bien dans quel sens la fusée est tournée.',
    hints: [
      'Après le premier pas, le chemin monte : tourne à gauche.',
      'Essaie : avancer, tourner à gauche, avancer, tourner à droite, avancer, avancer.',
    ],
  },

  'lune-repare': {
    kind: 'grid',
    map: ['..G.', '###.', '....'],
    start: { x: 0, y: 1, dir: 'E' },
    blocks: ['avancer', 'tourner_gauche', 'tourner_droite'],
    par: 4,
    goal: 'arrivee',
    brief: 'Ce programme est CASSÉ : la fusée se trompe de côté ! Teste-le pour voir le problème, puis répare-le.',
    hints: [
      'Regarde où la fusée se crashe : elle tourne du mauvais côté.',
      'Remplace « tourner à droite » par « tourner à gauche ».',
    ],
    starterXml:
      '<xml xmlns="https://developers.google.com/blockly/xml">' +
      '<block type="quand_demarre" deletable="false" x="16" y="16"><next>' +
      '<block type="avancer"><next><block type="avancer"><next>' +
      '<block type="tourner_droite"><next><block type="avancer"></block></next></block>' +
      '</next></block></next></block></next></block></xml>',
  },

  'lune-4': {
    kind: 'grid',
    map: ['.....', '#C#G.', '.....'],
    start: { x: 0, y: 1, dir: 'E' },
    blocks: ['avancer', 'tourner_gauche', 'tourner_droite'],
    par: 3,
    goal: 'les-deux',
    brief: 'Nouveau : un cristal 💎 ! La fusée le ramasse en passant dessus. Ramasse-le PUIS va sur la planète.',
    hints: ['Le cristal est pile sur ton chemin : avance simplement jusqu’à la planète.'],
  },

  'lune-quiz': {
    kind: 'quiz',
    questions: [
      {
        question: 'La fusée regarde vers la droite →. Après ce programme, où est-elle ?',
        program: ['🚀 au départ', 'avancer ⬆️', 'avancer ⬆️', 'tourner à droite ↪️'],
        choices: ['2 cases plus loin, tournée vers le bas', '3 cases plus loin', 'Au même endroit'],
        answer: 0,
        explain: '« avancer » 2 fois = 2 cases. « tourner » fait pivoter la fusée mais ne la déplace pas !',
      },
      {
        question: 'Que fait le bloc « tourner à gauche ↩️ » ?',
        choices: ['La fusée pivote sur place, sans changer de case', 'La fusée avance vers la gauche', 'La fusée recule d’une case'],
        answer: 0,
        explain: 'Tourner = pivoter sur place. Pour bouger, il faut ensuite « avancer ».',
      },
    ],
  },

  'lune-defi': {
    kind: 'grid',
    map: ['......', '......', '##C#..', '#..C..', '#..##G'],
    start: { x: 0, y: 4, dir: 'N' },
    blocks: ['avancer', 'tourner_gauche', 'tourner_droite'],
    par: 12,
    goal: 'les-deux',
    brief: 'Le grand slalom ! Ramasse les 2 cristaux 💎 et rejoins la planète. Prends ton temps, case par case.',
    hints: [
      'Monte d’abord tout en haut, puis tourne à droite.',
      'Chemin : 2 pas en haut, à droite 3 pas, en bas 2 pas, à gauche… non, regarde : après les 2 pas vers le bas, tourne à gauche puis avance 2 fois.',
    ],
  },
}
