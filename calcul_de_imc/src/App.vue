<script setup lang="ts">
import { computed, ref } from 'vue'

const poids = ref('')
const taille = ref('')
const afficherResultat = ref(false)

const imc = computed(() => {
  const kg = Number(poids.value)
  const metres = Number(taille.value) / 100

  if (
    !Number.isFinite(kg) ||
    !Number.isFinite(metres) ||
    kg <= 0 ||
    metres <= 0
  ) {
    return null
  }

  return kg / (metres * metres)
})

const categorie = computed(() => {
  if (imc.value === null) return ''

  if (imc.value < 18.5) {
    return 'Insuffisance pondérale'
  }

  if (imc.value < 25) {
    return 'Corpulence normale'
  }

  if (imc.value < 30) {
    return 'Surpoids'
  }

  return 'Obésité'
})

const explication = computed(() => {
  if (imc.value === null) return ''

  if (imc.value < 18.5) {
    return 'Votre IMC est inférieur à la plage habituelle.'
  }

  if (imc.value < 25) {
    return 'Votre IMC se situe dans la plage habituelle.'
  }

  if (imc.value < 30) {
    return 'Votre IMC se situe dans la plage du surpoids.'
  }

  return 'Votre IMC se situe dans la plage de l’obésité.'
})

function calculer() {
  afficherResultat.value = imc.value !== null
}

function reinitialiser() {
  poids.value = ''
  taille.value = ''
  afficherResultat.value = false
}
</script>

<template>
  <main class="page">
    <section class="card">
      <div class="icon">♥</div>

      <h1>Calculateur d’IMC</h1>

      <p class="intro">
        Saisissez votre poids et votre taille pour calculer votre indice de masse corporelle.
      </p>

      <form @submit.prevent="calculer">
        <div class="fields">
          <label class="poids-label">
            Poids
            <span class="unit">en kilogrammes</span>

            <input
              v-model="poids"
              type="number"
              inputmode="decimal"
              min="1"
              max="500"
              step="any"
              required
              placeholder="Ex. 70"
              @input="afficherResultat = false"
            >
          </label>

          <label class="taille-label">
            Taille
            <span class="unit">en centimètres</span>

            <input
              v-model="taille"
              type="number"
              inputmode="decimal"
              min="50"
              max="250"
              step="any"
              required
              placeholder="Ex. 175"
              @input="afficherResultat = false"
            >
          </label>
        </div>

        <div class="buttons">
          <button class="primary" type="submit">
            Calculer mon IMC
          </button>

          <button
            class="secondary"
            type="button"
            @click="reinitialiser"
          >
            Effacer
          </button>
        </div>
      </form>

      <div
        v-if="afficherResultat"
        class="result"
        role="status"
        aria-live="polite"
      >
        <span class="result-label">Votre IMC</span>

        <strong class="number">
          {{ imc?.toFixed(1).replace('.', ',') }}
        </strong>

        <span class="category">
          {{ categorie }}
        </span>

        <p>
          {{ explication }}
        </p>
      </div>

    
    </section>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #eef4f8;
}

.card {
  width: min(90%, 500px);
  padding: 30px;
  border-radius: 18px;
  background: white;
  box-shadow: 0 10px 30px #0002;
}

.icon {
  font-size: 40px;
  color: #13846b;
  text-align: center;
}

h1 {
  text-align: center;
  color: #172238;
}

.intro {
  color: #607080;
  text-align: center;
}

.fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
  font-weight: bold;
}

.poids-label {
  color: #2563eb;
}

.taille-label {
  color: #2563eb;
}

.unit {
  color: #607080;
  font-size: 14px;
  font-weight: normal;
}

input {
  padding: 12px;
  color: black;
  border: 1px solid #bbc9d0;
  border-radius: 8px;
}

input:focus {
  outline: none;
  border-color: #13846b;
}

.buttons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

button {
  flex: 1;
  padding: 12px;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
}

.primary {
  background: #13846b;
  color: white;
}

.secondary {
  background: #dfe6e9;
  color: #172238;
}

.result {
  margin-top: 24px;
  padding: 20px;
  text-align: center;
  background: #e9f7f2;
  border-radius: 10px;
}

.result-label {
  display: block;
  color: #607080;
}

.number {
  display: block;
  font-size: 36px;
  color: #0c765d;
}

.category {
  display: block;
  margin-top: 8px;
  font-size: 20px;
  font-weight: bold;
  color: #172238;
}

.result p {
  color: #607080;
}



@media (max-width: 480px) {
  .fields {
    grid-template-columns: 1fr;
  }
}
</style>