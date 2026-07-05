import { chromium } from 'playwright'
import { installStub, baseState, findChrome } from './stub-lib.mjs'
const SCRATCH = '/tmp/claude-0/-home-user-coding-school/89587753-985d-5695-8276-3558c5e1c4c5/scratchpad'
const browser = await chromium.launch({ executablePath: findChrome() })
for (const [name, path] of [['narrow-lune2', '/app/lecon/lune-2'], ['narrow-choizix2', '/app/lecon/choizix-2'], ['narrow-parents', '/app/parents']]) {
  const ctx = await browser.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 2 })
  await installStub(ctx, baseState())
  const page = await ctx.newPage()
  await page.goto(`http://localhost:5173${path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1600)
  await page.screenshot({ path: `${SCRATCH}/${name}.png` })
  await ctx.close()
}
console.log('OK')
await browser.close()
