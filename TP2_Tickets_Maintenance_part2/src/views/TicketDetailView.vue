<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getTicket, updateTicket, deleteTicket } from '../services/ticketService'

const props = defineProps(['id'])
const router = useRouter()

const ticket = ref(null)
const introuvable = ref(false)
const messageErreur = ref('')
const modeEdition = ref(false)
const enregistrement = ref(false)

const formulaire = ref({})

async function chargerTicket() {
  try {
    ticket.value = await getTicket(props.id)
    formulaire.value = { ...ticket.value }
  } catch (err) {
    introuvable.value = true
  }
}
onMounted(chargerTicket)

async function enregistrerModifications() {
  if (!formulaire.value.titre.trim() || !formulaire.value.description.trim() || !formulaire.value.demandeur.trim()) {
    messageErreur.value = "Les champs titre, description et demandeur sont obligatoires."
    return
  }
  enregistrement.value = true
  messageErreur.value = ''
  try {
    const miseAJour = await updateTicket(props.id, formulaire.value)
    ticket.value = miseAJour
    modeEdition.value = false
  } catch (err) {
    messageErreur.value = "Erreur lors de la modification."
  } finally {
    enregistrement.value = false
  }
}

async function supprimerCeTicket() {
  const confirmation = confirm(`Supprimer le ticket "${ticket.value.titre}" ?`)
  if (!confirmation) return
  try {
    await deleteTicket(props.id)
    router.push('/tickets')
  } catch (err) {
    messageErreur.value = "Erreur lors de la suppression."
  }
}
</script>

<template>
  <div>
    <p v-if="introuvable" class="erreur">
      Aucun ticket trouvé avec l'identifiant "{{ id }}".
      <RouterLink to="/tickets">Retour à la liste</RouterLink>
    </p>

    <div v-else-if="ticket" class="carte">
      <p v-if="messageErreur" class="erreur">{{ messageErreur }}</p>

      <div v-if="!modeEdition">
        <h2>{{ ticket.titre }}</h2>
        <p><strong>Description :</strong> {{ ticket.description }}</p>
        <p><strong>Demandeur :</strong> {{ ticket.demandeur }}</p>
        <p><strong>Priorité :</strong> {{ ticket.priorite }}</p>
        <p><strong>Statut :</strong> {{ ticket.statut }}</p>
        <p><strong>Date de création :</strong> {{ ticket.dateCreation }}</p>

        <button @click="modeEdition = true">Modifier</button>
        <button @click="supprimerCeTicket">Supprimer</button>
        <RouterLink to="/tickets"><button type="button">Retour à la liste</button></RouterLink>
      </div>

      <form v-else @submit.prevent="enregistrerModifications">
        <label>Titre *</label>
        <input v-model="formulaire.titre" />

        <label>Description *</label>
        <textarea v-model="formulaire.description" rows="3"></textarea>

        <label>Demandeur *</label>
        <input v-model="formulaire.demandeur" />

        <label>Priorité</label>
        <select v-model="formulaire.priorite">
          <option>Basse</option>
          <option>Moyenne</option>
          <option>Haute</option>
        </select>

        <label>Statut</label>
        <select v-model="formulaire.statut">
          <option>Ouvert</option>
          <option>En cours</option>
          <option>Résolu</option>
          <option>Fermé</option>
        </select>

        <button type="submit" :disabled="enregistrement">
          Enregistrer
        </button>
        <button type="button" @click="modeEdition = false">Annuler</button>
      </form>
    </div>
  </div>
</template>
