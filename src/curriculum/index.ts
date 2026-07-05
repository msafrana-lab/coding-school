import type { World, LessonMeta } from './types'

/**
 * Le programme complet : 8 planètes, ~56 missions.
 * Pédagogie : chaque planète suit le cycle PRIMM
 * (histoire → puzzles guidés → réparer → prédire → défi créatif).
 */
export const WORLDS: World[] = [
  {
    id: 'lune',
    name: 'La Lune',
    concept: 'Les ordres',
    color: '#B79CFF',
    intro: 'Apprends à donner des ordres précis à ta fusée, un par un.',
    lessons: [
      { id: 'lune-histoire', title: 'Le langage des fusées', type: 'histoire' },
      { id: 'lune-1', title: 'Premier décollage', type: 'puzzle' },
      { id: 'lune-2', title: 'Le virage', type: 'puzzle' },
      { id: 'lune-3', title: 'Le zigzag', type: 'puzzle' },
      { id: 'lune-repare', title: 'Répare la fusée', type: 'repare' },
      { id: 'lune-4', title: 'Le cristal perdu', type: 'puzzle' },
      { id: 'lune-quiz', title: 'Prédis le chemin', type: 'quiz' },
      { id: 'lune-defi', title: 'Le grand slalom', type: 'defi' },
    ],
  },
  {
    id: 'boucla',
    name: 'Boucla',
    concept: 'Les boucles',
    color: '#3EDDF2',
    intro: 'Pourquoi répéter 10 fois le même ordre ? Les boucles le font pour toi !',
    lessons: [
      { id: 'boucla-histoire', title: 'La magie de répéter', type: 'histoire' },
      { id: 'boucla-1', title: 'La longue ligne droite', type: 'puzzle' },
      { id: 'boucla-2', title: 'L’escalier géant', type: 'puzzle' },
      { id: 'boucla-3', title: 'Le carré parfait', type: 'puzzle' },
      { id: 'boucla-repare', title: 'La boucle cassée', type: 'repare' },
      { id: 'boucla-4', title: 'Jusqu’à l’arrivée', type: 'puzzle' },
      { id: 'boucla-quiz', title: 'Combien de tours ?', type: 'quiz' },
      { id: 'boucla-defi', title: 'La grande moisson', type: 'defi' },
    ],
  },
  {
    id: 'choizix',
    name: 'Choizix',
    concept: 'Les choix',
    color: '#FFD23F',
    intro: 'Ta fusée a des capteurs : apprends-lui à décider toute seule.',
    lessons: [
      { id: 'choizix-histoire', title: 'Les capteurs magiques', type: 'histoire' },
      { id: 'choizix-1', title: 'Stop ou encore ?', type: 'puzzle' },
      { id: 'choizix-2', title: 'Gauche ou droite ?', type: 'puzzle' },
      { id: 'choizix-3', title: 'Sinon…', type: 'puzzle' },
      { id: 'choizix-repare', title: 'Le capteur farceur', type: 'repare' },
      { id: 'choizix-4', title: 'Le labyrinthe malin', type: 'puzzle' },
      { id: 'choizix-quiz', title: 'Devine la route', type: 'quiz' },
      { id: 'choizix-defi', title: 'La grande traversée', type: 'defi' },
    ],
  },
  {
    id: 'memora',
    name: 'Mémora',
    concept: 'La mémoire',
    color: '#FF8A9B',
    intro: 'Les variables sont des boîtes où ta fusée range ce qu’elle compte.',
    lessons: [
      { id: 'memora-histoire', title: 'La boîte à souvenirs', type: 'histoire' },
      { id: 'memora-1', title: 'Compte les cristaux', type: 'puzzle' },
      { id: 'memora-2', title: 'La boîte qui grandit', type: 'puzzle' },
      { id: 'memora-3', title: 'Le bon compte', type: 'puzzle' },
      { id: 'memora-repare', title: 'Le compteur fou', type: 'repare' },
      { id: 'memora-quiz', title: 'Suis la boîte', type: 'quiz' },
      { id: 'memora-defi', title: 'La chasse au trésor', type: 'defi' },
    ],
  },
  {
    id: 'fabrika',
    name: 'Fabrika',
    concept: 'Les ateliers',
    color: '#5CE8A4',
    intro: 'Fabrique tes propres blocs : une recette écrite une fois, utilisée partout.',
    lessons: [
      { id: 'fabrika-histoire', title: 'La machine à recettes', type: 'histoire' },
      { id: 'fabrika-1', title: 'Ta première recette', type: 'puzzle' },
      { id: 'fabrika-2', title: 'Recette + boucle', type: 'puzzle' },
      { id: 'fabrika-3', title: 'Deux recettes', type: 'puzzle' },
      { id: 'fabrika-repare', title: 'La recette ratée', type: 'repare' },
      { id: 'fabrika-quiz', title: 'Que fait la recette ?', type: 'quiz' },
      { id: 'fabrika-defi', title: 'L’usine à chemins', type: 'defi' },
    ],
  },
  {
    id: 'studio',
    name: 'Station Studio',
    concept: 'Crée tes jeux',
    color: '#A88BFF',
    ring: true,
    intro: 'Sprites, événements, score : fabrique de vrais mini-jeux.',
    lessons: [
      { id: 'studio-histoire', title: 'Comment naissent les jeux', type: 'histoire' },
      { id: 'studio-1', title: 'Fais bouger ta fusée', type: 'studio' },
      { id: 'studio-2', title: 'Attrape les étoiles', type: 'studio' },
      { id: 'studio-3', title: 'Gare aux astéroïdes', type: 'studio' },
      { id: 'studio-4', title: 'Ton jeu, ton style', type: 'studio' },
      { id: 'studio-defi', title: 'Mini-jeu en liberté', type: 'studio' },
    ],
  },
  {
    id: 'nebula',
    name: 'Nébula',
    concept: 'Le vrai code',
    color: '#17C3DE',
    intro: 'Sous les blocs se cache du vrai code JavaScript. À toi de l’écrire !',
    lessons: [
      { id: 'nebula-histoire', title: 'Sous le capot des blocs', type: 'histoire' },
      { id: 'nebula-1', title: 'Bonjour JavaScript', type: 'code' },
      { id: 'nebula-2', title: 'La boucle “for”', type: 'code' },
      { id: 'nebula-3', title: 'Le “if” en vrai', type: 'code' },
      { id: 'nebula-repare', title: 'Chasse le bug', type: 'code' },
      { id: 'nebula-4', title: 'Ta variable à toi', type: 'code' },
      { id: 'nebula-defi', title: 'La mission complète', type: 'code' },
    ],
  },
  {
    id: 'final',
    name: 'Le Grand Voyage',
    concept: 'Ton propre jeu',
    color: '#F7B910',
    ring: true,
    intro: 'Tout ce que tu as appris, réuni : crée TON jeu de A à Z.',
    lessons: [
      { id: 'final-histoire', title: 'Ton plan de mission', type: 'histoire' },
      { id: 'final-1', title: 'Choisis ton idée', type: 'projet' },
      { id: 'final-2', title: 'Construis les règles', type: 'projet' },
      { id: 'final-3', title: 'Rends-le magique', type: 'projet' },
      { id: 'final-diplome', title: 'Le diplôme', type: 'projet' },
    ],
  },
]

export const ALL_LESSONS: (LessonMeta & { worldId: string })[] = WORLDS.flatMap((w) =>
  w.lessons.map((l) => ({ ...l, worldId: w.id })),
)

export function findLesson(id: string) {
  for (const w of WORLDS) {
    const i = w.lessons.findIndex((l) => l.id === id)
    if (i !== -1) return { world: w, lesson: w.lessons[i], index: i }
  }
  return null
}

/** La leçon suivante dans l'ordre du voyage, ou null à la toute fin. */
export function nextLessonId(id: string): string | null {
  const flat = ALL_LESSONS
  const i = flat.findIndex((l) => l.id === id)
  return i >= 0 && i < flat.length - 1 ? flat[i + 1].id : null
}
