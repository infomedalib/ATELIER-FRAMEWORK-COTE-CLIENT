<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createTicket } from '../services/ticketService'

const router = useRouter()

const titre = ref('')
const description = ref('')
const demandeur = ref('')
const priorite = ref('Basse')

const messageErreur = ref('')
const enregistrement = ref(false)
const libelleBouton = computed(() =>
  enregistrement.value ? 'Enregistrement...' : 'Créer le ticket'
)

async function soumettreFormulaire() {
  if (!titre.value.trim() || !description.value.trim() || !demandeur.value.trim()) {
    messageErreur.value = "Les champs titre, description et demandeur sont obligatoires."
    return
  }

  enregistrement.value = true
  messageErreur.value = ''
  try {
    await createTicket({
      titre: titre.value,
      description: description.value,
      demandeur: demandeur.value,
      priorite: priorite.value
    })
    router.push('/tickets')
  } catch (err) {
    messageErreur.value = "Erreur lors de l'enregistrement du ticket."
  } finally {
    enregistrement.value = false
  }
}
</script>

<template>
  <div class="carte">
    <h2>Nouveau ticket</h2>
    <p v-if="messageErreur" class="erreur">{{ messageErreur }}</p>

    <form @submit.prevent="soumettreFormulaire">
      <label>Titre *</label>
      <input v-model="titre" />

      <label>Description *</label>
      <textarea v-model="description" rows="3"></textarea>

      <label>Demandeur *</label>
      <input v-model="demandeur" />

      <label>Priorité</label>
      <select v-model="priorite">
        <option>Basse</option>
        <option>Moyenne</option>
        <option>Haute</option>
      </select>

      <button type="submit" :disabled="enregistrement">
        {{ libelleBouton }}
      </button>
      <RouterLink to="/tickets"><button type="button">Annuler</button></RouterLink>
    </form>
  </div>
</template>
