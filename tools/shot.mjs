import { chromium } from "playwright"
import fs from 'fs'

const SCRATCH = '/tmp/claude-0/-home-user-coding-school/89587753-985d-5695-8276-3558c5e1c4c5/scratchpad'

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

const [, , url = 'http://localhost:5173/', name = 'page', mode = 'both'] = process.argv

const browser = await chromium.launch({ executablePath: findChrome() })

async function snap(viewport, suffix, fullPage = true) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('CONSOLE: ' + m.text())
  })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${SCRATCH}/${name}-${suffix}.png`, fullPage })
  if (errors.length) console.log(`[${suffix}] ERREURS:\n` + errors.join('\n'))
  else console.log(`[${suffix}] OK, aucune erreur console`)
  await ctx.close()
}

if (mode === 'both' || mode === 'desktop') await snap({ width: 1440, height: 900 }, 'desktop')
if (mode === 'both' || mode === 'mobile') await snap({ width: 390, height: 844 }, 'mobile')

await browser.close()
