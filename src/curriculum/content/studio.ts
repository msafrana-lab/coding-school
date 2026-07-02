import type { LessonContent } from '../types'

const XML_NS = '<xml xmlns="https://developers.google.com/blockly/xml">'

/** Règles pré-remplies pour démarrer chaque mission Studio. */
const XML_FLECHES =
  XML_NS +
  '<block type="ev_demarre" x="16" y="16"><next>' +
  '<block type="act_fleches"><field name="S">fusee</field></block></next></block></xml>'

const XML_ATTRAPE =
  XML_NS +
  '<block type="ev_demarre" x="16" y="16"><next>' +
  '<block type="act_fleches"><field name="S">fusee</field><next>' +
  '<block type="act_glisser"><field name="S">etoile</field><field name="DIR">bas</field><field name="V">2</field>' +
  '</block></next></block></next></block>' +
  '<block type="ev_collision" x="16" y="220"><field name="A">fusee</field><field name="B">etoile</field><next>' +
  '<block type="act_score"><field name="N">1</field><next>' +
  '<block type="act_teleport"><field name="S">etoile</field><field name="W">haut</field><next>' +
  '<block type="si_score"><field name="N">5</field><statement name="DO">' +
  '<block type="act_gagner"></block></statement></block>' +
  '</next></block></next></block></next></block></xml>'

const XML_ASTEROIDES =
  XML_NS +
  '<block type="ev_demarre" x="16" y="16"><next>' +
  '<block type="act_fleches"><field name="S">fusee</field><next>' +
  '<block type="act_glisser"><field name="S">etoile</field><field name="DIR">bas</field><field name="V">2</field><next>' +
  '<block type="act_glisser"><field name="S">asteroide</field><field name="DIR">bas</field><field name="V">3</field>' +
  '</block></next></block></next></block></next></block>' +
  '<block type="ev_collision" x="16" y="290"><field name="A">fusee</field><field name="B">etoile</field><next>' +
  '<block type="act_score"><field name="N">1</field><next>' +
  '<block type="act_teleport"><field name="S">etoile</field><field name="W">haut</field><next>' +
  '<block type="si_score"><field name="N">5</field><statement name="DO">' +
  '<block type="act_gagner"></block></statement></block>' +
  '</next></block></next></block></next></block>' +
  '<block type="ev_collision" x="16" y="560"><field name="A">fusee</field><field name="B">asteroide</field><next>' +
  '<block type="act_perdre"></block></next></block>' +
  '<block type="ev_bord" x="360" y="16"><field name="S">asteroide</field><field name="SIDE">bas</field><next>' +
  '<block type="act_teleport"><field name="S">asteroide</field><field name="W">haut</field></block></next></block>' +
  '<block type="ev_bord" x="360" y="180"><field name="S">etoile</field><field name="SIDE">bas</field><next>' +
  '<block type="act_teleport"><field name="S">etoile</field><field name="W">haut</field></block></next></block></xml>'

const SCENE_ATTRAPE = [
  { type: 'fusee', x: 50, y: 85, size: 1.2 },
  { type: 'etoile', x: 20, y: 10, size: 1 },
  { type: 'etoile', x: 50, y: 7, size: 1 },
  { type: 'etoile', x: 80, y: 12, size: 1 },
]

const SCENE_ASTEROIDES = [
  ...SCENE_ATTRAPE,
  { type: 'asteroide', x: 35, y: 5, size: 1.1 },
  { type: 'asteroide', x: 68, y: 9, size: 1.1 },
]

