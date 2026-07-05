// Test « toucher pour ajouter » : 3 taps sur la palette = programme complet, victoire.
import { chromium } from 'playwright'
import { installStub, baseState, findChrome } from './stub-lib.mjs'
const SCRATCH = '/tmp/claude-0/-home-user-coding-school/89587753-985d-5695-8276-3558c5e1c4c5/scratchpad'
const browser = await chromium.launch({ executablePath: findChrome() })
const state = baseState({ progress: [] })
const ctx = await browser.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 2, hasTouch: true })
await installStub(ctx, state)
const page = await ctx.newPage()
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message))
await page.goto('http://localhost:5173/app/lecon/lune-1', { waitUntil: 'networkidle' })
await page.waitForTimeout(1400)
await page.screenshot({ path: `${SCRATCH}/mobile-nouveau-layout.png` })
// 3 taps sur le bloc « avancer » de la palette
for (let i = 0; i < 3; i++) {
  await page.locator('.blocklyFlyout').getByText('avancer', { exact: false }).first().click()
  await page.waitForTimeout(350)
}
await page.screenshot({ path: `${SCRATCH}/mobile-apres-taps.png` })
await page.getByRole('button', { name: '▶ TESTER' }).click()
await page.waitForSelector('text=Mission réussie', { timeout: 15000 })
const stars = state.progress.find((p) => p.lesson_id === 'lune-1')?.stars
console.log(stars === 3 ? 'OK : 3 taps → programme construit → victoire 3 étoiles' : `ÉCHEC : ${stars} étoiles`)
await page.screenshot({ path: `${SCRATCH}/mobile-victoire-tap.png` })
await browser.close()
process.exit(stars === 3 ? 0 : 1)
