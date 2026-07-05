import type { LessonContent } from '../types'

/** Planète 4 — Mémora : les variables (la « boîte »). */
export const memora: Record<string, LessonContent> = {
  'memora-histoire': {
    kind: 'story',
    pages: [
      { cosmo: 'hello', art: '📦', text: 'Voici la BOÎTE ! Les codeurs l’appellent une « variable » : la fusée peut y ranger un nombre… et s’en souvenir.' },
      { cosmo: 'think', art: '🔢', text: '« mettre la boîte à 3 » : la boîte contient 3. « ajouter 1 à la boîte » : hop, elle contient 4 ! Le nombre peut changer.' },
      { cosmo: 'point', art: '🎯', text: 'Le plus fort : on peut UTILISER la boîte. « répéter boîte fois » = la fusée répète exactement le nombre rangé dedans !' },
      { cosmo: 'cheer', art: '💎', text: 'Et il y a un compteur magique : « cristaux ramassés » compte tout seul. En route !' },
    ],
  },

  'memora-1': {
    kind: 'grid',
    map: ['.......', '#CCC##G', '.......'],
    start: { x: 0, y: 1, dir: 'E' },
    blocks: ['avancer', 'repeter', 'repeter_valeur', 'cristaux_ramasses', 'var_boite'],
    par: 5,
    goal: 'les-deux',
    brief: 'Ramasse les cristaux… puis utilise le compteur « 💎 cristaux ramassés » dans une boucle : il te dira PILE combien de pas il reste !',
    hints: [
      'D’abord : répéter 3 fois → avancer, pour ramasser les 3 cristaux.',
      'Ensuite : « répéter [💎 cristaux ramassés] fois → avancer ». Glisse le compteur DANS le rond de la boucle !',
    ],
  },

  'memora-2': {
    kind: 'grid',
    map: ['....', '###.', '..#.', '..#.', '..G.'],
    start: { x: 0, y: 1, dir: 'E' },
    blocks: ['avancer', 'tourner_gauche', 'tourner_droite', 'var_mettre', 'var_ajouter', 'repeter_valeur'],
    par: 7,
    maxInstances: { avancer: 2 },
    goal: 'arrivee',
    brief: 'Mission spéciale : tu n’as droit qu’à DEUX blocs « avancer » ! Mets un nombre dans la boîte, avance « boîte » fois, puis fais-la grandir…',
    hints: [
      'Mets la boîte à 2, puis « répéter boîte fois → avancer ». Tourne à droite.',
      'Ajoute 1 à la boîte (elle vaut 3 !) et refais « répéter boîte fois → avancer ».',
    ],
  },

  'memora-3': {
    kind: 'grid',
    map: ['....G.', '....#.', '....#.', '....#.', '#####.'],
    start: { x: 0, y: 4, dir: 'E' },
    blocks: ['avancer', 'tourner_gauche', 'tourner_droite', 'var_mettre', 'var_ajouter', 'repeter_valeur'],
    par: 6,
    goal: 'arrivee',
    brief: 'Ce programme utilise la boîte deux fois… mais le nombre de départ est FAUX. Teste-le, observe, corrige !',
    hints: [
      'Compte les cases d’un côté du virage : il y en a 4.',
      'Mets la boîte à 4 : les DEUX boucles feront 4 pas chacune.',
    ],
    starterXml:
      '<xml xmlns="https://developers.google.com/blockly/xml">' +
      '<block type="quand_demarre" deletable="false" x="16" y="16"><next>' +
      '<block type="var_mettre"><field name="N">2</field><next>' +
      '<block type="repeter_valeur"><value name="N"><shadow type="var_boite"></shadow></value>' +
      '<statement name="DO"><block type="avancer"></block></statement><next>' +
      '<block type="tourner_gauche"><next>' +
      '<block type="repeter_valeur"><value name="N"><shadow type="var_boite"></shadow></value>' +
      '<statement name="DO"><block type="avancer"></block></statement>' +
      '</block></next></block></next></block></next></block></next></block></xml>',
  },

  'memora-repare': {
    kind: 'grid',
    map: ['......', '#####G', '......'],
    start: { x: 0, y: 1, dir: 'E' },
    blocks: ['avancer', 'var_mettre', 'var_ajouter', 'repeter_valeur', 'var_boite'],
    par: 3,
    goal: 'arrivee',
    brief: 'Ce programme dit « répéter boîte fois »… mais personne n’a rien mis dans la boîte ! Elle vaut 0. Répare-le.',
    hints: [
      'Une boîte vide vaut 0 : la boucle ne tourne pas du tout.',
      'Ajoute « mettre la boîte à 5 » AVANT la boucle.',
    ],
    starterXml:
      '<xml xmlns="https://developers.google.com/blockly/xml">' +
      '<block type="quand_demarre" deletable="false" x="16" y="16"><next>' +
      '<block type="repeter_valeur"><value name="N"><shadow type="var_boite"></shadow></value>' +
      '<statement name="DO"><block type="avancer"></block></statement>' +
      '</block></next></block></xml>',
  },

  'memora-quiz': {
    kind: 'quiz',
    questions: [
      {
        question: 'Après ce programme, que contient la boîte 📦 ?',
        program: ['🚀 au départ', 'mettre la boîte 📦 à 2', 'ajouter 3 à la boîte 📦'],
        choices: ['5', '3', '2'],
        answer: 0,
        explain: 'On range 2, puis on ajoute 3 : la boîte contient 2 + 3 = 5.',
      },
      {
        question: 'Combien de cases avance la fusée ?',
        program: ['🚀 au départ', 'mettre la boîte 📦 à 3', 'répéter 📦 fois :', '   avancer ⬆️'],
        choices: ['3 cases', 'Aucune', '6 cases'],
        answer: 0,
        explain: 'La boîte contient 3, donc « répéter boîte fois » répète 3 fois.',
      },
    ],
  },

  'memora-defi': {
    kind: 'grid',
    map: ['......', '#CCC#.', '....#.', '....#.', '....G.'],
    start: { x: 0, y: 1, dir: 'E' },
    blocks: ['avancer', 'tourner_gauche', 'tourner_droite', 'repeter', 'repeter_valeur', 'cristaux_ramasses', 'var_mettre', 'var_ajouter', 'var_boite'],
    par: 6,
    goal: 'les-deux',
    brief: 'La chasse au trésor ! Ramasse tous les cristaux, puis descends vers la planète. Petit secret : le nombre de cristaux = le nombre de pas à faire…',
    hints: [
      'Avance 4 fois pour tout ramasser, puis tourne à droite.',
      'Descends avec « répéter [💎 cristaux ramassés] fois → avancer » : 3 cristaux = 3 pas, pile ce qu’il faut !',
    ],
  },
}
