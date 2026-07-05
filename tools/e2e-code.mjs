// Test des missions en vrai code : compléter, réussir, et lire une erreur en français.
import { chromium } from 'playwright'
import { installStub, baseState, findChrome } from './stub-lib.mjs'

const SCRATCH = '/tmp/claude-0/-home-user-coding-school/89587753-985d-5695-8276-3558c5e1c4c5/scratchpad'

const browser = await chromium.launch({ executablePath: findChrome() })
const errors = []

for (const [suffix, viewport] of [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844 }],
]) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 })
  await installStub(ctx, baseState())
  const page = await ctx.newPage()
  page.on('pageerror', (e) => errors.push(`[${suffix}] PAGEERROR: ${e.message}`))

  // 1) nebula-1 : ajouter 2 avancer via l'aide-mémoire, tester, gagner
  await page.goto('http://localhost:5173/app/lecon/nebula-1', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  await page.screenshot({ path: `${SCRATCH}/code-1-editeur-${suffix}.png` })
  await page.getByRole('button', { name: 'avancer();' }).click()
  await page.getByRole('button', { name: 'avancer();' }).click()
  await page.getByRole('button', { name: '▶ TESTER' }).click()
  await page.waitForSelector('text=Du vrai code réussi', { timeout: 15000 })
  console.log(`[${suffix}] OK : mission code réussie via l'aide-mémoire`)
  await page.screenshot({ path: `${SCRATCH}/code-2-victoire-${suffix}.png` })

  // 2) nebula-repare : le bug de frappe produit un message en français
  await page.goto('http://localhost:5173/app/lecon/nebula-repare', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  await page.getByRole('button', { name: '▶ TESTER' }).click()
  await page.waitForSelector('text=avancr', { timeout: 15000 })
  console.log(`[${suffix}] OK : erreur de frappe expliquée en français`)
  await page.screenshot({ path: `${SCRATCH}/code-3-erreur-${suffix}.png` })

  await ctx.close()
}

if (errors.length) console.log('ERREURS:\n' + errors.slice(0, 8).join('\n'))
await browser.close()
