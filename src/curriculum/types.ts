/** Types du programme pédagogique AstroCode. */

export type LessonType =
  | 'histoire' // Cosmo explique une notion (Prédire de PRIMM)
  | 'puzzle'   // mission à blocs sur la grille spatiale
  | 'repare'   // un programme cassé à corriger (Modifier de PRIMM)
  | 'quiz'     // prédire le résultat d'un programme
  | 'defi'     // mission finale de la planète
  | 'code'     // mission en vrai JavaScript
  | 'studio'   // création de jeu dans le Studio
  | 'projet'   // étape du grand projet final

export interface LessonMeta {
  id: string
  title: string
  type: LessonType
}

export interface World {
  id: string
  name: string
  concept: string
  color: string
  ring?: boolean
  intro: string
  lessons: LessonMeta[]
}

/* ---- Contenu des missions à blocs (grille spatiale) ---- */

/** Une case de la grille : . vide (espace), # sol, C cristal, A astéroïde, G arrivée */
export type TileChar = '.' | '#' | 'C' | 'A' | 'G'

export type Direction = 'N' | 'E' | 'S' | 'O'

export interface PuzzleContent {
  kind: 'grid'
  /** La grille, lignes de caractères (voir TileChar) */
  map: string[]
  start: { x: number; y: number; dir: Direction }
  /** Blocs autorisés dans la boîte à outils */
  blocks: string[]
  /** Nombre de blocs de la solution optimale (3 étoiles si ≤ par) */
  par: number
  /** Ce que dit Cosmo en ouvrant la mission */
  brief: string
  /** Indices progressifs (1er gratuit, suivants affichés à la demande) */
  hints: string[]
  /** Programme de départ (XML Blockly) — pour les missions « répare » et les défis pré-remplis */
  starterXml?: string
  /** Objectif : atteindre l'arrivée et/ou tout ramasser */
  goal?: 'arrivee' | 'cristaux' | 'les-deux'
  /** Limite le nombre d'exemplaires d'un bloc (pour pousser vers la bonne technique) */
  maxInstances?: Record<string, number>
}

export interface StoryPage {
  cosmo: 'hello' | 'happy' | 'think' | 'cheer' | 'point'
  text: string
  /** Petite illustration emoji au-dessus du texte */
  art?: string
}

export interface StoryContent {
  kind: 'story'
  pages: StoryPage[]
}

export interface QuizQuestion {
  question: string
  /** Représentation visuelle du programme, lignes de texte type blocs */
  program?: string[]
  choices: string[]
  answer: number
  explain: string
}

export interface QuizContent {
  kind: 'quiz'
  questions: QuizQuestion[]
}

export interface CodeContent {
  kind: 'code'
  map: string[]
  start: { x: number; y: number; dir: Direction }
  par: number
  brief: string
  hints: string[]
  /** Code de départ affiché dans l'éditeur */
  starterCode: string
  goal?: 'arrivee' | 'cristaux' | 'les-deux'
  /** Fonctions autorisées, affichées en aide-mémoire */
  api: string[]
}

export interface StudioStep {
  /** Consigne affichée à l'enfant */
  text: string
  /** Validation automatique sur le programme du Studio */
  check: string
}

export interface StudioContent {
  kind: 'studio'
  brief: string
  steps: StudioStep[]
  /** Projet de départ (JSON du Studio) */
  starter?: Record<string, unknown>
}

export type LessonContent =
  | PuzzleContent
  | StoryContent
  | QuizContent
  | CodeContent
  | StudioContent
