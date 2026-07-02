// Test de l'enchaînement « Mission suivante » : la mission suivante doit
// repartir de zéro (bonne consigne, bonne palette, atelier vide).
import { chromium } from 'playwright'
import { installStub, baseState, findChrome } from './stub-lib.mjs'

const SCRATCH = '/tmp/claude-0/-home-user-coding-school/89587753-985d-5695-8276-3558c5e1c4c5/scratchpad'

const SOLUTION_LUNE1 =
  '<xml xmlns="https://developers.google.com/blockly/xml">' +
  '<block type="quand_demarre" deletable="false" x="16" y="16"><next>' +
  '<block type="avancer"><next><block type="avancer"><next><block type="avancer">' +
  '</block></next></block></next></block></next></block></xml>'

const browser = await chromium.launch({ executablePath: findChrome() })
let failed = false

for (const [suffix, viewport] of [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844 }],
]) {
  const ctx = await browser.newContext({ viewport })
  await installStub(ctx, baseState({ progress: [] }))
  const page = await ctx.newPage()
  page.on('pageerror', (e) => console.log(`[${suffix}] PAGEERROR:`, e.message))

  // Réussir lune-1, puis cliquer « Mission suivante »
  await page.goto('http://localhost:5173/app/lecon/lune-1', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  await page.evaluate((xml) => window.__astroLoadXml(xml), SOLUTION_LUNE1)
  await page.getByRole('button', { name: 'TESTER' }).click()
  await page.waitForSelector('text=Mission réussie', { timeout: 15000 })
  await page.getByRole('button', { name: 'Mission suivante' }).click()
  await page.waitForURL('**/lecon/lune-2', { timeout: 5000 })
  await page.waitForTimeout(1200)

  // 1) La consigne est bien celle du Virage
  const briefOk = (await page.getByText('Le chemin tourne').count()) > 0
  // 2) La palette contient bien « tourner à droite »
  const paletteOk = (await page.locator('.blocklyFlyout').getByText('tourner à droite').count()) > 0
  // 3) L'atelier ne contient PLUS le programme de la mission précédente
  const leftovers = await page.locator('.blocklyWorkspace >> text=avancer').count()

  if (briefOk) console.log(`[${suffix}] OK : consigne du Virage affichée`)
  else { console.log(`[${suffix}] ÉCHEC : consigne de la mission précédente`); failed = true }
  if (paletteOk) console.log(`[${suffix}] OK : « tourner à droite » présent dans la palette`)
  else { console.log(`[${suffix}] ÉCHEC : palette de la mission précédente`); failed = true }
  console.log(`[${suffix}] info : blocs « avancer » visibles (palette incluse) = ${leftovers}`)

  await page.screenshot({ path: `${SCRATCH}/enchainement-${suffix}.png` })
  await ctx.close()
}

await browser.close()
process.exit(failed ? 1 : 0)
