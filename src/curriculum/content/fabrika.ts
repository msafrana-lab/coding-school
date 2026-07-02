import type { LessonContent } from '../types'

/** Planète 5 — Fabrika : les fonctions (« recettes » / motifs). */
export const fabrika: Record<string, LessonContent> = {
  'fabrika-histoire': {
    kind: 'story',
    pages: [
      { cosmo: 'hello', art: '🏭', text: 'Bienvenue à Fabrika, l’usine à recettes ! Ici, tu fabriques tes PROPRES blocs.' },
      { cosmo: 'think', art: '📋', text: 'Une recette (les grands disent une « fonction »), c’est un groupe d’ordres avec un nom. Tu l’écris UNE seule fois…' },
      { cosmo: 'point', art: '✨', text: '…et tu l’utilises partout avec « faire le motif ⭐ » ! Si tu changes la recette, tous les endroits qui l’utilisent changent aussi.' },
      { cosmo: 'cheer', art: '🧑‍🍳', text: 'Les grands programmes du monde entier sont faits comme ça : des petites recettes bien rangées. À toi !' },
    ],
  },

  'fabrika-1': {
    kind: 'grid',
    map: ['...G.', '..##.', '.##..', '##...'],
    start: { x: 0, y: 3, dir: 'E' },
    blocks: ['motif_def_a', 'motif_a', 'avancer', 'tourner_gauche', 'tourner_droite'],
    par: 8,
    goal: 'arrivee',
    brief: 'Tiens, l’escalier… mais SANS le bloc « répéter » ! Fabrique une recette « une marche », puis utilise-la 3 fois.',
    hints: [
      'Dans « définir le motif ⭐ », mets : avancer, tourner à gauche, avancer, tourner à droite.',
      'Sous « au départ », mets 3 fois le bloc « faire le motif ⭐ ».',
    ],
  },

  'fabrika-2': {
    kind: 'grid',
    map: ['.....G.', '....##.', '...##..', '..##...', '.##....', '##.....'],
    start: { x: 0, y: 5, dir: 'E' },
    blocks: ['motif_def_a', 'motif_a', 'avancer', 'tourner_gauche', 'tourner_droite', 'repeter'],
    par: 7,
    goal: 'arrivee',
    brief: 'L’escalier GÉANT est de retour ! Cette fois, combine ta recette avec une boucle : « répéter 5 fois → faire le motif ⭐ ».',
    hints: [
      'La recette ⭐ : avancer, tourner à gauche, avancer, tourner à droite.',
      'Sous « au départ » : répéter 5 fois → faire le motif ⭐. Sept blocs en tout !',
    ],
  },

  'fabrika-3': {
    kind: 'grid',
    map: ['###...', '..#...', '..###.', '....#.', '....G.'],
    start: { x: 0, y: 0, dir: 'E' },
    blocks: ['motif_def_a', 'motif_def_b', 'motif_a', 'motif_b', 'avancer', 'tourner_gauche', 'tourner_droite', 'repeter'],
    par: 11,
    goal: 'arrivee',
    brief: 'Deux recettes ! ⭐ tourne à droite, 🌙 tourne à gauche. Le chemin alterne : ⭐, 🌙, ⭐, 🌙…',
    hints: [
      'Motif ⭐ : avancer, avancer, tourner à droite. Motif 🌙 : avancer, avancer, tourner à gauche.',
      'Sous « au départ » : répéter 2 fois → [faire ⭐, faire 🌙].',
    ],
  },

  'fabrika-repare': {
    kind: 'grid',
    map: ['.....', '.##C.', '.C.#.', '.C#C.', '.....'],
    start: { x: 1, y: 1, dir: 'E' },
    blocks: ['motif_def_a', 'motif_a', 'avancer', 'tourner_gauche', 'tourner_droite', 'repeter'],
    par: 6,
    goal: 'cristaux',
    brief: 'La recette de ce robot est RATÉE : les ordres sont dans le mauvais ordre ! Teste, regarde le crash, et répare la recette.',
    hints: [
      'La recette fait : avancer, tourner, avancer. Elle tourne TROP TÔT.',
      'La bonne recette : avancer, avancer, PUIS tourner à droite.',
    ],
    starterXml:
      '<xml xmlns="https://developers.google.com/blockly/xml">' +
      '<block type="motif_def_a" x="16" y="140"><statement name="DO">' +
      '<block type="avancer"><next><block type="tourner_droite"><next>' +
      '<block type="avancer"></block></next></block></next></block></statement></block>' +
      '<block type="quand_demarre" deletable="false" x="16" y="16"><next>' +
      '<block type="repeter"><field name="N">4</field><statement name="DO">' +
      '<block type="motif_a"></block></statement></block></next></block></xml>',
  },

  'fabrika-quiz': {
    kind: 'quiz',
    questions: [
      {
        question: 'Le motif ⭐ contient [avancer, avancer]. Que fait ce programme ?',
        program: ['🚀 au départ', 'répéter 3 fois :', '   faire le motif ⭐'],
        choices: ['La fusée avance de 6 cases', 'La fusée avance de 5 cases', 'La fusée avance de 2 cases'],
        answer: 0,
        explain: '3 répétitions × 2 « avancer » dans la recette = 6 cases.',
      },
      {
        question: 'Pourquoi les recettes (fonctions) sont-elles si pratiques ?',
        choices: ['On écrit une fois, on réutilise partout', 'Elles font voler la fusée plus vite', 'Elles donnent des étoiles bonus'],
        answer: 0,
        explain: 'Exactement ! Et si on corrige la recette, tout le programme profite de la correction.',
      },
    ],
  },

  'fabrika-defi': {
    kind: 'grid',
    map: ['.....G.', '....##.', '...#C..', '..##...', '.#C....', '##.....'],
    start: { x: 0, y: 5, dir: 'E' },
    blocks: ['motif_def_a', 'motif_def_b', 'motif_a', 'motif_b', 'avancer', 'tourner_gauche', 'tourner_droite', 'repeter', 'repeter_valeur', 'cristaux_ramasses'],
    par: 7,
    goal: 'les-deux',
    brief: 'L’usine à chemins ! Grimpe l’escalier, ramasse les cristaux au passage, atteins la planète. Une bonne recette et c’est réglé !',
    hints: [
      'C’est le même escalier que tout à l’heure : la recette ⭐ [avancer, tourner à gauche, avancer, tourner à droite].',
      'Répéter 5 fois → faire le motif ⭐. Les cristaux sont sur le chemin, ils se ramassent tout seuls !',
    ],
  },
}
