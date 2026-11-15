<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { deleteTicket, getTicket } from '../services/ticketService'
import { errorMessage, formatDate } from '../utils/format'

const route = useRoute()
const router = useRouter()

const ticket = ref(null)
const loading = ref(true)
const deleting = ref(false)
const error = ref('')

function statusClass(status) {
  return `status-${status.toLowerCase().replace(' ', '-')}`
}

async function loadTicket() {
  loading.value = true
  error.value = ''

  try {
    ticket.value = await getTicket(route.params.id)
  } catch (requestError) {
    error.value = errorMessage(requestError)
  } finally {
    loading.value = false
  }
}

async function removeTicket() {
  if (!ticket.value) return

  const confirmed = window.confirm(
    `Confirmer la suppression du ticket « ${ticket.value.title} » ? Cette action est définitive.`
  )

  if (!confirmed) return

  deleting.value = true
  error.value = ''

  try {
    await deleteTicket(ticket.value.id)
    router.push('/tickets')
  } catch (requestError) {
    error.value = errorMessage(requestError)
  } finally {
    deleting.value = false
  }
}

onMounted(loadTicket)
</script>

<template>
  <div class="breadcrumb">
    <RouterLink to="/tickets">Tickets</RouterLink>
    <span>/</span>
    <span>Détail</span>
  </div>

  <div v-if="loading" class="panel empty-state">Chargement du ticket…</div>

  <section v-else-if="error" class="panel not-found">
    <div class="not-found-icon">!</div>
    <h1>Ticket introuvable</h1>
    <p class="muted">{{ error }}</p>
    <RouterLink to="/tickets" class="button button-primary">
      Retour à la liste
    </RouterLink>
  </section>

  <template v-else-if="ticket">
    <section class="page-heading">
      <div>
        <p class="eyebrow">DÉTAIL DE LA DEMANDE · #{{ ticket.id }}</p>
        <h1>{{ ticket.title }}</h1>
        <p class="muted">Consultez toutes les informations de ce ticket.</p>
      </div>

      <div class="heading-actions">
        <RouterLink
          :to="`/tickets/${ticket.id}?edit=1`"
          class="button button-primary"
        >
          ✎ Modifier
        </RouterLink>
        <button
          class="button button-danger"
          :disabled="deleting"
          @click="removeTicket"
        >
          {{ deleting ? 'Suppression…' : 'Supprimer' }}
        </button>
      </div>
    </section>

    <section class="detail-grid">
      <article class="panel detail-card">
        <p class="eyebrow">DESCRIPTION</p>
        <h2>Problème signalé</h2>
        <p class="detail-description">{{ ticket.description }}</p>
      </article>

      <article class="panel detail-card">
        <p class="eyebrow">SUIVI</p>
        <h2>État du ticket</h2>
        <div class="detail-line">
          <span>Statut</span>
          <span class="status" :class="statusClass(ticket.status)">
            {{ ticket.status }}
          </span>
        </div>
        <div class="detail-line">
          <span>Priorité</span>
          <span
            class="priority"
            :class="`priority-${ticket.priority.toLowerCase()}`"
          >
            {{ ticket.priority }}
          </span>
        </div>
      </article>

      <article class="panel detail-card">
        <p class="eyebrow">DEMANDEUR</p>
        <h2>Contact</h2>
        <div class="detail-line">
          <span>Nom</span>
          <strong>{{ ticket.requester }}</strong>
        </div>
        <div class="detail-line">
          <span>Date de création</span>
          <strong>{{ formatDate(ticket.createdAt) }}</strong>
        </div>
        <div class="detail-line">
          <span>Identifiant</span>
          <strong>#{{ ticket.id }}</strong>
        </div>
      </article>
    </section>

    <RouterLink to="/tickets" class="back-link">
      ← Retour à la liste des tickets
    </RouterLink>
  </template>
</template>
