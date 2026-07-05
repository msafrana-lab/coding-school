// Reproduction du bug « labyrinthe malin » : on assemble la solution canonique
// en blocs, on lit le code généré, et on compare au résultat attendu.
import { chromium } from 'playwright'
import { installStub, baseState, findChrome } from './stub-lib.mjs'

const XML_SOLUTION =
  '<xml xmlns="https://developers.google.com/blockly/xml">' +
  '<block type="quand_demarre" deletable="false" x="16" y="16"><next>' +
  '<block type="repeter_jusqua"><statement name="DO">' +
  '<block type="si_sinon">' +
  '<value name="COND"><shadow type="capteur"><field name="SENS">cheminADroite</field></shadow></value>' +
  '<statement name="DO"><block type="tourner_droite"><next><block type="avancer"></block></next></block></statement>' +
  '<statement name="ELSE">' +
  '<block type="si_sinon">' +
  '<value name="COND"><shadow type="capteur"><field name="SENS">cheminDevant</field></shadow></value>' +
  '<statement name="DO"><block type="avancer"></block></statement>' +
  '<statement name="ELSE"><block type="tourner_gauche"></block></statement>' +
  '</block></statement></block></statement></block></next></block></xml>'

const browser = await chromium.launch({ executablePath: findChrome() })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
await installStub(ctx, baseState())
const page = await ctx.newPage()
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message))
await page.goto('http://localhost:5173/app/lecon/choizix-4', { waitUntil: 'networkidle' })
await page.waitForTimeout(1400)
await page.evaluate((xml) => window.__astroLoadXml(xml), XML_SOLUTION)
await page.waitForTimeout(400)
await page.getByRole('button', { name: '▶ TESTER' }).click()
await page.waitForTimeout(1500)
const diag = await page.evaluate(() => ({
  code: window.__astroLastCode,
  run: window.__astroLastRun,
}))
console.log('--- CODE GÉNÉRÉ ---')
console.log(diag.code)
console.log('--- RÉSULTAT SIMULATION ---')
console.log(JSON.stringify(diag.run))
await browser.close()
