import { chromium } from 'playwright'
import { installStub, baseState, findChrome } from './stub-lib.mjs'
const browser = await chromium.launch({ executablePath: findChrome() })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
await installStub(ctx, baseState())
const page = await ctx.newPage()
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message))
page.on('console', (m) => console.log('CONSOLE', m.type() + ':', m.text().slice(0, 300)))
await page.goto('http://localhost:5173/app/lecon/lune-1', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
const SOLUTION = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="quand_demarre" deletable="false" x="16" y="16"><next><block type="avancer"><next><block type="avancer"><next><block type="avancer"></block></next></block></next></block></next></block></xml>'
await page.evaluate((xml) => window.__astroLoadXml(xml), SOLUTION)
await page.waitForTimeout(300)
await page.click('text=TESTER')
await page.waitForTimeout(5000)
const body = await page.evaluate(() => document.body.innerText.slice(0, 600))
console.log('---BODY---\n' + body)
await browser.close()
