// Test complet d'une mission : ouvrir, voir les blocs, jouer la solution, gagner.
import { chromium } from 'playwright'
import { installStub, baseState, findChrome } from './stub-lib.mjs'

const SCRATCH = '/tmp/claude-0/-home-user-coding-school/89587753-985d-5695-8276-3558c5e1c4c5/scratchpad'

const SOLUTION_LUNE1 =
  '<xml xmlns="https://developers.google.com/blockly/xml">' +
  '<block type="quand_demarre" deletable="false" x="16" y="16"><next>' +
  '<block type="avancer"><next><block type="avancer"><next><block type="avancer">' +
  '</block></next></block></next></block></next></block></xml>'

const browser = await chromium.launch({ executablePath: findChrome() })
const errors = []
let failed = false

for (const [suffix, viewport] of [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844 }],
]) {
  const state = baseState()
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 })
  await installStub(ctx, state)
  const page = await ctx.newPage()
  page.on('pageerror', (e) => errors.push(`[${suffix}] PAGEERROR: ${e.message}`))
  page.on('console', (m) => m.type() === 'error' && errors.push(`[${suffix}] CONSOLE: ${m.text()}`))

  await page.goto('http://localhost:5173/app/lecon/lune-1', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `${SCRATCH}/puzzle-1-editeur-${suffix}.png` })

  // Vérifie que l'atelier Blockly est là
  const hasBlockly = await page.locator('.blocklySvg').count()
  if (!hasBlockly) {
    console.log(`[${suffix}] ÉCHEC : atelier Blockly absent`)
    failed = true
  }

  // Charge la solution puis teste
  await page.evaluate((xml) => window.__astroLoadXml(xml), SOLUTION_LUNE1)
  await page.waitForTimeout(300)
  await page.getByRole('button', { name: '▶ TESTER' }).click()
  await page.waitForSelector('text=Mission réussie', { timeout: 15000 })
  await page.waitForTimeout(1000)
  await page.screenshot({ path: `${SCRATCH}/puzzle-2-victoire-${suffix}.png` })

  // La progression a-t-elle été enregistrée (sur le faux serveur) ?
  const saved = state.progress.find((p) => p.lesson_id === 'lune-1')
  if (saved?.completed && saved?.stars === 3) {
    console.log(`[${suffix}] OK : victoire + 3 étoiles enregistrées`)
  } else {
    console.log(`[${suffix}] ÉCHEC : progression non enregistrée`, JSON.stringify(saved))
    failed = true
  }

  // Teste aussi un échec pédagogique : 1 seul avancer → message d'aide
  await page.getByRole('button', { name: 'Rejouer' }).click()
  await page.evaluate(() =>
    window.__astroLoadXml(
      '<xml xmlns="https://developers.google.com/blockly/xml"><block type="quand_demarre" deletable="false"><next><block type="avancer"></block></next></block></xml>',
    ),
  )
  await page.getByRole('button', { name: '▶ TESTER' }).click()
  await page.waitForSelector('text=Presque', { timeout: 15000 })
  await page.screenshot({ path: `${SCRATCH}/puzzle-3-echec-${suffix}.png` })
  console.log(`[${suffix}] OK : message d'échec pédagogique affiché`)

  await ctx.close()
}

if (errors.length) console.log('ERREURS:\n' + errors.slice(0, 10).join('\n'))
await browser.close()
process.exit(failed ? 1 : 0)
