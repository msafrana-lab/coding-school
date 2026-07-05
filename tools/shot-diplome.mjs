import { chromium } from 'playwright'
import { installStub, baseState, findChrome } from './stub-lib.mjs'
const SCRATCH = '/tmp/claude-0/-home-user-coding-school/89587753-985d-5695-8276-3558c5e1c4c5/scratchpad'
const browser = await chromium.launch({ executablePath: findChrome() })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
await installStub(ctx, baseState())
const page = await ctx.newPage()
await page.goto('http://localhost:5173/app/lecon/final-diplome', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await page.getByRole('button', { name: /Recevoir mon diplôme/ }).click()
await page.waitForTimeout(1500)
await page.screenshot({ path: `${SCRATCH}/diplome-mobile.png`, fullPage: true })
console.log('OK')
await browser.close()
