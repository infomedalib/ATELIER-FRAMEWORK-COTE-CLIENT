import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const capturesDirectory = path.join(root, 'captures')
const appUrl = 'http://localhost:5174'
const apiUrl = 'http://localhost:3000'
const ticketTitle = `Ticket de capture ${new Date().toISOString()}`
const ticketDescription = 'Ticket créé automatiquement pour les captures Playwright.'
const ticketRequester = 'Dali'
const children = []

async function waitForServer(url, child) {
  const deadline = Date.now() + 30_000
  let lastError

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Le serveur s’est arrêté avant de démarrer (code ${child.exitCode}).`)
    }

    try {
      const response = await fetch(url)
      if (response.ok) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        if (child.exitCode !== null) {
          throw new Error(`Le serveur s’est arrêté avant de démarrer (code ${child.exitCode}).`)
        }
        return
      }
      lastError = new Error(`Réponse HTTP ${response.status} depuis ${url}`)
    } catch (error) {
      lastError = error
    }

    await new Promise((resolve) => setTimeout(resolve, 300))
  }

  throw new Error(`Délai dépassé en attendant ${url}. ${lastError?.message ?? ''}`)
}

async function assertPortAvailable(port) {
  for (const host of ['127.0.0.1', '::1']) {
    const server = net.createServer()
    try {
      await new Promise((resolve, reject) => {
        server.once('error', reject)
        server.listen(port, host, resolve)
      })
      await new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve())
      })
    } catch (error) {
      if (error.code === 'EADDRINUSE') {
        throw new Error(`Le port ${port} est déjà utilisé. Arrêtez le service en cours et relancez le script.`)
      }
      if (error.code !== 'EADDRNOTAVAIL') throw error
    }
  }
}

async function ticketAppIsServing() {
  try {
    const response = await fetch(appUrl)
    if (!response.ok) return false
    return (await response.text()).includes('<title>Tickets de Maintenance</title>')
  } catch (error) {
    if (error.cause?.code === 'ECONNREFUSED') return false
    throw error
  }
}

function startServer(script, args) {
  const child = spawn(process.execPath, [script, ...args], {
    cwd: root,
    stdio: 'inherit'
  })
  children.push(child)
  return child
}

async function stopServer(child) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return

  await new Promise((resolve) => {
    const timer = setTimeout(() => child.kill('SIGKILL'), 5_000)
    child.once('close', () => {
      clearTimeout(timer)
      resolve()
    })
    child.kill()
  })
}

async function capture(page, name) {
  const file = path.join(capturesDirectory, name)
  await page.screenshot({ path: file, fullPage: true })
  console.log(`Capture enregistrée : ${file}`)
}

await mkdir(capturesDirectory, { recursive: true })

let browser
let apiServer
let createdTicketId

try {
  await assertPortAvailable(3000)
  if (await ticketAppIsServing()) {
    console.log(`Vite déjà actif sur ${appUrl}, réutilisation du serveur.`)
  } else {
    await assertPortAvailable(5174)
    const viteServer = startServer(
      path.join(root, 'node_modules', 'vite', 'bin', 'vite.js'),
      ['--host', 'localhost', '--port', '5174', '--strictPort']
    )
    await waitForServer(appUrl, viteServer)
  }

  apiServer = startServer(
    path.join(root, 'node_modules', 'json-server', 'lib', 'cli', 'bin.js'),
    ['db.json', '--port', '3000']
  )
  await waitForServer(`${apiUrl}/tickets`, apiServer)

  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } })
  page.on('pageerror', (error) => console.error(`Erreur JavaScript dans la page : ${error.message}`))

  await page.goto(`${appUrl}/tickets/nouveau`, { waitUntil: 'networkidle' })
  const creationForm = page.locator('form')
  await creationForm.locator('input').nth(0).fill(ticketTitle)
  await creationForm.locator('textarea').fill(ticketDescription)
  await creationForm.locator('input').nth(1).fill(ticketRequester)
  await creationForm.locator('select').selectOption({ label: 'Moyenne' })
  await capture(page, 'capture-01.png')

  await page.getByRole('button', { name: 'Créer le ticket' }).click()
  const ticketCard = page.locator('.carte').filter({ hasText: ticketTitle })
  await ticketCard.waitFor()
  const createdTicketsResponse = await fetch(`${apiUrl}/tickets`)
  if (!createdTicketsResponse.ok) {
    throw new Error(`Impossible de charger le ticket créé (HTTP ${createdTicketsResponse.status}).`)
  }
  const createdTickets = await createdTicketsResponse.json()
  const createdTicket = createdTickets.find((ticket) => ticket.titre === ticketTitle)
  if (!createdTicket) throw new Error('Le ticket de capture est introuvable dans json-server.')
  createdTicketId = createdTicket.id
  await capture(page, 'capture-02.png')

  await ticketCard.getByRole('link', { name: 'Voir le détail' }).click()
  await page.getByRole('button', { name: 'Modifier' }).waitFor()
  await page.getByRole('button', { name: 'Modifier' }).click()
  const editForm = page.locator('form')
  await editForm.locator('select').nth(0).selectOption({ label: 'Haute' })
  await editForm.locator('select').nth(1).selectOption({ label: 'En cours' })
  await capture(page, 'capture-03.png')

  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await page.getByRole('button', { name: 'Modifier' }).waitFor()
  await capture(page, 'capture-04.png')

  await page.evaluate((message) => {
    const overlay = document.createElement('div')
    overlay.dataset.captureConfirm = ''
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.55);display:flex;justify-content:center;align-items:flex-start;padding:95px 16px 16px;font-family:Arial,sans-serif'

    const dialog = document.createElement('section')
    dialog.setAttribute('role', 'dialog')
    dialog.setAttribute('aria-modal', 'true')
    dialog.style.cssText = 'width:min(448px,100%);padding:24px 20px 16px;border-radius:14px;background:#292929;color:#f4f4f4;box-shadow:0 10px 32px rgba(0,0,0,.45)'

    const heading = document.createElement('strong')
    heading.textContent = `${location.host} indique`
    heading.style.cssText = 'font-size:16px'

    const text = document.createElement('p')
    text.textContent = message
    text.style.cssText = 'margin:16px 0 36px;font-size:14px'

    const actions = document.createElement('div')
    actions.style.cssText = 'display:flex;justify-content:flex-end;gap:8px'
    for (const [label, background] of [['OK', '#8ab4f8'], ['Annuler', '#3c4043']]) {
      const button = document.createElement('button')
      button.textContent = label
      button.style.cssText = `border:0;border-radius:18px;padding:10px 22px;background:${background};color:${label === 'OK' ? '#202124' : '#f4f4f4'};font-size:13px`
      actions.append(button)
    }

    dialog.append(heading, text, actions)
    overlay.append(dialog)
    document.body.append(overlay)
  }, `Supprimer le ticket "${ticketTitle}" ?`)
  await capture(page, 'capture-05.png')
  await page.locator('[data-capture-confirm]').evaluate((overlay) => overlay.remove())

  let dialogTask
  let dialogMessage
  page.once('dialog', (dialog) => {
    dialogMessage = dialog.message()
    dialogTask = dialog.dismiss()
  })
  await page.getByRole('button', { name: 'Supprimer' }).click()
  if (!dialogTask) throw new Error('La boîte window.confirm attendue ne s’est pas ouverte.')
  await dialogTask
  if (dialogMessage !== `Supprimer le ticket "${ticketTitle}" ?`) {
    throw new Error('La boîte window.confirm contenait un message inattendu.')
  }

  const deleteResponse = await fetch(`${apiUrl}/tickets/${createdTicketId}`, { method: 'DELETE' })
  if (!deleteResponse.ok) {
    throw new Error(`Impossible de nettoyer le ticket de capture (HTTP ${deleteResponse.status}).`)
  }
  createdTicketId = undefined

  await page.goto(`${appUrl}/tickets/nouveau`, { waitUntil: 'networkidle' })
  const invalidForm = page.locator('form')
  await invalidForm.locator('textarea').fill(ticketDescription)
  await invalidForm.locator('input').nth(1).fill(ticketRequester)
  await page.getByRole('button', { name: 'Créer le ticket' }).click()
  await page.locator('.erreur').waitFor()
  await capture(page, 'capture-06.png')

  await stopServer(apiServer)
  apiServer = undefined
  await page.goto(`${appUrl}/tickets`, { waitUntil: 'networkidle' })
  await page.locator('p.erreur').waitFor()
  await capture(page, 'capture-07.png')
} finally {
  if (createdTicketId !== undefined && apiServer && apiServer.exitCode === null) {
    const cleanupResponse = await fetch(`${apiUrl}/tickets/${createdTicketId}`, { method: 'DELETE' })
    if (!cleanupResponse.ok) {
      console.error(`Échec du nettoyage du ticket ${createdTicketId} (HTTP ${cleanupResponse.status}).`)
    }
  }
  if (browser) await browser.close()
  await Promise.all(children.map(stopServer))
}
