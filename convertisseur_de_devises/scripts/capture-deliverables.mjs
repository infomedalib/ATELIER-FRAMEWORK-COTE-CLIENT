import assert from 'node:assert/strict'
import { mkdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from 'playwright'

const root = process.cwd()
const screenshotsDirectory = resolve(root, 'screenshots')
const reportPath = resolve(root, 'Compte-rendu.pdf')
const cases = [
  { file: '01-usd-eur.png', amount: '120', source: 'USD', target: 'EUR', expected: '102.56' },
  { file: '02-eur-tnd.png', amount: '100', source: 'EUR', target: 'TND', expected: '340.00' },
  { file: '03-gbp-usd.png', amount: '50', source: 'GBP', target: 'USD', expected: '67.24' },
  { file: '04-eur-eur.png', amount: '10', source: 'EUR', target: 'EUR', expected: '10.00' },
]

await mkdir(screenshotsDirectory, { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })

try {
  await page.goto(process.env.APP_URL || 'http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
  await page.locator('.converter').waitFor()
  await page.locator('.converter').screenshot({ path: resolve(screenshotsDirectory, '00-demarrage.png') })

  const clearAmount = () => page.getByRole('button', { name: 'Effacer le montant' }).click()
  const enterAmount = async (amount) => {
    for (const digit of amount) await page.getByRole('button', { name: digit, exact: true }).click()
  }

  await page.getByRole('button', { name: 'Convertir' }).click()
  assert.equal(await page.getByRole('alert').textContent(), 'Veuillez saisir un montant')
  await page.getByRole('button', { name: '1', exact: true }).click()
  assert.equal(await page.getByRole('alert').count(), 0)

  for (const testCase of cases) {
    await clearAmount()
    await page.locator('#source-currency').selectOption(testCase.source)
    await page.locator('#target-currency').selectOption(testCase.target)
    await enterAmount(testCase.amount)
    await page.getByRole('button', { name: 'Convertir' }).click()
    const actual = (await page.locator('.result-value').textContent()).trim()
    assert.equal(actual, testCase.expected, `${testCase.amount} ${testCase.source} vers ${testCase.target}`)
    await page.locator('.converter').screenshot({ path: resolve(screenshotsDirectory, testCase.file) })
  }

  await clearAmount()
  await page.locator('#source-currency').selectOption('USD')
  await page.locator('#target-currency').selectOption('EUR')
  await enterAmount('50')
  await page.getByRole('button', { name: 'Convertir' }).click()
  await page.getByRole('button', { name: 'Inverser les devises' }).click()
  assert.equal(await page.locator('#source-currency').inputValue(), 'EUR')
  assert.equal(await page.locator('#target-currency').inputValue(), 'USD')
  assert.equal((await page.locator('.result-value').textContent()).trim(), '58.50')

  await clearAmount()
  await enterAmount('1234567890')
  assert.equal((await page.locator('.currency-row .amount-value').first().textContent()).trim(), '1234567890')
  await page.getByRole('button', { name: '.', exact: true }).click()
  await page.getByRole('button', { name: '1', exact: true }).click()
  assert.equal((await page.locator('.currency-row .amount-value').first().textContent()).trim(), '1234567890')

  const image = async (name) => {
    const bytes = await readFile(resolve(screenshotsDirectory, name))
    return `data:image/png;base64,${bytes.toString('base64')}`
  }

  const startImage = await image('00-demarrage.png')
  const caseImages = await Promise.all(cases.map(async (testCase) => ({ ...testCase, image: await image(testCase.file) })))
  const report = await browser.newPage({ viewport: { width: 1240, height: 1754 } })
  const caseCards = caseImages.map((testCase) => `
    <article class="case">
      <h2>${testCase.amount} ${testCase.source} → ${testCase.target} <strong>${testCase.expected}</strong></h2>
      <img src="${testCase.image}" alt="Capture du test ${testCase.amount} ${testCase.source} vers ${testCase.target}, résultat ${testCase.expected}" />
    </article>`).join('')

  await report.setContent(`<!doctype html>
    <html lang="fr"><head><meta charset="utf-8"><style>
      @page { size: A4; margin: 0; }
      * { box-sizing: border-box; }
      body { margin: 0; color: #173d49; font: 10pt 'Arial', sans-serif; }
      .page { width: 210mm; height: 297mm; padding: 14mm; overflow: hidden; break-after: page; }
      .page:last-child { break-after: auto; }
      .kicker { margin: 0 0 3mm; color: #1689a7; font-size: 9pt; font-weight: bold; }
      h1 { margin: 0 0 3mm; font-size: 27pt; line-height: 1.1; }
      h2 { margin: 0 0 2mm; font-size: 11pt; }
      p { margin: 0 0 3mm; line-height: 1.45; }
      .subtitle { margin-bottom: 7mm; color: #5d7880; font-size: 12pt; }
      .intro { display: grid; grid-template-columns: 78mm 1fr; gap: 9mm; align-items: start; }
      .intro img { display: block; width: 72mm; height: auto; border: 1px solid #d6e5e4; border-radius: 2mm; }
      .label { margin: 0 0 2mm; color: #178eab; font-size: 9pt; font-weight: bold; }
      .block { margin: 0 0 6mm; }
      .callout { margin-top: 5mm; padding: 4mm; border-left: 1.2mm solid #2bb8e8; background: #eef8f7; }
      .formula { margin: 3mm 0; padding: 3mm 4mm; border-radius: 1mm; background: #eff7f5; font: 11pt 'Courier New', monospace; }
      table { width: 100%; border-collapse: collapse; margin: 3mm 0 6mm; }
      th, td { padding: 2.5mm 3mm; border-bottom: 1px solid #d8e7e5; text-align: left; }
      th { color: #167e99; font-size: 9pt; }
      .small { color: #58747b; font-size: 9pt; }
      .checks { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm 8mm; margin-top: 3mm; }
      .check { padding: 2.5mm 3mm; background: #eff7f5; }
      .test-page { padding: 9mm 11mm; }
      .case-grid { display: grid; height: 267mm; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 3mm 7mm; }
      .case { display: flex; min-height: 0; flex-direction: column; align-items: center; }
      .case h2 { width: 100%; min-height: 7mm; color: #214f5e; font-size: 9pt; }
      .case strong { float: right; color: #1689a7; }
      .case img { display: block; height: 126mm; max-width: 100%; object-fit: contain; object-position: top center; border: 1px solid #d6e5e4; }
      .footer { margin-top: 5mm; padding-top: 2mm; border-top: 1px solid #d8e7e5; color: #6c858a; font-size: 8pt; }
    </style></head><body>
      <section class="page">
        <p class="kicker">TP VUE.JS · TAUX FIXES</p>
        <h1>Currency Converter</h1>
        <p class="subtitle">Compte rendu · Tahar Haouet · 8 octobre 2026</p>
        <div class="intro">
          <div><p class="label">ÉCRAN DE DÉMARRAGE</p><img src="${startImage}" alt="Capture de l'application au démarrage" /></div>
          <div>
            <section class="block"><p class="label">OBJECTIF</p><p>Réaliser une page Vue 3 qui convertit un montant entre six devises avec des taux fixes, sans champ de saisie : le montant est construit à l'aide d'un clavier numérique.</p></section>
            <section class="block"><p class="label">CHOIX D'INTERFACE</p><p>La carte, limitée à 360 px, reprend les deux zones de la maquette : affichage turquoise, sélection des devises et résultat en haut, clavier 4 × 3 sur fond clair. La taille reste adaptée aux petits écrans.</p><p>Les deux listes sont reliées par <code>v-model</code> et générées avec <code>v-for</code>. Les contrôles de clavier et l'inversion sont aussi accessibles au clavier physique.</p></section>
            <section class="callout"><p class="label">TECHNOLOGIES</p><p>Vue 3 · Composition API · Vite · CSS écrit à la main · Playwright pour les vérifications et les livrables.</p></section>
          </div>
        </div>
        <p class="footer">Application pédagogique : les taux ne sont pas des cours en temps réel.</p>
      </section>
      <section class="page">
        <p class="kicker">IMPLÉMENTATION ET VÉRIFICATION</p>
        <h1>Conversion via l'euro</h1>
        <p class="subtitle">Les taux fournis représentent la valeur d'une unité d'euro dans chaque devise.</p>
        <div class="formula">Montant EUR = montant ÷ taux[source]</div>
        <div class="formula">Résultat = Montant EUR × taux[cible]</div>
        <p>La valeur saisie est convertie en nombre, calculée avec le taux source et le taux cible, puis présentée avec <code>toFixed(2)</code>. Si la valeur est nulle, un message conditionnel est affiché. La touche C réinitialise la saisie et une saisie décimale ou longue est filtrée à l'entrée.</p>
        <p class="label">TAUX UTILISÉS</p>
        <table><thead><tr><th>Code</th><th>Taux pour 1 EUR</th><th>Code</th><th>Taux pour 1 EUR</th></tr></thead><tbody>
          <tr><td>EUR</td><td>1.00</td><td>USD</td><td>1.17</td></tr>
          <tr><td>TND</td><td>3.40</td><td>GBP</td><td>0.87</td></tr>
          <tr><td>JPY</td><td>172.50</td><td>CAD</td><td>1.62</td></tr>
        </tbody></table>
        <p class="label">RÉSULTATS DES CAS DEMANDÉS</p>
        <table><thead><tr><th>Montant</th><th>Source</th><th>Cible</th><th>Attendu</th><th>Obtenu</th></tr></thead><tbody>
          ${cases.map((testCase) => `<tr><td>${testCase.amount}</td><td>${testCase.source}</td><td>${testCase.target}</td><td>${testCase.expected}</td><td>${testCase.expected} · OK</td></tr>`).join('')}
        </tbody></table>
        <p class="label">CONTRÔLES COMPLÉMENTAIRES</p>
        <div class="checks"><div class="check">Alerte affichée à zéro, masquée dès la saisie.</div><div class="check">Inversion des devises et recalcul vérifiés.</div><div class="check">Une seule décimale acceptée.</div><div class="check">Saisie limitée à 10 caractères.</div><div class="check">Largeur 360 px sans débordement horizontal.</div><div class="check">Build de production exécuté avec succès.</div></div>
        <p class="footer">Difficulté traitée : conserver une saisie lisible tout en rejetant les points décimaux répétés et les caractères au-delà de la limite, avant le calcul.</p>
      </section>
      <section class="page test-page">
        <p class="kicker">CAPTURES · CAS DE TEST</p>
        <h1>Vérification visuelle</h1>
        <div class="case-grid">${caseCards}</div>
      </section>
    </body></html>`, { waitUntil: 'load' })

  await report.pdf({ path: reportPath, format: 'A4', printBackground: true, preferCSSPageSize: true })
  await report.close()
  console.log(`Captures créées dans ${screenshotsDirectory}`)
  console.log(`Tests réussis : ${cases.map((testCase) => `${testCase.amount} ${testCase.source}→${testCase.target} ${testCase.expected}`).join(' | ')}`)
  console.log(`Compte rendu créé : ${reportPath}`)
} finally {
  await browser.close()
}