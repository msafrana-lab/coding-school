import type { LessonContent } from '../types'

/** Planète 7 — Nébula : le vrai code JavaScript. */
export const nebula: Record<string, LessonContent> = {
  'nebula-histoire': {
    kind: 'story',
    pages: [
      { cosmo: 'hello', art: '🎭', text: 'Grande révélation : tes blocs ont TOUJOURS été du vrai code déguisé ! Derrière chaque bloc se cache une ligne de JavaScript, le langage qui fait vivre les sites et les jeux du monde entier.' },
      { cosmo: 'think', art: '⌨️', text: 'Le bloc « avancer ⬆️ » s’écrit : avancer(); — les parenthèses ( ) disent « fais-le ! », et le point-virgule ; termine l’ordre.' },
      { cosmo: 'point', art: '🔁', text: '« répéter 3 fois » devient : for (let i = 0; i < 3; i++) { … } — ça impressionne, mais c’est exactement la même idée !' },
      { cosmo: 'cheer', art: '🚀', text: 'Sur Nébula, tu écris directement le code. Le clavier est ta nouvelle baguette magique. Et souviens-toi : les fautes de frappe arrivent à TOUS les codeurs !' },
    ],
  },

  'nebula-1': {
    kind: 'code',
    map: ['......', '####G.', '......'],
    start: { x: 0, y: 1, dir: 'E' },
    par: 4,
    goal: 'arrivee',
    brief: 'Ta première mission en VRAI code ! Complète le programme pour atteindre la planète. Tape au clavier, ou touche les boutons de l’aide-mémoire.',
    hints: [
      'Chaque « avancer(); » fait un pas. Compte les cases jusqu’à la planète.',
      'Il faut 4 lignes « avancer(); » en tout.',
    ],
    starterCode: `// Ta fusée comprend des ordres en vrai code :
//   avancer();
// Les parenthèses () disent « fais-le ! »
// Le point-virgule ; termine l'ordre.

avancer();
avancer();

// Il en faut plus pour atteindre la planète !
`,
    api: ['avancer();'],
  },

  'nebula-2': {
    kind: 'code',
    map: ['..........', '########G.', '..........'],
    start: { x: 0, y: 1, dir: 'E' },
    par: 3,
    goal: 'arrivee',
    brief: 'Huit cases ! Pas question d’écrire 8 lignes : voici la boucle « for ». Elle répète tout ce qui est entre { }. Règle le bon nombre !',
    hints: [
      'Le nombre après « i < » est le nombre de répétitions.',
      'Remplace 3 par 8 : for (let i = 0; i < 8; i++)',
    ],
    starterCode: `// La boucle "for" répète les ordres entre { }
// Ici, elle répète 3 fois... il en faut plus !

for (let i = 0; i < 3; i++) {
  avancer();
}
`,
    api: ['avancer();', 'for (let i = 0; i < 8; i++) {', '}'],
  },

  'nebula-3': {
    kind: 'code',
    map: ['#####.', 'G...#.', '#...#.', '#####.'],
    start: { x: 0, y: 0, dir: 'E' },
    par: 6,
    goal: 'arrivee',
    brief: 'Le retour de la fusée intelligente ! « while » = tant que, « if » = si, « ! » = NON. Complète le « else » (sinon) pour qu’elle se débrouille seule.',
    hints: [
      'Quand le chemin est bloqué, la fusée doit tourner à droite.',
      'Écris tournerADroite(); dans le else { }',
    ],
    starterCode: `// while = « tant que », ! = « NON »
// Tant que la fusée n'est PAS arrivée :
while (!surArrivee()) {
  if (cheminDevant()) {
    avancer();
  } else {
    // Bloqué ! Que faire ? (indice : tourner…)
  }
}
`,
    api: ['avancer();', 'tournerADroite();', 'tournerAGauche();', 'cheminDevant()', 'surArrivee()'],
  },

  'nebula-repare': {
    kind: 'code',
    map: ['###.', '..#.', '..G.'],
    start: { x: 0, y: 0, dir: 'E' },
    par: 5,
    goal: 'arrivee',
    brief: 'Il y a un BUG dans ce code : une faute de frappe s’est glissée quelque part. Teste-le : la fusée te dira ce qu’elle ne comprend pas !',
    hints: [
      'Lis bien le message d’erreur : quel mot la fusée ne connaît-elle pas ?',
      '« avancr » n’existe pas… il manque un « e » : avancer();',
    ],
    starterCode: `avancer();
avancr();
tournerADroite();
avancer();
avancer();
`,
    api: ['avancer();', 'tournerADroite();', 'tournerAGauche();'],
  },

  'nebula-4': {
    kind: 'code',
    map: ['....', '..G.', '..#.', '..#.', '..#.', '###.'],
    start: { x: 0, y: 5, dir: 'E' },
    par: 8,
    goal: 'arrivee',
    brief: 'Voici « let » : il crée une variable, comme ta boîte 📦 ! Mais les nombres de ce programme sont faux. Observe, teste, corrige.',
    hints: [
      'Il faut 2 pas vers la droite, puis 4 pas vers le haut.',
      'Mets « let pas = 2; » au début, puis « pas = pas + 2; » après le virage.',
    ],
    starterCode: `let pas = 1;        // une variable, comme ta boîte !
for (let i = 0; i < pas; i++) {
  avancer();
}
tournerAGauche();
pas = pas + 1;      // la variable grandit
for (let i = 0; i < pas; i++) {
  avancer();
}
// Les nombres ne sont pas les bons… à toi !
`,
    api: ['avancer();', 'tournerAGauche();', 'let pas = 2;', 'pas = pas + 2;'],
  },

  'nebula-defi': {
    kind: 'code',
    map: ['........', '####C##G', '..#..#..', '..C..C..', '........'],
    start: { x: 0, y: 1, dir: 'E' },
    par: 10,
    goal: 'les-deux',
    brief: 'La mission complète : le labyrinthe aux cristaux, 100 % en vrai code ! Complète la stratégie « main droite sur le mur ».',
    hints: [
      'Si le chemin devant est libre : avancer();',
      'Sinon (tout est bloqué) : tournerAGauche();',
    ],
    starterCode: `// La stratégie de l'exploratrice :
// main droite sur le mur, toujours !
while (!surArrivee()) {
  if (cheminADroite()) {
    tournerADroite();
    avancer();
  } else if (cheminDevant()) {
    // à compléter…
  } else {
    // à compléter…
  }
}
`,
    api: ['avancer();', 'tournerADroite();', 'tournerAGauche();', 'cheminDevant()', 'cheminADroite()', 'surArrivee()'],
  },
}
