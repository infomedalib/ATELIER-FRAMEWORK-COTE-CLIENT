<script setup lang="ts">
import { computed, ref } from 'vue'

interface Tache {
  id: number
  texte: string
  terminee: boolean
}

const nouvelleTache = ref('')

const taches = ref<Tache[]>([
  {
    id: 1,
    texte: 'Réviser Vue',
    terminee: false
  },
  {
    id: 2,
    texte: 'Préparer le TP',
    terminee: false
  }
])

const tachesRestantes = computed(() => {
  return taches.value.filter(tache => !tache.terminee).length
})

function ajouterTache() {
  const texte = nouvelleTache.value.trim()

  if (texte === '') {
    return
  }

  taches.value.push({
    id: Date.now(),
    texte: texte,
    terminee: false
  })

  nouvelleTache.value = ''
}

function supprimerTache(id: number) {
  taches.value = taches.value.filter(tache => tache.id !== id)
}
</script>

<template>
  <main class="page">
    <section class="card">
      <h1>Liste des tâches</h1>

      <p class="intro">
        Gérez facilement vos tâches.
      </p>

      <form @submit.prevent="ajouterTache" class="form">
        <input
          v-model="nouvelleTache"
          type="text"
          placeholder="Ajouter une tâche..."
        >

        <button type="submit">
          Ajouter
        </button>
      </form>

      <p class="compteur">
        Tâches restantes : <strong>{{ tachesRestantes }}</strong>
      </p>

      <div v-if="taches.length === 0" class="vide">
        Aucune tâche pour le moment.
      </div>

      <ul v-else class="liste">
        <li
          v-for="tache in taches"
          :key="tache.id"
          :class="{ terminee: tache.terminee }"
        >
          <label>
            <input
              v-model="tache.terminee"
              type="checkbox"
            >

            <span>{{ tache.texte }}</span>
          </label>

          <button
            class="supprimer"
            @click="supprimerTache(tache.id)"
          >
            Supprimer
          </button>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eef4f8;
  padding: 20px;
}

.card {
  width: 500px;
  max-width: 100%;
  padding: 30px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 10px 30px #0002;
}

h1 {
  margin: 0;
  text-align: center;
  color: #172238;
}

.intro {
  text-align: center;
  color: #607080;
}

.form {
  display: flex;
  gap: 10px;
  margin-top: 25px;
}

.form input {
  flex: 1;
  padding: 12px;
  border: 1px solid #bbc9d0;
  border-radius: 8px;
  font-size: 16px;
}

.form button {
  padding: 12px 18px;
  border: none;
  border-radius: 8px;
  background: #13846b;
  color: white;
  cursor: pointer;
}

.compteur {
  margin-top: 25px;
  padding: 12px;
  background: #e9f7f2;
  border-radius: 8px;
  color: #0c765d;
}

.liste {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.liste li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 14px;
  margin-bottom: 10px;
  background: #f5f7f8;
  border-radius: 8px;
}

.liste label {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #172238;
}

.liste input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.terminee span {
  text-decoration: line-through;
  color: #888;
}

.supprimer {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: #dc3545;
  color: white;
  cursor: pointer;
}

.vide {
  margin-top: 25px;
  padding: 20px;
  text-align: center;
  color: #607080;
  background: #f5f7f8;
  border-radius: 8px;
}

@media (max-width: 500px) {
  .form {
    flex-direction: column;
  }

  .liste li {
    flex-direction: column;
    align-items: stretch;
  }

  .supprimer {
    width: 100%;
  }
}
</style>