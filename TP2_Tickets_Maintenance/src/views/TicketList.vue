<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { deleteTicket, getTickets, updateTicket } from '../services/ticketService'
import { errorMessage } from '../utils/format'

const tickets = ref([])
const loading = ref(true)
const error = ref('')
const search = ref('')
const statusFilter = ref('Tous')
const priorityFilter = ref('Toutes')
const busyId = ref(null)

const statuses = ['Ouvert', 'En cours', 'Résolu', 'Fermé']
const nextStatus = {
  Ouvert: 'En cours',
  'En cours': 'Résolu',
  Résolu: 'Fermé',
  Fermé: 'Ouvert'
}

const filteredTickets = computed(() => {
  const searchText = search.value.trim().toLowerCase()

  return tickets.value.filter(ticket => {
    const textMatches = [
      ticket.title,
      ticket.description,
      ticket.requester
    ].some(value => String(value || '').toLowerCase().includes(searchText))

    const statusMatches =
      statusFilter.value === 'Tous' || ticket.status === statusFilter.value
    const priorityMatches =
      priorityFilter.value === 'Toutes' || ticket.priority === priorityFilter.value

    return textMatches && statusMatches && priorityMatches
  })
})

const openCount = computed(
  () => tickets.value.filter(ticket => ticket.status === 'Ouvert').length
)
const inProgressCount = computed(
  () => tickets.value.filter(ticket => ticket.status === 'En cours').length
)
const resolvedCount = computed(
  () => tickets.value.filter(
    ticket => ticket.status === 'Résolu' || ticket.status === 'Fermé'
  ).length
)

function statusClass(status) {
  return `status-${status.toLowerCase().replace(' ', '-')}`
}

async function loadTickets() {
  loading.value = true
  error.value = ''

  try {
    tickets.value = await getTickets()
  } catch (requestError) {
    error.value = errorMessage(requestError)
  } finally {
    loading.value = false
  }
}

async function changeStatus(ticket) {
  busyId.value = ticket.id
  error.value = ''

  try {
    const updatedTicket = {
      ...ticket,
      status: nextStatus[ticket.status] || 'Ouvert'
    }

    await updateTicket(ticket.id, updatedTicket)
    tickets.value = tickets.value.map(item =>
      item.id === ticket.id ? updatedTicket : item
    )
  } catch (requestError) {
    error.value = errorMessage(requestError)
  } finally {
    busyId.value = null
  }
}

async function removeTicket(ticket) {
  const confirmed = window.confirm(
    `Confirmer la suppression du ticket « ${ticket.title} » ? Cette action est définitive.`
  )

  if (!confirmed) return

  busyId.value = ticket.id
  error.value = ''

  try {
    await deleteTicket(ticket.id)
    tickets.value = tickets.value.filter(item => item.id !== ticket.id)
  } catch (requestError) {
    error.value = errorMessage(requestError)
  } finally {
    busyId.value = null
  }
}

onMounted(loadTickets)
</script>

<template>
  <section class="page-heading">
    <div>
      <p class="eyebrow">ESPACE DE SUPPORT</p>
      <h1>Suivi des tickets</h1>
      <p class="muted">Centralisez et suivez les demandes de maintenance.</p>
    </div>
    <RouterLink to="/tickets/nouveau" class="button button-primary">
      ＋ Nouveau ticket
    </RouterLink>
  </section>

  <section class="stats-grid">
    <article class="stat-card">
      <span>Total tickets</span>
      <strong>{{ tickets.length }}</strong>
    </article>
    <article class="stat-card">
      <span>Ouverts</span>
      <strong>{{ openCount }}</strong>
    </article>
    <article class="stat-card">
      <span>En cours</span>
      <strong>{{ inProgressCount }}</strong>
    </article>
    <article class="stat-card">
      <span>Résolus</span>
      <strong>{{ resolvedCount }}</strong>
    </article>
  </section>

  <div v-if="error" class="alert alert-error" role="alert">
    {{ error }}
    <button class="text-button" @click="loadTickets">Réessayer</button>
  </div>

  <section class="panel">
    <div class="panel-heading">
      <div>
        <h2>Liste des demandes</h2>
        <p class="muted small">Recherchez, filtrez et mettez à jour vos tickets.</p>
      </div>
      <button class="button button-light" @click="loadTickets">↻ Actualiser</button>
    </div>

    <div class="filters">
      <label class="search-field">
        <span>⌕</span>
        <input
          v-model="search"
          type="search"
          placeholder="Rechercher un ticket, demandeur..."
        />
      </label>

      <select v-model="statusFilter" aria-label="Filtrer par statut">
        <option>Tous</option>
        <option v-for="status in statuses" :key="status">{{ status }}</option>
      </select>

      <select v-model="priorityFilter" aria-label="Filtrer par priorité">
        <option>Toutes</option>
        <option>Basse</option>
        <option>Moyenne</option>
        <option>Haute</option>
      </select>
    </div>

    <div v-if="loading" class="empty-state">Chargement des tickets…</div>

    <div v-else-if="filteredTickets.length === 0" class="empty-state">
      <strong>Aucun ticket trouvé</strong>
      <p class="muted">Modifiez les filtres ou créez une nouvelle demande.</p>
    </div>

    <div v-else class="ticket-list">
      <article
        v-for="ticket in filteredTickets"
        :key="ticket.id"
        class="ticket-row"
      >
        <div class="ticket-main">
          <div class="ticket-title-line">
            <RouterLink :to="`/tickets/${ticket.id}`" class="ticket-title">
              {{ ticket.title }}
            </RouterLink>
            <span
              class="priority"
              :class="`priority-${ticket.priority.toLowerCase()}`"
            >
              {{ ticket.priority }}
            </span>
          </div>

          <p class="ticket-description">{{ ticket.description }}</p>
          <div class="ticket-meta">
            <span>♙ {{ ticket.requester }}</span>
            <span>▦ {{ ticket.createdAt }}</span>
          </div>
        </div>

        <div class="ticket-actions">
          <span class="status" :class="statusClass(ticket.status)">
            {{ ticket.status }}
          </span>
          <button
            class="icon-button"
            :disabled="busyId === ticket.id"
            title="Passer au statut suivant"
            @click="changeStatus(ticket)"
          >
            ⇢
          </button>
          <RouterLink
            class="icon-button"
            :to="`/tickets/${ticket.id}?edit=1`"
            title="Modifier"
          >
            ✎
          </RouterLink>
          <button
            class="icon-button danger-hover"
            :disabled="busyId === ticket.id"
            title="Supprimer"
            @click="removeTicket(ticket)"
          >
            ⌫
          </button>
        </div>
      </article>
    </div>

    <div class="list-foot">{{ filteredTickets.length }} ticket(s) affiché(s)</div>
  </section>
</template>
