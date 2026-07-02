import type { LessonContent } from '../types'

/** Planète 2 — Boucla : les boucles. */
export const boucla: Record<string, LessonContent> = {
  'boucla-histoire': {
    kind: 'story',
    pages: [
      { cosmo: 'think', art: '😮‍💨', text: 'Sur cette planète, les chemins sont looongs. Avancer, avancer, avancer, avancer… Pfiou, ça fait beaucoup de blocs !' },
      { cosmo: 'hello', art: '🔁', text: 'Heureusement, les robots ont un secret : la boucle « répéter ». Tu écris l’ordre UNE seule fois, et la boucle le refait autant de fois que tu veux.' },
      { cosmo: 'point', art: '🧠', text: '« répéter 4 fois → avancer » : toi tu poses 2 blocs, la fusée fait 4 pas. Moins de blocs = plus d’étoiles !' },
      { cosmo: 'cheer', art: '⭐', text: 'Les champions du code adorent les boucles. À toi de jouer !' },
    ],
  },

  'boucla-1': {
    kind: 'grid',
    map: ['........', '######G.', '........'],
    start: { x: 0, y: 1, dir: 'E' },
    blocks: ['avancer', 'repeter'],
    par: 2,
    goal: 'arrivee',
    brief: 'Six cases tout droit… Tu POURRAIS mettre 6 blocs « avancer ». Mais essaie la boucle « répéter » : mets « avancer » DEDANS !',
    hints: [
      'Glisse le bloc « avancer » À L’INTÉRIEUR du bloc « répéter ».',
      'Règle la boucle sur 6 : répéter 6 fois → avancer. Seulement 2 blocs !',
    ],
  },

  'boucla-2': {
    kind: 'grid',
    map: ['...G.', '..##.', '.##..', '##...'],
    start: { x: 0, y: 3, dir: 'E' },
    blocks: ['avancer', 'tourner_gauche', 'tourner_droite', 'repeter'],
    par: 5,
    goal: 'arrivee',
    brief: 'Un escalier ! Regarde bien : c’est le MÊME mouvement qui se répète 3 fois. Lequel ?',
    hints: [
      'Une marche = avancer, tourner à gauche, avancer, tourner à droite.',
      'Mets ces 4 blocs dans « répéter 3 fois ».',
    ],
  },

  'boucla-3': {
    kind: 'grid',
    map: ['......', '.###C.', '.C..#.', '.#..#.', '.C##C.', '......'],
    start: { x: 1, y: 1, dir: 'E' },
    blocks: ['avancer', 'tourner_gauche', 'tourner_droite', 'repeter'],
    par: 5,
    goal: 'cristaux',
    brief: 'Fais le tour du carré et ramasse TOUS les cristaux 💎 ! Un côté, c’est toujours le même mouvement…',
    hints: [
      'Un côté du carré = avancer 3 fois puis tourner à droite.',
      'Répète 4 fois : [avancer, avancer, avancer, tourner à droite].',
    ],
  },

  'boucla-repare': {
    kind: 'grid',
    map: ['..........', '########G.', '..........'],
    start: { x: 0, y: 1, dir: 'E' },
    blocks: ['avancer', 'repeter'],
    par: 2,
    goal: 'arrivee',
    brief: 'Ce programme s’arrête TROP TÔT : la fusée n’atteint pas la planète. Teste-le, puis répare le nombre de la boucle.',
    hints: [
      'Compte les cases jusqu’à la planète.',
      'La boucle doit répéter 8 fois, pas 5. Clique sur le nombre pour le changer.',
    ],
    starterXml:
      '<xml xmlns="https://developers.google.com/blockly/xml">' +
      '<block type="quand_demarre" deletable="false" x="16" y="16"><next>' +
      '<block type="repeter"><field name="N">5</field><statement name="DO">' +
      '<block type="avancer"></block></statement></block></next></block></xml>',
  },

  'boucla-4': {
    kind: 'grid',
    map: ['.....G.', '....##.', '...##..', '..##...', '.##....', '##.....'],
    start: { x: 0, y: 5, dir: 'E' },
    blocks: ['avancer', 'tourner_gauche', 'tourner_droite', 'repeter', 'repeter_jusqua'],
    par: 5,
    goal: 'arrivee',
    brief: 'Un escalier GÉANT… et pas envie de compter les marches ? Le bloc « répéter jusqu’à l’arrivée » s’arrête tout seul !',
    hints: [
      'Le même mouvement qu’avant : avancer, tourner à gauche, avancer, tourner à droite.',
      'Mets la marche dans « répéter jusqu’à l’arrivée » : la boucle s’arrête toute seule sur la planète !',
    ],
  },

  'boucla-quiz': {
    kind: 'quiz',
    questions: [
      {
        question: 'Avec ce programme, de combien de cases avance la fusée ?',
        program: ['🚀 au départ', 'répéter 3 fois :', '   avancer ⬆️', '   avancer ⬆️'],
        choices: ['6 cases', '3 cases', '2 cases'],
        answer: 0,
        explain: 'La boucle joue 3 fois les 2 « avancer » : 3 × 2 = 6 cases.',
      },
      {
        question: 'Quand s’arrête « répéter jusqu’à l’arrivée » ?',
        program: ['répéter jusqu’à l’arrivée 🪐 :', '   avancer ⬆️'],
        choices: ['Quand la fusée arrive sur la planète', 'Après 10 répétitions', 'Jamais, elle continue toujours'],
        answer: 0,
        explain: 'Cette boucle vérifie à chaque tour : « suis-je arrivée ? ». Si oui, elle s’arrête.',
      },
    ],
  },

  'boucla-defi': {
    kind: 'grid',
    map: ['.......', '.#C#C#.', '.C...C.', '.#...#.', '.C...C.', '.#C#C#.', '.......'],
    start: { x: 1, y: 1, dir: 'E' },
    blocks: ['avancer', 'tourner_gauche', 'tourner_droite', 'repeter', 'repeter_jusqua'],
    par: 4,
    goal: 'cristaux',
    brief: 'La grande moisson : 8 cristaux autour du grand carré ! Astuce de championne : on peut mettre une boucle… DANS une boucle 🤯',
    hints: [
      'Un côté = répéter 4 fois « avancer », puis tourner à droite.',
      'Mets tout ça dans une boucle « répéter 4 fois » : une boucle dans la boucle, 4 blocs en tout !',
    ],
  },
}
