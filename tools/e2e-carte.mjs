// Test de la carte : cliquer les missions COMME UN VRAI DOIGT.
import { chromium } from 'playwright'
import { installStub, baseState, findChrome } from './stub-lib.mjs'

const browser = await chromium.launch({ executablePath: findChrome() })
let failed = false

for (const [suffix, viewport] of [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844 }],
]) {
  // Cas 1 : tout nouveau compte — la PREMIÈRE mission (celle qui pulse) doit être cliquable
  const ctx = await browser.newContext({ viewport })
  await installStub(ctx, baseState({ progress: [] }))
  const page = await ctx.newPage()
  await page.goto('http://localhost:5173/app', { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  await page.getByRole('link', { name: 'Le langage des fusées' }).click({ timeout: 5000 })
  await page.waitForURL('**/lecon/lune-histoire', { timeout: 5000 })
  console.log(`[${suffix}] OK : la mission courante (halo animé) se clique`)

  // Cas 2 : une mission déjà terminée reste rejouable
  await page.goto('http://localhost:5173/app', { waitUntil: 'networkidle' })
  const ctx2 = await browser.newContext({ viewport })
  await installStub(ctx2, baseState({
    progress: [
      { lesson_id: 'lune-histoire', stars: 3, completed: true, attempts: 1 },
      { lesson_id: 'lune-1', stars: 3, completed: true, attempts: 1 },
    ],
  }))
  const page2 = await ctx2.newPage()
  await page2.goto('http://localhost:5173/app', { waitUntil: 'networkidle' })
  await page2.waitForTimeout(800)
  await page2.getByRole('link', { name: 'Premier décollage' }).click({ timeout: 5000 })
  await page2.waitForURL('**/lecon/lune-1', { timeout: 5000 })
  console.log(`[${suffix}] OK : une mission terminée se rejoue`)

  // Cas 3 : une mission verrouillée n'est PAS un lien
  const lockedLinks = await page2.goto('http://localhost:5173/app', { waitUntil: 'networkidle' }).then(async () => {
    await page2.waitForTimeout(600)
    return page2.getByRole('link', { name: 'Le grand slalom' }).count()
  })
  if (lockedLinks === 0) console.log(`[${suffix}] OK : les missions verrouillées ne sont pas cliquables`)
  else { console.log(`[${suffix}] ÉCHEC : mission verrouillée cliquable`); failed = true }

  await ctx.close()
  await ctx2.close()
}

await browser.close()
process.exit(failed ? 1 : 0)
