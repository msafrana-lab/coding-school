// Test de bout en bout du parcours connexion → onboarding → carte,
// avec un faux serveur Supabase (le vrai est bloqué par le réseau du bac à sable).
import { chromium } from 'playwright'
import fs from 'fs'

const SCRATCH = '/tmp/claude-0/-home-user-coding-school/89587753-985d-5695-8276-3558c5e1c4c5/scratchpad'
const UID = '81433cbf-14fe-4b69-b778-4c8e9a7d987a'

function findChrome() {
  const base = '/opt/pw-browsers'
  for (const dir of fs.readdirSync(base)) {
    if (dir.startsWith('chromium-')) {
      const p = `${base}/${dir}/chrome-linux/chrome`
      if (fs.existsSync(p)) return p
    }
  }
  return `${base}/chromium`
}

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
const jwt = `${b64({ alg: 'none', typ: 'JWT' })}.${b64({
  sub: UID,
  role: 'authenticated',
  email: 'test.famille@astrocode.test',
  exp: Math.floor(Date.now() / 1000) + 3600,
})}.sig`

// État simulé côté "serveur"
const state = {
  profile: {
    id: UID, display_name: null, avatar: '🦊', xp: 0,
    streak_count: 0, last_active_date: null, sound_on: true,
  },
}

const user = { id: UID, aud: 'authenticated', email: 'test.famille@astrocode.test', role: 'authenticated' }

async function stubSupabase(page) {
  await page.route('**/jccxdwtekvamrpqkdepl.supabase.co/**', async (route) => {
    const req = route.request()
    const url = new URL(req.url())
    const path = url.pathname
    const method = req.method()
    const json = (body, status = 200) =>
      route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })

    if (path.endsWith('/auth/v1/token')) {
      return json({
        access_token: jwt, token_type: 'bearer', expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        refresh_token: 'fake-refresh', user,
      })
    }
    if (path.endsWith('/auth/v1/user')) return json(user)
    if (path.endsWith('/auth/v1/logout')) return json({}, 204)

    if (path.includes('/rest/v1/profiles')) {
      if (method === 'POST' || method === 'PATCH') {
        const body = JSON.parse(req.postData() || '{}')
        Object.assign(state.profile, Array.isArray(body) ? body[0] : body)
        return json(state.profile, 201)
      }
      return json(state.profile)
    }
    if (path.includes('/rest/v1/lesson_progress')) {
      if (method === 'POST') return json([], 201)
      return json([])
    }
    if (path.includes('/rest/v1/activity_log')) {
      if (method === 'POST') return json([], 201)
      return json(null)
    }
    return json([])
  })
}

const browser = await chromium.launch({ executablePath: findChrome() })
const errors = []
let failed = false

async function run(viewport, suffix) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => errors.push(`[${suffix}] PAGEERROR: ${e.message}`))
  page.on('console', (m) => m.type() === 'error' && errors.push(`[${suffix}] CONSOLE: ${m.text()}`))
  await stubSupabase(page)

  // Réinitialise le profil simulé pour chaque passage
  state.profile.display_name = null

  await page.goto('http://localhost:5173/connexion', { waitUntil: 'networkidle' })
  await page.screenshot({ path: `${SCRATCH}/auth-1-connexion-${suffix}.png` })

  await page.fill('input[type=email]', 'test.famille@astrocode.test')
  await page.fill('input[type=password]', 'AstroTest!2026')
  await page.click('button[type=submit]')

  // Onboarding attendu
  await page.waitForSelector('text=Cosmo', { timeout: 8000 })
  const hasOnboarding = await page.locator("text=Ton prénom d'astronaute").count()
  if (!hasOnboarding) { console.log(`[${suffix}] ÉCHEC: onboarding absent`); failed = true }
  await page.fill('input[placeholder*="prénom"]', 'Luna')
  await page.click('button[aria-label="Avatar 🦄"]')
  await page.screenshot({ path: `${SCRATCH}/auth-2-onboarding-${suffix}.png` })
  await page.click('text=En route vers la galaxie')

  // Carte attendue avec le prénom
  await page.waitForSelector('text=Luna', { timeout: 8000 })
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${SCRATCH}/auth-3-app-${suffix}.png` })
  console.log(`[${suffix}] Parcours complet OK (connexion → prénom → app)`)
  await ctx.close()
}

await run({ width: 1440, height: 900 }, 'desktop')
await run({ width: 390, height: 844 }, 'mobile')

if (errors.length) console.log('ERREURS:\n' + errors.join('\n'))
await browser.close()
process.exit(failed ? 1 : 0)
