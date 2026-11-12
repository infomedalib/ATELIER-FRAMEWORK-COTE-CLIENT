<script setup>
import { ref, computed, onMounted } from 'vue'
import { getTickets } from '../services/ticketService'

const tickets = ref([])
const recherche = ref('')
const filtreStatut = ref('Tous')
const filtrePriorite = ref('Toutes')
const chargement = ref(true)
const erreur = ref(null)

onMounted(async () => {
  try {
    const donnees = await getTickets()
    tickets.value = donnees
  } catch (e) {
    erreur.value = 'Erreur : impossible de contacter le serveur. Vérifiez que json-server est lancé.'
  } finally {
    chargement.value = false
  }
})

const filteredTickets = computed(() => {
  return tickets.value.filter(ticket => {
    const correspondRecherche = ticket.titre.toLowerCase().includes(recherche.value.toLowerCase())
    const correspondStatut = filtreStatut.value === 'Tous' || ticket.statut === filtreStatut.value
    const correspondPriorite = filtrePriorite.value === 'Toutes' || ticket.priorite === filtrePriorite.value
    return correspondRecherche && correspondStatut && correspondPriorite
  })
})

function classePriorite(p) {
  if (p === 'Haute') return 'priority-haute'
  if (p === 'Moyenne') return 'priority-moyenne'
  return 'priority-basse'
}

function classeStatut(s) {
  if (s === 'Ouvert') return 'status-ouvert'
  if (s === 'En cours') return 'status-en-cours'
  return 'status-resolu'
}
</script>

<template>
  <div class="container">
    <h1>Gestion des Tickets de Maintenance</h1>

    <div class="controls">
      <input
        v-model="recherche"
        type="text"
        placeholder="Rechercher par titre..."
        class="search-input"
      />
      <select v-model="filtreStatut" class="filter-select">
        <option value="Tous">Tous les statuts</option>
        <option value="Ouvert">Ouvert</option>
        <option value="En cours">En cours</option>
        <option value="Résolu">Résolu</option>
      </select>
      <select v-model="filtrePriorite" class="filter-select">
        <option value="Toutes">Toutes les priorités</option>
        <option value="Haute">Haute</option>
        <option value="Moyenne">Moyenne</option>
        <option value="Basse">Basse</option>
      </select>
    </div>

    <p v-if="chargement" class="loading">Chargement...</p>

    <p v-else-if="erreur" class="error">{{ erreur }}</p>

    <template v-else>
      <p class="counter">{{ filteredTickets.length }} ticket(s) affiché(s)</p>

      <p v-if="filteredTickets.length === 0" class="no-results">
        Aucun ticket ne correspond à votre recherche.
      </p>

      <div class="ticket-grid">
        <div v-for="ticket in filteredTickets" :key="ticket.id" class="ticket-card">
          <div class="card-header">
            <h2>{{ ticket.titre }}</h2>
            <div class="badges">
              <span :class="['badge', 'priority', classePriorite(ticket.priorite)]">
                {{ ticket.priorite }}
              </span>
              <span :class="['badge', 'status', classeStatut(ticket.statut)]">
                {{ ticket.statut }}
              </span>
            </div>
          </div>
          <p class="description">{{ ticket.description }}</p>
          <div class="card-footer">
            <span class="demandeur">👤 {{ ticket.demandeur }}</span>
            <span class="date">📅 {{ ticket.dateCreation }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  font-family: system-ui, sans-serif;
}

h1 {
  text-align: center;
  color: var(--text-h);
  margin-bottom: 24px;
}

.controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
  min-width: 200px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  color: #1f2937;
  background: #fff;
  color-scheme: light;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  color: #1f2937;
  background: #fff;
  color-scheme: light;
  cursor: pointer;
}

.counter {
  font-size: 14px;
  color: #4c1d95;
  background: #ede9fe;
  border-color: #c4b5fd;
  margin-bottom: 12px;
}

.loading {
  text-align: center;
  color: #666;
  font-size: 16px;
  padding: 40px;
}

.error {
  text-align: center;
  color: #dc2626;
  font-size: 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 16px;
}

.no-results {
  text-align: center;
  color: #888;
  padding: 32px;
  font-style: italic;
}

.ticket-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.ticket-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s;
}

.ticket-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.card-header h2 {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0;
  flex: 1;
}

.badges {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  white-space: nowrap;
}

.badge.priority.priority-haute { background: #fee2e2; color: #991b1b; }
.badge.priority.priority-moyenne { background: #ffedd5; color: #9a3412; }
.badge.priority.priority-basse { background: #d1fae5; color: #065f46; }

.badge.status.status-ouvert { background: #fee2e2; color: #991b1b; }
.badge.status.status-en-cours { background: #dbeafe; color: #1e40af; }
.badge.status.status-resolu { background: #d1fae5; color: #065f46; }

.description {
  font-size: 13px;
  color: #555;
  margin: 0 0 12px;
  line-height: 1.4;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
  border-top: 1px solid #f3f4f6;
  padding-top: 8px;
}
</style>
