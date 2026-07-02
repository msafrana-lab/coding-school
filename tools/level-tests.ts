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
}

let fails = 0

for (const [id, code] of Object.entries(solutions)) {
  const content = getContent(id) as PuzzleContent | undefined
  if (!content || content.kind !== 'grid') {
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
