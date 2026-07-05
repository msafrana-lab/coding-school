import type { LessonContent } from '../types'

/** Planète 8 — Le Grand Voyage : créer SON jeu, de A à Z. */
export const final: Record<string, LessonContent> = {
  'final-histoire': {
    kind: 'story',
    pages: [
      { cosmo: 'hello', art: '🗺️', text: 'Te voilà au bout de la galaxie… et au début de TA plus grande aventure : créer ton propre jeu, entièrement, comme une vraie créatrice.' },
      { cosmo: 'think', art: '📋', text: 'Les pros commencent toujours par un PLAN : quels personnages ? Comment on joue ? Comment on gagne… et comment on perd ?' },
      { cosmo: 'point', art: '🛠️', text: 'Tu vas construire en 3 étapes : 1️⃣ ton idée, 2️⃣ tes règles, 3️⃣ ta touche magique. Ton Studio garde tout en mémoire d’une étape à l’autre.' },
      { cosmo: 'cheer', art: '🎓', text: 'Et à la toute fin… ton DIPLÔME de créatrice de jeux t’attend. Au travail, artiste !' },
    ],
  },

  'final-1': {
    kind: 'studio',
    projectKey: 'grand-projet',
    brief: 'Étape 1 — TON idée : choisis tes personnages, pose-les sur la scène, décide qui est le héros. C’est ton monde !',
    steps: [
      { text: 'Choisis au moins 2 personnages différents et pose-les sur la scène', check: 'sprites:2' },
      { text: 'Décide comment on joue : « les flèches dirigent » ton héros', check: 'action:fleches' },
      { text: 'Lance une partie pour voir ton monde prendre vie', check: 'joue' },
    ],
  },

  'final-2': {
    kind: 'studio',
    projectKey: 'grand-projet',
    brief: 'Étape 2 — les règles : que se passe-t-il quand deux personnages se touchent ? Comment gagne-t-on ? Comment perd-on ?',
    steps: [
      { text: 'Crée au moins une règle « 💥 quand X touche Y »', check: 'event:collision' },
      { text: 'Fais vivre le score : « 🏆 ajouter au score » quelque part', check: 'action:score' },
      { text: 'Prévois une fin de partie : gagner ou perdre', check: 'action:fin' },
      { text: 'Teste ton jeu en entier', check: 'joue' },
    ],
  },

  'final-3': {
    kind: 'studio',
    projectKey: 'grand-projet',
    brief: 'Étape 3 — la magie : le décor, les dialogues, le rythme. C’est ta touche personnelle qui rend un jeu inoubliable !',
    steps: [
      { text: 'Choisis le décor parfait pour ton histoire', check: 'fond-change' },
      { text: 'Fais parler un personnage avec « 💬 dit »', check: 'action:dire' },
      { text: 'Donne du rythme avec « ⏰ toutes les X secondes »', check: 'event:toutes' },
      { text: 'Gagne une partie de TON propre jeu !', check: 'gagne' },
    ],
  },

  'final-diplome': {
    kind: 'diplome',
  },
}
