// Test des étoiles : les brouillons ne pénalisent pas, et rejouer améliore le score.
import { chromium } from 'playwright'
import { installStub, baseState, findChrome } from './stub-lib.mjs'

const XML_NS = '<xml xmlns="https://developers.google.com/blockly/xml">'

// Solution parfaite (3 blocs) + 2 blocs brouillon DÉTACHÉS qui traînent
const SOLUTION_AVEC_BROUILLON =
  XML_NS +
  '<block type="quand_demarre" deletable="false" x="16" y="16"><next>' +
  '<block type="avancer"><next><block type="avancer"><next><block type="avancer">' +
  '</block></next></block></next></block></next></block>' +
  '<block type="avancer" x="300" y="300"></block>' +
  '<block type="tourner_gauche" x="300" y="360"></block></xml>'

// Programme gagnant mais trop long (4 blocs → 2 étoiles sur un par de 3)
const SOLUTION_TROP_LONGUE =
  XML_NS +
  '<block type="quand_demarre" deletable="false" x="16" y="16"><next>' +
  '<block type="tourner_gauche"><next><block type="tourner_droite"><next>' +
  '<block type="avancer"><next><block type="avancer"><next><block type="avancer">' +
  '</block></next></block></next></block></next></block></next></block></next></block></xml>'

const SOLUTION_PARFAITE =
  XML_NS +
  '<block type="quand_demarre" deletable="false" x="16" y="16"><next>' +
  '<block type="avancer"><next><block type="avancer"><next><block type="avancer">' +
  '</block></next></block></next></block></next></block></xml>'

const browser = await chromium.launch({ executablePath: findChrome() })
let failed = false
const state = baseState({ progress: [] })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
await installStub(ctx, state)
const page = await ctx.newPage()

async function joue(xml) {
  await page.evaluate((x) => window.__astroLoadXml(x), xml)
  await page.getByRole('button', { name: '▶ TESTER' }).click()
  await page.waitForSelector('text=Mission réussie', { timeout: 15000 })
  return state.progress.find((p) => p.lesson_id === 'lune-1')?.stars
}

// 1) D'abord une victoire imparfaite (2 étoiles)
await page.goto('http://localhost:5173/app/lecon/lune-1', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
let stars = await joue(SOLUTION_TROP_LONGUE)
if (stars === 2) console.log('OK : victoire imparfaite → 2 étoiles enregistrées')
else { console.log(`ÉCHEC : attendu 2 étoiles, obtenu ${stars}`); failed = true }

// 2) On rejoue parfaitement → doit passer à 3 étoiles
await page.getByRole('button', { name: 'Rejouer' }).click()
await page.waitForTimeout(400)
stars = await joue(SOLUTION_PARFAITE)
if (stars === 3) console.log('OK : rejouée parfaitement → 3 étoiles (le score progresse)')
else { console.log(`ÉCHEC : attendu 3 étoiles après rejeu, obtenu ${stars}`); failed = true }

// 3) Les brouillons détachés ne pénalisent pas
const state2 = baseState({ progress: [] })
const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } })
await installStub(ctx2, state2)
const page2 = await ctx2.newPage()
await page2.goto('http://localhost:5173/app/lecon/lune-1', { waitUntil: 'networkidle' })
await page2.waitForTimeout(1200)
await page2.evaluate((x) => window.__astroLoadXml(x), SOLUTION_AVEC_BROUILLON)
await page2.getByRole('button', { name: '▶ TESTER' }).click()
await page2.waitForSelector('text=Mission réussie', { timeout: 15000 })
const s2 = state2.progress.find((p) => p.lesson_id === 'lune-1')?.stars
if (s2 === 3) console.log('OK : les blocs brouillon détachés ne comptent pas → 3 étoiles')
else { console.log(`ÉCHEC : brouillons pénalisants, obtenu ${s2} étoiles`); failed = true }

await browser.close()
process.exit(failed ? 1 : 0)