/** Planète 6 — Station Studio : créer de vrais mini-jeux. */
export const studio: Record<string, LessonContent> = {
  'studio-histoire': {
    kind: 'story',
    pages: [
      { cosmo: 'hello', art: '🕹️', text: 'Bienvenue à la Station Studio ! Ici, on ne résout plus des missions… on FABRIQUE des jeux.' },
      { cosmo: 'think', art: '🎭', text: 'Un jeu, c’est d’abord une SCÈNE : un décor et des personnages que tu poses où tu veux.' },
      { cosmo: 'point', art: '⚡', text: 'Et puis des RÈGLES : « QUAND ceci arrive → FAIRE cela ». Quand la fusée touche une étoile → +1 point ! Les grands appellent ça des événements.' },
      { cosmo: 'cheer', art: '🎮', text: 'Scène + règles = jeu vidéo. Viens, on fabrique le tien !' },
    ],
  },

  'studio-1': {
    kind: 'studio',
    brief: 'Ton premier jeu ! Ajoute une fusée sur la scène, donne-lui une règle, et prends les commandes.',
    steps: [
      { text: 'Onglet Scène : ajoute une 🚀 fusée (touche le bouton 🚀)', check: 'sprite:fusee' },
      { text: 'Onglet Règles : « 🏁 quand le jeu démarre » + « 🕹️ les flèches dirigent la fusée » en dessous', check: 'fleches:fusee' },
      { text: 'Appuie sur ▶ JOUER et pilote ta fusée (flèches ou doigt) !', check: 'joue' },
    ],
  },

  'studio-2': {
    kind: 'studio',
    brief: 'Attrape les étoiles ! Elles vont tomber du ciel : à toi de les faire pleuvoir, de compter les points et de gagner à 5.',
    starter: { sprites: SCENE_ATTRAPE, xml: XML_FLECHES },
    steps: [
      { text: '« quand le jeu démarre » : ajoute « ⭐ l’étoile glisse vers le bas »', check: 'glisser:etoile' },
      { text: 'Nouvel événement : « 💥 quand la fusée touche l’étoile » → « 🏆 ajouter 1 au score »', check: 'collision-score' },
      { text: 'Dans le même événement : « ✨ téléporter l’étoile en haut, au hasard »', check: 'action:teleport' },
      { text: 'Toujours là : « ❓ si le score atteint 5 » → « 🎉 gagner »', check: 'si-score:5' },
      { text: 'Joue et GAGNE ta première partie !', check: 'gagne' },
    ],
  },

  'studio-3': {
    kind: 'studio',
    brief: 'Le danger arrive : des astéroïdes ! Fais-les tomber, et si la fusée en touche un… perdu. Un vrai jeu, avec du risque !',
    starter: { sprites: SCENE_ASTEROIDES, xml: XML_ATTRAPE },
    steps: [
      { text: '« quand le jeu démarre » : « 🪨 l’astéroïde glisse vers le bas » (vitesse 3 !)', check: 'glisser:asteroide' },
      { text: '« 💥 quand la fusée touche l’astéroïde » → « perdre la partie »', check: 'collision:fusee:asteroide' },
      { text: '« 🧱 quand l’astéroïde touche le bord du bas » → téléporter en haut (il revient !)', check: 'event:bord' },
      { text: 'Joue et gagne SANS te faire toucher !', check: 'gagne' },
    ],
  },

  'studio-4': {
    kind: 'studio',
    brief: 'Ton jeu, ton style ! Change le décor, fais parler tes personnages, accélère le rythme. C’est toi l’artiste.',
    starter: { sprites: SCENE_ASTEROIDES, xml: XML_ASTEROIDES },
    steps: [
      { text: 'Choisis un autre fond pour la scène (les petits carrés colorés)', check: 'fond-change' },
      { text: 'Fais parler un personnage : bloc « 💬 dit » (au démarrage, par exemple)', check: 'action:dire' },
      { text: 'Monte une vitesse à 4 ou 5… accroche-toi !', check: 'vitesse:4' },
      { text: 'Rejoue une partie pour admirer ton œuvre', check: 'joue' },
    ],
  },

  'studio-defi': {
    kind: 'studio',
    brief: 'Carte blanche ! Invente TON mini-jeu : tes personnages, tes règles, ta façon de gagner. Cosmo a hâte d’y jouer.',
    steps: [
      { text: 'Mets au moins 2 personnages différents sur la scène', check: 'sprites:2' },
      { text: 'Crée au moins une règle de collision « quand X touche Y »', check: 'event:collision' },
      { text: 'Utilise le score quelque part', check: 'action:score' },
      { text: 'Prévois une fin : gagner ou perdre', check: 'action:fin' },
      { text: 'Joue à TON jeu !', check: 'joue' },
    ],
  },
}
