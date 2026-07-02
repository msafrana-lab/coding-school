# 🚀 AstroCode

L'aventure spatiale pour apprendre à coder — pour les 8-12 ans, en français.

Des blocs visuels au vrai JavaScript : 8 planètes, ~56 missions, un Studio de création
de jeux, une mascotte (Cosmo), des étoiles, un diplôme à imprimer.

- **Site** : https://astrocode-galaxie.netlify.app
- **Guide du parent** : voir [GUIDE-PARENTS.md](GUIDE-PARENTS.md)

## Technique (en bref)

- React + Vite + TypeScript + Tailwind — interface
- Blockly (locale française, rendu « zelos ») — blocs, et CodeMirror 6 — vrai code
- Supabase — comptes (Google + email), progression, créations ; **RLS activée** partout
- Netlify — hébergement (`netlify.toml`, SPA)

```bash
npm install
npm run dev        # développement
npm run build      # production (dist/)
```

Les scripts `tools/e2e-*.mjs` vérifient les parcours complets (connexion, missions,
Studio, vrai code, coin parents) avec un simulateur de Supabase, sur écran ordinateur
et téléphone. `tools/level-tests.ts` prouve que chaque niveau est gagnable avec son
score 3 étoiles.
