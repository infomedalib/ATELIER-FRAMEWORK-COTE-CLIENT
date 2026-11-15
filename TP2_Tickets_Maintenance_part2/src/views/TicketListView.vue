<script setup>
import { ref, computed, onMounted } from 'vue'
import { getTickets, deleteTicket, updateTicket } from '../services/ticketService'

const cycleStatuts = ['Ouvert', 'En cours', 'Résolu', 'Fermé']

const tickets = ref([])
const recherche = ref('')
const filtreStatut = ref('')
const filtrePriorite = ref('')
const messageErreur = ref('')
const chargement = ref(true)

async function chargerTickets() {
  chargement.value = true
  messageErreur.value = ''
  try {
    tickets.value = await getTickets()
  } catch (err) {
    messageErreur.value = "Impossible de contacter le serveur. Vérifiez que json-server est lancé (npm run server)."
  } finally {
    chargement.value = false
  }
}
onMounted(chargerTickets)

const ticketsFiltres = computed(() => {
  return tickets.value.filter((t) => {
    const correspondTitre = t.titre.toLowerCase().includes(recherche.value.toLowerCase())
    const correspondStatut = filtreStatut.value === '' || t.statut === filtreStatut.value
    const correspondPriorite = filtrePriorite.value === '' || t.priorite === filtrePriorite.value
    return correspondTitre && correspondStatut && correspondPriorite
  })
})

async function statutSuivant(ticket) {
  const indexActuel = cycleStatuts.indexOf(ticket.statut)
  const nouveauStatut = cycleStatuts[(indexActuel + 1) % cycleStatuts.length]
  try {
    await updateTicket(ticket.id, { statut: nouveauStatut })
    ticket.statut = nouveauStatut
  } catch (err) {
    messageErreur.value = "Erreur lors du changement de statut."
  }
}

async function supprimerTicket(ticket) {
  const confirmation = confirm(`Supprimer le ticket "${ticket.titre}" ?`)
  if (!confirmation) return
  try {
    await deleteTicket(ticket.id)
    tickets.value = tickets.value.filter((t) => t.id !== ticket.id)
  } catch (err) {
    messageErreur.value = "Erreur lors de la suppression."
  }
}
</script>

<template>
  <div>
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h2>Liste des tickets</h2>
      <RouterLink to="/tickets/nouveau"><button>+ Nouveau ticket</button></RouterLink>
    </div>

    <p v-if="messageErreur" class="erreur">{{ messageErreur }}</p>

    <input v-model="recherche" placeholder="Rechercher par titre..." />
    <div style="display:flex; gap:10px;">
      <select v-model="filtreStatut">
        <option value="">Tous les statuts</option>
        <option>Ouvert</option>
        <option>En cours</option>
        <option>Résolu</option>
        <option>Fermé</option>
      </select>
      <select v-model="filtrePriorite">
        <option value="">Toutes les priorités</option>
        <option>Basse</option>
        <option>Moyenne</option>
        <option>Haute</option>
      </select>
    </div>

    <p v-if="chargement">Chargement...</p>
    <p v-else-if="ticketsFiltres.length === 0">Aucun ticket trouvé.</p>

    <div v-for="ticket in ticketsFiltres" :key="ticket.id" class="carte">
      <h3>{{ ticket.titre }}</h3>
      <p>{{ ticket.description }}</p>
      <p>
        <span class="badge" :class="'priorite-' + ticket.priorite">{{ ticket.priorite }}</span>
        <span class="badge" :class="'statut-' + ticket.statut">{{ ticket.statut }}</span>
      </p>
      <RouterLink :to="`/tickets/${ticket.id}`">Voir le détail</RouterLink>
      <button @click="statutSuivant(ticket)">Changer le statut ▶</button>
      <button @click="supprimerTicket(ticket)">Supprimer</button>
    </div>
  </div>
</template>
