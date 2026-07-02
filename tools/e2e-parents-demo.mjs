// Test du coin parents (porte + stats) et de la mission d'essai publique.
import { chromium } from 'playwright'
import { installStub, baseState, findChrome } from './stub-lib.mjs'

const SCRATCH = '/tmp/claude-0/-home-user-coding-school/89587753-985d-5695-8276-3558c5e1c4c5/scratchpad'

const browser = await chromium.launch({ executablePath: findChrome() })
const errors = []

const progressPreset = [
  { lesson_id: 'lune-histoire', stars: 3, completed: true, attempts: 1 },
  { lesson_id: 'lune-1', stars: 3, completed: true, attempts: 1 },
  { lesson_id: 'lune-2', stars: 2, completed: true, attempts: 2 },
]
const activityPreset = [
  { day: '2026-07-02', minutes: 25, lessons_done: 2 },
  { day: '2026-07-01', minutes: 40, lessons_done: 3 },
]

const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
await installStub(ctx, baseState({ progress: progressPreset, activity: activityPreset }))
const page = await ctx.newPage()
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

// 1) Porte des parents : mauvaise réponse refusée, bonne réponse acceptée
await page.goto('http://localhost:5173/app/parents', { waitUntil: 'networkidle' })
await page.waitForSelector('text=×')
const question = await page.locator('p.font-display.text-3xl').innerText()
const [a, b] = question.replace('= ?', '').split('×').map((s) => parseInt(s.trim()))
await page.fill('input[type=number]', '11')
await page.getByRole('button', { name: 'Entrer' }).click()
await page.waitForSelector('text=pas tout à fait', { timeout: 5000 })
console.log('OK : mauvaise réponse refusée')
await page.fill('input[type=number]', String(a * b))
await page.getByRole('button', { name: 'Entrer' }).click()
await page.waitForSelector('text=Progression du voyage', { timeout: 8000 })
await page.waitForTimeout(800)
await page.screenshot({ path: `${SCRATCH}/parents-mobile.png`, fullPage: true })
console.log('OK : tableau de bord parents affiché')

// 2) Mission d'essai publique (sans compte)
const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
const page2 = await ctx2.newPage()
page2.on('pageerror', (e) => errors.push('DEMO PAGEERROR: ' + e.message))
await page2.goto('http://localhost:5173/demo', { waitUntil: 'networkidle' })
await page2.waitForTimeout(1500)
const hasBlockly = await page2.locator('.blocklySvg').count()
console.log(hasBlockly ? 'OK : mission d’essai jouable sans compte' : 'ÉCHEC : démo sans atelier')
await page2.evaluate(() => {
  window.__astroLoadXml(
    '<xml xmlns="https://developers.google.com/blockly/xml"><block type="quand_demarre" deletable="false"><next><block type="avancer"><next><block type="avancer"><next><block type="avancer"></block></next></block></next></block></next></block></xml>',
  )
})
await page2.getByRole('button', { name: 'TESTER' }).click()
await page2.waitForSelector('text=Créer mon compte pour continuer', { timeout: 15000 })
console.log('OK : la démo invite à créer un compte après la victoire')
await page2.screenshot({ path: `${SCRATCH}/demo-victoire-mobile.png` })

if (errors.length) console.log('ERREURS:\n' + errors.join('\n'))
await browser.close()
