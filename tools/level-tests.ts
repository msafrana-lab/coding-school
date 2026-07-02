/** Banc d'essai : chaque niveau doit être gagnable avec sa solution de référence. */
import { SimWorld } from '../src/game/world'
import { getContent } from '../src/curriculum/content'
import type { PuzzleContent } from '../src/curriculum/types'

const A = 'avancer();'
const TG = 'tournerGauche();'
const TD = 'tournerDroite();'

const solutions: Record<string, string> = {
  'lune-1': A + A + A,
  'lune-2': A + A + TD + A + A,
  'lune-3': A + TG + A + TD + A + A,
  'lune-repare': A + A + TG + A,
  'lune-4': A + A + A,
  'lune-defi': A + A + TD + A + A + A + TD + A + A + TG + A + A,
  'boucla-1': `for(let i=0;i<6;i++){${A}}`,
  'boucla-2': `for(let i=0;i<3;i++){${A}${TG}${A}${TD}}`,
  'boucla-3': `for(let i=0;i<4;i++){${A}${A}${A}${TD}}`,
  'boucla-repare': `for(let i=0;i<8;i++){${A}}`,
  'boucla-4': `while(!surArrivee()){${A}${TG}${A}${TD}}`,
  'boucla-defi': `for(let i=0;i<4;i++){for(let j=0;j<4;j++){${A}}${TD}}`,
  'choizix-1': `while(cheminDevant()){${A}}${TD}${A}${A}`,
  'choizix-2': `while(!surArrivee()){if(cheminDevant()){${A}}else{${TD}}}`,
  'choizix-3': `while(!surArrivee()){if(cheminDevant()){${A}}else{${TG}}}`,
  'choizix-repare': `while(!surArrivee()){if(cheminDevant()){${A}}else{${TD}}}`,
  'choizix-4': `while(!surArrivee()){if(cheminADroite()){${TD}${A}}else{if(cheminDevant()){${A}}else{${TG}}}}`,
  'choizix-defi': `while(!surArrivee()){if(cheminADroite()){${TD}${A}}else{if(cheminDevant()){${A}}else{${TG}}}}`,
  'memora-1': `for(let i=0;i<3;i++){${A}} for(let j=0;j<cristaux();j++){${A}}`,
  'memora-2': `let b=2; for(let i=0;i<b;i++){${A}} ${TD} b=b+1; for(let i=0;i<b;i++){${A}}`,
  'memora-3': `let b=4; for(let i=0;i<b;i++){${A}} ${TG} for(let i=0;i<b;i++){${A}}`,
  'memora-repare': `let b=5; for(let i=0;i<b;i++){${A}}`,
  'memora-defi': `for(let i=0;i<4;i++){${A}} ${TD} for(let j=0;j<cristaux();j++){${A}}`,
  'fabrika-1': `function m(){${A}${TG}${A}${TD}} m();m();m();`,
  'fabrika-2': `function m(){${A}${TG}${A}${TD}} for(let i=0;i<5;i++){m()}`,
  'fabrika-3': `function s(){${A}${A}${TD}} function l(){${A}${A}${TG}} s();l();s();l();`,
  'fabrika-repare': `function m(){${A}${A}${TD}} for(let i=0;i<4;i++){m()}`,
  'fabrika-defi': `function m(){${A}${TG}${A}${TD}} for(let i=0;i<5;i++){m()}`,
  'nebula-1': `avancer();avancer();avancer();avancer();`,
  'nebula-2': `for (let i = 0; i < 8; i++) { avancer(); }`,
  'nebula-3': `while (!surArrivee()) { if (cheminDevant()) { avancer(); } else { tournerADroite(); } }`,
  'nebula-repare': `avancer();avancer();tournerADroite();avancer();avancer();`,
  'nebula-4': `let pas = 2; for (let i = 0; i < pas; i++) { avancer(); } tournerAGauche(); pas = pas + 2; for (let i = 0; i < pas; i++) { avancer(); }`,
  'nebula-defi': `while (!surArrivee()) { if (cheminADroite()) { tournerADroite(); avancer(); } else if (cheminDevant()) { avancer(); } else { tournerAGauche(); } }`,
}

/** Programmes cassés fournis aux missions « répare » : ils doivent échouer. */
const brokenPrograms: Record<string, { code: string; expect: string }> = {
  'lune-repare': { code: A + A + TD + A, expect: 'crash' },
  'boucla-repare': { code: `for(let i=0;i<5;i++){${A}}`, expect: 'incomplete' },
  'choizix-repare': {
    code: `let LOOP=0; while(!surArrivee()){ if(++LOOP>500) throw new RangeError('x'); if(cheminDevant()){${TD}}else{${A}}}`,
    expect: 'crash|error',
  },
  'memora-repare': { code: `let b=0; for(let i=0;i<b;i++){${A}}`, expect: 'incomplete' },
  'fabrika-repare': { code: `function m(){${A}${TD}${A}} for(let i=0;i<4;i++){m()}`, expect: 'crash' },
  'nebula-repare': { code: `avancer();avancr();tournerADroite();avancer();avancer();`, expect: 'error' },
}

/**
 * Audit de cohérence : les blocs NÉCESSAIRES à la solution de référence
 * doivent tous être proposés dans la palette de la mission.
 */
