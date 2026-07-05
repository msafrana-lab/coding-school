// Labyrinthe malin : solution canonique gagnante, programme piégé expliqué vite,
// et bouton STOP pour sortir de la simulation à tout moment.
import { chromium } from 'playwright'
import { installStub, baseState, findChrome } from './stub-lib.mjs'

const SCRATCH = '/tmp/claude-0/-home-user-coding-school/89587753-985d-5695-8276-3558c5e1c4c5/scratchpad'
const XML_NS = '<xml xmlns="https://developers.google.com/blockly/xml">'

const XML_SOLUTION =
  XML_NS +
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

// Le piège classique : « tourner à droite » SANS « avancer » → demi-tour sans fin
const XML_PIEGE =
  XML_NS +
  '<block type="quand_demarre" deletable="false" x="16" y="16"><next>' +
  '<block type="repeter_jusqua"><statement name="DO">' +
  '<block type="si_sinon">' +
  '<value name="COND"><shadow type="capteur"><field name="SENS">cheminADroite</field></shadow></value>' +
  '<statement name="DO"><block type="tourner_droite"></block></statement>' +
  '<statement name="ELSE">' +
  '<block type="si_sinon">' +
  '<value name="COND"><shadow type="capteur"><field name="SENS">cheminDevant</field></shadow></value>' +
  '<statement name="DO"><block type="avancer"></block></statement>' +
  '<statement name="ELSE"><block type="tourner_gauche"></block></statement>' +
  '</block></statement></block></statement></block></next></block></xml>'

const browser = await chromium.launch({ executablePath: findChrome() })
let failed = false
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
await installStub(ctx, baseState())
const page = await ctx.newPage()

await page.goto('http://localhost:5173/app/lecon/choizix-4', { waitUntil: 'networkidle' })
await page.waitForTimeout(1400)
await page.screenshot({ path: `${SCRATCH}/labyrinthe-squelette.png` })

// 1) Le squelette de départ contient bien les deux « si »
const scaffolds = await page.locator('.blocklySvg >> text=chemin à droite').count()
if (scaffolds > 0) console.log('OK : squelette pré-posé visible (capteur « chemin à droite ? »)')
else { console.log('ÉCHEC : squelette absent'); failed = true }

// 2) Solution canonique → victoire
await page.evaluate((x) => window.__astroLoadXml(x), XML_SOLUTION)
await page.getByRole('button', { name: '▶ TESTER' }).click()
await page.waitForSelector('text=Mission réussie', { timeout: 20000 })
console.log('OK : la solution du labyrinthe gagne')
await page.getByRole('button', { name: 'Rejouer' }).click()
await page.waitForTimeout(400)

// 3) Programme piégé → explication « boucle » en moins de 25 s
await page.evaluate((x) => window.__astroLoadXml(x), XML_PIEGE)
const t0 = Date.now()
await page.getByRole('button', { name: '▶ TESTER' }).click()
await page.waitForSelector('text=tourne en rond', { timeout: 25000 })
console.log(`OK : fusée qui tourne en rond expliquée en ${Math.round((Date.now() - t0) / 1000)} s`)
await page.getByRole('button', { name: 'Réessayer' }).click()
await page.waitForTimeout(400)

// 4) STOP en plein vol → retour immédiat aux blocs
await page.getByRole('button', { name: '▶ TESTER' }).click()
await page.waitForTimeout(1500)
await page.getByRole('button', { name: /STOP/ }).last().click()
await page.waitForSelector('button:has-text("▶ TESTER")', { timeout: 5000 })
console.log('OK : STOP sort de la simulation et rend la main')

await browser.close()
process.exit(failed ? 1 : 0)
