import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const root = fileURLToPath(new URL('../', import.meta.url))
const captureDirectory = join(root, 'captures')
const jsonServerPath = join(root, 'node_modules', 'json-server', 'lib', 'bin.js')
const vitePath = join(root, 'node_modules', 'vite', 'bin', 'vite.js')
const appUrl = 'http://127.0.0.1:5173'
const apiUrl = 'http://localhost:3000'
let jsonServer
let viteServer
let browser

async function waitForServer(url, child) {
  const deadline = Date.now() + 30000

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Le serveur ne démarre pas : ${url}`)
    }

    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {}

    await delay(250)
  }

  throw new Error(`Délai dépassé en attendant ${url}`)
}

async function stopProcess(child) {
  if (!child || child.exitCode !== null) return

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      child.kill('SIGKILL')
    }, 5000)

    child.once('error', reject)
    child.once('exit', () => {
      clearTimeout(timeout)
      resolve()
    })

    child.kill('SIGTERM')
  })
}

try {
  await mkdir(captureDirectory, { recursive: true })

  jsonServer = spawn(process.execPath, [jsonServerPath, 'db.json', '--port', '3000'], {
    cwd: root,
    stdio: 'inherit',
  })
  await waitForServer(`${apiUrl}/tickets`, jsonServer)

  viteServer = spawn(process.execPath, [vitePath, '--host', '127.0.0.1', '--port', '5173', '--strictPort'], {
    cwd: root,
    stdio: 'inherit',
  })
  await waitForServer(appUrl, viteServer)

  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })

  const apiResponse = await page.goto(`${apiUrl}/tickets`, { waitUntil: 'networkidle' })
  if (!apiResponse?.ok()) throw new Error('La requête GET /tickets a échoué.')
  await page.screenshot({ path: join(captureDirectory, '01-api-json.png'), fullPage: true })

  await page.goto(appUrl, { waitUntil: 'networkidle' })
  await page.locator('.ticket-card').nth(2).waitFor()
  await page.screenshot({ path: join(captureDirectory, '02-liste-tickets.png'), fullPage: true })

  await page.locator('.search-input').fill('Wi-Fi')
  await page.locator('.ticket-card').waitFor()
  if (await page.locator('.ticket-card').count() !== 1) {
    throw new Error('La recherche ne retourne pas exactement un ticket.')
  }
  await page.screenshot({ path: join(captureDirectory, '03-recherche.png'), fullPage: true })

  await page.locator('.search-input').fill('')
  await page.locator('.filter-select').nth(0).selectOption('En cours')
  await page.locator('.filter-select').nth(1).selectOption('Moyenne')
  if (await page.locator('.ticket-card').count() !== 1) {
    throw new Error('Les filtres combinés ne retournent pas exactement un ticket.')
  }
  await page.screenshot({ path: join(captureDirectory, '04-filtres.png'), fullPage: true })

  await stopProcess(jsonServer)
  jsonServer = undefined
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.getByText('Erreur : impossible de contacter le serveur. Vérifiez que json-server est lancé.').waitFor()
  await page.screenshot({ path: join(captureDirectory, '05-erreur-serveur.png'), fullPage: true })

  console.log('Les cinq captures ont été générées dans captures/.')
} finally {
  if (browser) await browser.close()
  await stopProcess(jsonServer)
  await stopProcess(viteServer)
}
