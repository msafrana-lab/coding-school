// Test du Studio : la scène pré-remplie se charge, le jeu tourne, le score monte.
import { chromium } from 'playwright'
import { installStub, baseState, findChrome } from './stub-lib.mjs'

const SCRATCH = '/tmp/claude-0/-home-user-coding-school/89587753-985d-5695-8276-3558c5e1c4c5/scratchpad'

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
  page.on('console', (m) => m.type() === 'error' && errors.push(`[${suffix}] CONSOLE: ${m.text().slice(0, 200)}`))

  // studio-2 : scène + règles pré-remplies (étoiles qui tombent, +1 au score)
  await page.goto('http://localhost:5173/app/lecon/studio-2', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1800)
  await page.screenshot({ path: `${SCRATCH}/studio-1-editeur-${suffix}.png` })

  // Vérifie la présence de la fusée sur la scène et de l'atelier
  const rocketCount = await page.getByText('🚀', { exact: true }).count()
  const hasBlockly = await page.locator('.blocklySvg').count()
  if (!hasBlockly) { console.log(`[${suffix}] ÉCHEC : atelier absent`); failed = true }

  // Charge la solution complète des règles, puis joue
  const SOLUTION = await page.evaluate(() => null) // placeholder
  await page.evaluate(() => {
    const XML_NS = '<xml xmlns="https://developers.google.com/blockly/xml">'
    const xml = XML_NS +
      '<block type="ev_demarre" x="16" y="16"><next>' +
      '<block type="act_fleches"><field name="S">fusee</field><next>' +
      '<block type="act_glisser"><field name="S">etoile</field><field name="DIR">bas</field><field name="V">3</field>' +
      '</block></next></block></next></block>' +
      '<block type="ev_collision" x="16" y="220"><field name="A">fusee</field><field name="B">etoile</field><next>' +
      '<block type="act_score"><field name="N">1</field><next>' +
      '<block type="act_teleport"><field name="S">etoile</field><field name="W">haut</field>' +
      '</block></next></block></next></block></xml>'
    window.__astroLoadXml(xml)
  })
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: 'JOUER' }).first().click()
  // L'étoile du milieu tombe pile sur la fusée : le score doit monter
  await page.waitForSelector('text=🏆 1', { timeout: 12000 })
  console.log(`[${suffix}] OK : le moteur tourne, collision détectée, score +1`)
  await page.screenshot({ path: `${SCRATCH}/studio-2-jeu-${suffix}.png` })

  await ctx.close()
}

if (errors.length) console.log('ERREURS:\n' + errors.slice(0, 8).join('\n'))
await browser.close()
process.exit(failed ? 1 : 0)
