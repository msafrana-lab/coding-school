// Capture une page de l'app avec une session simulée.
// Usage: node tools/shot-app.mjs <chemin> <nom> [progressPreset]
import { chromium } from 'playwright'
import { installStub, baseState, findChrome } from './stub-lib.mjs'

const SCRATCH = '/tmp/claude-0/-home-user-coding-school/89587753-985d-5695-8276-3558c5e1c4c5/scratchpad'
const [, , path = '/app', name = 'app', preset = 'quelques'] = process.argv

const presets = {
  vide: [],
  quelques: [
    { lesson_id: 'lune-histoire', stars: 3, completed: true, attempts: 1 },
    { lesson_id: 'lune-1', stars: 3, completed: true, attempts: 1 },
    { lesson_id: 'lune-2', stars: 2, completed: true, attempts: 2 },
    { lesson_id: 'lune-3', stars: 3, completed: true, attempts: 1 },
  ],
  monde2: [
    ...['lune-histoire', 'lune-1', 'lune-2', 'lune-3', 'lune-repare', 'lune-4', 'lune-quiz', 'lune-defi'].map(
      (id) => ({ lesson_id: id, stars: 3, completed: true, attempts: 1 }),
    ),
    { lesson_id: 'boucla-histoire', stars: 3, completed: true, attempts: 1 },
  ],
}

const browser = await chromium.launch({ executablePath: findChrome() })
const errors = []

for (const [suffix, viewport] of [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844 }],
]) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 })
  await installStub(ctx, baseState({ progress: structuredClone(presets[preset] ?? []) }))
  const page = await ctx.newPage()
  page.on('pageerror', (e) => errors.push(`[${suffix}] PAGEERROR: ${e.message}`))
  page.on('console', (m) => m.type() === 'error' && errors.push(`[${suffix}] CONSOLE: ${m.text()}`))
  await page.goto(`http://localhost:5173${path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  await page.screenshot({ path: `${SCRATCH}/${name}-${suffix}.png`, fullPage: true })
  await ctx.close()
}

console.log(errors.length ? 'ERREURS:\n' + errors.join('\n') : 'OK, aucune erreur console')
await browser.close()
