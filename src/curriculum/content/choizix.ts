import type { LessonContent } from '../types'

/** Planète 3 — Choizix : les conditions (si / sinon) et les capteurs. */
export const choizix: Record<string, LessonContent> = {
  'choizix-histoire': {
    kind: 'story',
    pages: [
      { cosmo: 'hello', art: '📡', text: 'Grande nouvelle : ta fusée a des CAPTEURS ! Elle peut se poser une question, comme « y a-t-il un chemin devant moi ? ». La réponse est OUI ou NON.' },
      { cosmo: 'think', art: '🤔', text: 'Le bloc « si » n’agit QUE si la réponse est OUI. Si c’est NON… il ne fait rien du tout.' },
      { cosmo: 'point', art: '🔀', text: 'Et avec « si… sinon », la fusée choisit entre DEUX actions. C’est elle qui décide toute seule, selon ce qu’elle voit !' },
      { cosmo: 'cheer', art: '🧭', text: 'Sur cette planète, tu ne connaîtras pas toujours le chemin à l’avance. Mais ta fusée, elle, saura se débrouiller !' },
    ],
  },

  'choizix-1': {
    kind: 'grid',
    map: ['......', '#####.', '....#.', '....G.'],
    start: { x: 0, y: 1, dir: 'E' },
    blocks: ['avancer', 'tourner_gauche', 'tourner_droite', 'repeter', 'tant_que'],
    par: 5,
    goal: 'arrivee',
    brief: 'Nouveau bloc : « tant que chemin devant → avancer ». La fusée avance toute seule jusqu’au mur ! À toi de finir le trajet.',
    hints: [
      'Mets « avancer » dans « tant que chemin devant ? » : la fusée file jusqu’au bout du couloir.',
      'Après le couloir : tourne à droite, puis avance 2 fois.',
    ],
  },

  'choizix-2': {
    kind: 'grid',
    map: ['#####.', 'G...#.', '#...#.', '#####.'],
    start: { x: 0, y: 0, dir: 'E' },
    blocks: ['avancer', 'tourner_droite', 'tourner_gauche', 'repeter_jusqua', 'si', 'si_sinon'],
    par: 4,
    goal: 'arrivee',
    brief: 'Mission spéciale : écris un programme où la fusée DÉCIDE seule ! Si chemin devant → avancer, sinon → tourner à droite. Et hop, dans une boucle !',
    hints: [
      'Utilise « répéter jusqu’à l’arrivée » avec un « si… sinon » dedans.',
      'Si chemin devant ? → avancer. Sinon → tourner à droite. 4 blocs suffisent !',
    ],
  },

  'choizix-3': {
    kind: 'grid',
    map: ['.#####', '.#...G', '.#...#', '.#####'],
    start: { x: 5, y: 0, dir: 'O' },
    blocks: ['avancer', 'tourner_droite', 'tourner_gauche', 'repeter_jusqua', 'si', 'si_sinon'],
    par: 4,
    goal: 'arrivee',
    brief: 'Même idée… mais cette fois le chemin tourne de L’AUTRE côté ! Ton programme d’avant marche-t-il encore ? Adapte-le !',
    hints: [
      'Ici, tous les virages sont vers la GAUCHE.',
      'Si chemin devant ? → avancer. Sinon → tourner à gauche.',
    ],
  },

  'choizix-repare': {
    kind: 'grid',
    map: ['####..', '...#..', '..G#..'],
    start: { x: 0, y: 0, dir: 'E' },
    blocks: ['avancer', 'tourner_droite', 'tourner_gauche', 'repeter_jusqua', 'si', 'si_sinon'],
    par: 4,
    goal: 'arrivee',
    brief: 'Ce robot fait TOUT À L’ENVERS : il tourne quand il devrait avancer ! Teste, observe, et remets les blocs à la bonne place.',
    hints: [
      'Regarde le « si… sinon » : les deux actions sont inversées.',
      'Échange « avancer » et « tourner à droite » entre les deux cases du si/sinon.',
    ],
    starterXml:
      '<xml xmlns="https://developers.google.com/blockly/xml">' +
      '<block type="quand_demarre" deletable="false" x="16" y="16"><next>' +
      '<block type="repeter_jusqua"><statement name="DO">' +
      '<block type="si_sinon">' +
      '<value name="COND"><shadow type="capteur"><field name="SENS">cheminDevant</field></shadow></value>' +
      '<statement name="DO"><block type="tourner_droite"></block></statement>' +
      '<statement name="ELSE"><block type="avancer"></block></statement>' +
      '</block></statement></block></next></block></xml>',
  },

  'choizix-4': {
    kind: 'grid',
    map: ['.......', '######.', '..#....', '..G....', '.......'],
    start: { x: 0, y: 1, dir: 'E' },
    blocks: ['avancer', 'tourner_droite', 'tourner_gauche', 'repeter_jusqua', 'si', 'si_sinon'],
    par: 7,
    goal: 'arrivee',
    brief: 'Astuce des explorateurs : garde toujours ta main droite sur le mur ! Le squelette du programme est prêt — à toi de glisser les bonnes actions dans les bonnes cases.',
    hints: [
      'Dans la case du « si chemin à droite ? » : mets « tourner à droite » PUIS « avancer » juste en dessous. Les DEUX ensemble, sinon la fusée tourne en rond !',
      'Dans le « si chemin devant ? » : « avancer ». Et dans son « sinon » : « tourner à gauche ».',
    ],
    starterXml:
      '<xml xmlns="https://developers.google.com/blockly/xml">' +
      '<block type="quand_demarre" deletable="false" x="16" y="16"><next>' +
      '<block type="repeter_jusqua"><statement name="DO">' +
      '<block type="si_sinon">' +
      '<value name="COND"><shadow type="capteur"><field name="SENS">cheminADroite</field></shadow></value>' +
      '<statement name="ELSE">' +
      '<block type="si_sinon">' +
      '<value name="COND"><shadow type="capteur"><field name="SENS">cheminDevant</field></shadow></value>' +
      '</block></statement></block></statement></block></next></block></xml>',
  },

  'choizix-quiz': {
    kind: 'quiz',
    questions: [
      {
        question: 'Le chemin devant la fusée est BLOQUÉ par un rocher. Que fait ce programme ?',
        program: ['si (chemin devant ?) alors :', '   avancer ⬆️'],
        choices: ['Rien du tout, il passe au bloc suivant', 'La fusée avance quand même', 'La fusée explose'],
        answer: 0,
        explain: '« si » n’agit que si la réponse est OUI. Ici c’est NON, donc… rien !',
      },
      {
        question: 'Avec ce programme, que fait la fusée quand elle rencontre un rocher devant elle ?',
        program: ['répéter jusqu’à l’arrivée 🪐 :', '   si (chemin devant ?) alors :', '      avancer ⬆️', '   sinon :', '      tourner à droite ↪️'],
        choices: ['Elle tourne à droite', 'Elle s’arrête pour toujours', 'Elle saute par-dessus'],
        answer: 0,
        explain: 'Chemin bloqué = réponse NON = c’est la partie « sinon » qui joue : tourner à droite.',
      },
    ],
  },

  'choizix-defi': {
    kind: 'grid',
    map: ['........', '####C##G', '..#..#..', '..C..C..', '........'],
    start: { x: 0, y: 1, dir: 'E' },
    blocks: ['avancer', 'tourner_droite', 'tourner_gauche', 'repeter_jusqua', 'si', 'si_sinon'],
    par: 7,
    goal: 'les-deux',
    brief: 'La grande traversée ! Des cristaux se cachent dans des recoins. Ton programme « main droite sur le mur » va TOUT explorer tout seul… magique, non ?',
    hints: [
      'Le même programme que le labyrinthe malin fonctionne ici, à l’identique !',
      'Dans le « si chemin à droite ? » : tourner à droite PUIS avancer (les deux dans la case). Sinon : si chemin devant → avancer, sinon → tourner à gauche.',
    ],
  },
}
