import { chromium } from 'playwright'
import { installStub, baseState, findChrome } from './stub-lib.mjs'
const browser = await chromium.launch({ executablePath: findChrome() })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
await installStub(ctx, baseState())
const page = await ctx.newPage()
await page.goto('http://localhost:5173/app/parents', { waitUntil: 'networkidle' })
await page.getByRole('button', { name: /Changer d’astronaute/ }).click()
await page.waitForURL('**/connexion', { timeout: 8000 })
console.log('OK : déconnexion → retour à l’écran de connexion')
await browser.close()
