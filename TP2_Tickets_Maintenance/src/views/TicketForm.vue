<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { createTicket, getTicket, updateTicket } from '../services/ticketService'
import { errorMessage } from '../utils/format'

const route = useRoute()
const router = useRouter()
const isEdit = computed(function () {
  return Boolean(route.query.edit)
})
const form = reactive({
  title: '',
  description: '',
  requester: '',
  priority: 'Moyenne',
  status: 'Ouvert'
})

const loading = ref(false)
const saving = ref(false)
const error = ref('')
const statuses = ['Ouvert', 'En cours', 'Résolu', 'Fermé']

async function loadTicket() {
  if (!isEdit.value) return

  loading.value = true
  try {
    Object.assign(form, await getTicket(route.params.id))
  } catch (requestError) {
    error.value = errorMessage(requestError)
  } finally {
    loading.value = false
  }
}

async function saveTicket() {
  if (!form.title.trim() || !form.description.trim() || !form.requester.trim()) {
    error.value = 'Veuillez remplir tous les champs obligatoires.'
    return
  }

  if (saving.value) return

  error.value = ''
  saving.value = true

  let status = 'Ouvert'
  if (isEdit.value) {
    status = form.status
  }

  const ticket = {
    title: form.title.trim(),
    description: form.description.trim(),
    requester: form.requester.trim(),
    priority: form.priority,
    status: status
  }

  try {
    if (isEdit.value) {
      await updateTicket(route.params.id, { ...form, ...ticket })
      router.push(`/tickets/${route.params.id}`)
    } else {
      const newTicket = await createTicket({
        ...ticket,
        createdAt: new Date().toISOString().slice(0, 10)
      })
      router.push(`/tickets/${newTicket.id}`)
    }
  } catch (requestError) {
    error.value = errorMessage(requestError)
  } finally {
    saving.value = false
  }
}

onMounted(loadTicket)
</script>

<template>
  <div class="breadcrumb">
    <RouterLink to="/tickets">Tickets</RouterLink>
    <span>/</span>
    <span v-if="isEdit">Modification</span>
    <span v-else>Nouveau ticket</span>
  </div>

  <section class="form-layout">
    <div class="page-heading">
      <div>
        <h1 v-if="isEdit">Modifier le ticket</h1>
        <h1 v-else>Créer un ticket</h1>
        <p class="muted">Remplissez les informations du ticket.</p>
      </div>
    </div>

    <p v-if="error" class="alert alert-error" role="alert">{{ error }}</p>
    <div v-if="loading" class="panel empty-state">Chargement…</div>

    <form v-else class="panel form-panel" @submit.prevent="saveTicket">
      <div class="field">
        <label for="title">Titre *</label>
        <input id="title" v-model="form.title" required />
      </div>

      <div class="field">
        <label for="description">Description *</label>
        <textarea id="description" v-model="form.description" rows="4" required />
      </div>

      <div class="field">
        <label for="requester">Demandeur *</label>
        <input id="requester" v-model="form.requester" required />
      </div>

      <div class="two-columns">
        <div class="field">
          <label for="priority">Priorité</label>
          <select id="priority" v-model="form.priority">
            <option>Basse</option>
            <option>Moyenne</option>
            <option>Haute</option>
          </select>
        </div>

        <div v-if="isEdit" class="field">
          <label for="status">Statut</label>
          <select id="status" v-model="form.status">
            <option v-for="status in statuses" :key="status">{{ status }}</option>
          </select>
        </div>
        <div v-else class="field">
          <label>Statut initial</label>
          <div class="readonly-value">Ouvert</div>
        </div>
      </div>

      <div class="form-actions">
        <RouterLink to="/tickets" class="button button-light">Annuler</RouterLink>
        <button class="button button-primary" type="submit" :disabled="saving">
          <span v-if="saving">Enregistrement…</span>
          <span v-else-if="isEdit">Enregistrer</span>
          <span v-else>Créer le ticket</span>
        </button>
      </div>
    </form>
  </section>
</template>
