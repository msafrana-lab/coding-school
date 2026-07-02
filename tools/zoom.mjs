import { chromium } from 'playwright'
import { installStub, baseState, findChrome } from './stub-lib.mjs'
const SCRATCH = '/tmp/claude-0/-home-user-coding-school/89587753-985d-5695-8276-3558c5e1c4c5/scratchpad'
const progress = [
  { lesson_id: 'lune-histoire', stars: 3, completed: true, attempts: 1 },
  { lesson_id: 'lune-1', stars: 3, completed: true, attempts: 1 },
  { lesson_id: 'lune-2', stars: 2, completed: true, attempts: 2 },
  { lesson_id: 'lune-3', stars: 3, completed: true, attempts: 1 },
]
const browser = await chromium.launch({ executablePath: findChrome() })
for (const [suffix, viewport] of [['desktop', {width:1440,height:900}], ['mobile', {width:390,height:844}]]) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 })
  await installStub(ctx, baseState({ progress: structuredClone(progress) }))
  const page = await ctx.newPage()
  await page.goto('http://localhost:5173/app', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500) // laisse le scroll auto se faire
  await page.screenshot({ path: `${SCRATCH}/carte-zoom-${suffix}.png` })
  await ctx.close()
}
await browser.close()
console.log('OK')