const requiredBlocks: Record<string, string[]> = {
  'lune-1': ['avancer'],
  'lune-2': ['avancer', 'tourner_droite'],
  'lune-3': ['avancer', 'tourner_gauche', 'tourner_droite'],
  'lune-repare': ['avancer', 'tourner_gauche'],
  'lune-4': ['avancer'],
  'lune-defi': ['avancer', 'tourner_gauche', 'tourner_droite'],
  'boucla-1': ['avancer', 'repeter'],
  'boucla-2': ['avancer', 'tourner_gauche', 'tourner_droite', 'repeter'],
  'boucla-3': ['avancer', 'tourner_droite', 'repeter'],
  'boucla-repare': ['avancer', 'repeter'],
  'boucla-4': ['avancer', 'tourner_gauche', 'tourner_droite', 'repeter_jusqua'],
  'boucla-defi': ['avancer', 'tourner_droite', 'repeter'],
  'choizix-1': ['avancer', 'tourner_droite', 'tant_que'],
  'choizix-2': ['avancer', 'tourner_droite', 'repeter_jusqua', 'si_sinon'],
  'choizix-3': ['avancer', 'tourner_gauche', 'repeter_jusqua', 'si_sinon'],
  'choizix-repare': ['avancer', 'tourner_droite', 'repeter_jusqua', 'si_sinon'],
  'choizix-4': ['avancer', 'tourner_gauche', 'tourner_droite', 'repeter_jusqua', 'si', 'si_sinon'],
  'choizix-defi': ['avancer', 'tourner_gauche', 'tourner_droite', 'repeter_jusqua', 'si', 'si_sinon'],
  'memora-1': ['avancer', 'repeter', 'repeter_valeur', 'cristaux_ramasses'],
  'memora-2': ['avancer', 'tourner_droite', 'var_mettre', 'var_ajouter', 'repeter_valeur'],
  'memora-3': ['avancer', 'tourner_gauche', 'var_mettre', 'repeter_valeur'],
  'memora-repare': ['avancer', 'var_mettre', 'repeter_valeur'],
  'memora-defi': ['avancer', 'tourner_droite', 'repeter', 'repeter_valeur', 'cristaux_ramasses'],
  'fabrika-1': ['motif_def_a', 'motif_a', 'avancer', 'tourner_gauche', 'tourner_droite'],
  'fabrika-2': ['motif_def_a', 'motif_a', 'avancer', 'tourner_gauche', 'tourner_droite', 'repeter'],
  'fabrika-3': ['motif_def_a', 'motif_def_b', 'motif_a', 'motif_b', 'avancer', 'tourner_gauche', 'tourner_droite', 'repeter'],
  'fabrika-repare': ['motif_def_a', 'motif_a', 'avancer', 'tourner_droite', 'repeter'],
  'fabrika-defi': ['motif_def_a', 'motif_a', 'avancer', 'tourner_gauche', 'tourner_droite', 'repeter'],
}

/** Nombre minimal d'exemplaires nécessaires quand une mission limite un bloc. */
const requiredCounts: Record<string, Record<string, number>> = {
  'boucla-1': { avancer: 1 },
  'memora-2': { avancer: 2 },
}

let fails = 0

for (const [id, needed] of Object.entries(requiredBlocks)) {
  const content = getContent(id) as PuzzleContent | undefined
  if (!content || content.kind !== 'grid') {
    console.log(`✗ ${id} : contenu introuvable pour l'audit de palette`)
    fails++
    continue
  }
  const missing = needed.filter((b) => !content.blocks.includes(b))
  if (missing.length) {
    console.log(`✗ ${id} : blocs NÉCESSAIRES absents de la palette → ${missing.join(', ')}`)
    fails++
  }
  // Les blocs du programme de départ doivent aussi être disponibles (sinon,
  // un enfant qui supprime un bloc ne peut plus le remettre).
  if (content.starterXml) {
    const types = [...content.starterXml.matchAll(/<block type="([a-z_]+)"/g)].map((m) => m[1])
    const orphan = types.filter((t) => t !== 'quand_demarre' && !content.blocks.includes(t))
    if (orphan.length) {
      console.log(`✗ ${id} : blocs du programme de départ hors palette → ${orphan.join(', ')}`)
      fails++
    }
  }
  // Les limites d'exemplaires ne doivent pas rendre la solution impossible.
  const counts = requiredCounts[id]
  if (content.maxInstances) {
    for (const [blockId, max] of Object.entries(content.maxInstances)) {
      const neededCount = counts?.[blockId] ?? (needed.includes(blockId) ? 1 : 0)
      if (neededCount > max) {
        console.log(`✗ ${id} : limite ${blockId}=${max} mais la solution en demande ${neededCount}`)
        fails++
      }
    }
  }
}
console.log('Audit de palette : terminé pour', Object.keys(requiredBlocks).length, 'missions\n')

for (const [id, code] of Object.entries(solutions)) {
  const content = getContent(id) as PuzzleContent | undefined
  if (!content || (content.kind !== 'grid' && (content.kind as string) !== 'code')) {
    console.log(`✗ ${id} : contenu introuvable`)
    fails++
    continue
  }
  const sim = new SimWorld(content)
  const result = sim.run(code)
  if (result.outcome === 'win') {
    console.log(`✓ ${id} gagnable (par ${content.par})`)
  } else {
    console.log(`✗ ${id} ÉCHEC : ${JSON.stringify(result.outcome)} ${'reason' in result ? result.reason : ''}`)
    fails++
  }
}

for (const [id, t] of Object.entries(brokenPrograms)) {
  const content = getContent(id) as PuzzleContent
  const sim = new SimWorld(content)
  const result = sim.run(t.code)
  if (t.expect.split('|').includes(result.outcome)) {
    console.log(`✓ ${id} : le programme cassé échoue bien (${result.outcome})`)
  } else {
    console.log(`✗ ${id} : le programme cassé donne ${result.outcome} au lieu de ${t.expect}`)
    fails++
  }
}

if (fails) {
  console.log(`\n${fails} test(s) en échec`)
  process.exit(1)
}
console.log('\nTous les niveaux sont valides ✅')
