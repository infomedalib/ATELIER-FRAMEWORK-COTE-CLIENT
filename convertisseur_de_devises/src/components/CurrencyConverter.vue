<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { devises, taux } from '../data/taux.js'

const montant = ref('0')
const deviseSource = ref('USD')
const deviseCible = ref('EUR')
const resultat = ref('')
const erreur = ref(false)
const touches = ['7', '8', '9', '4', '5', '6', '1', '2', '3', 'C', '0', '.']

function appuyer(touche) {
  erreur.value = false

  if (touche === 'C') {
    montant.value = '0'
    resultat.value = ''
    return
  }

  if (touche === '.') {
    if (montant.value.includes('.') || montant.value.length >= 10) return
    montant.value = montant.value === '0' ? '0.' : `${montant.value}.`
  } else if (montant.value === '0') {
    montant.value = touche
  } else if (montant.value.length < 10) {
    montant.value += touche
  } else {
    return
  }

  resultat.value = ''
}

function convertir() {
  const valeur = Number(montant.value)

  if (!Number.isFinite(valeur) || valeur === 0) {
    resultat.value = ''
    erreur.value = true
    return
  }

  resultat.value = ((valeur / taux[deviseSource.value]) * taux[deviseCible.value]).toFixed(2)
  erreur.value = false
}

function inverser() {
  const sourcePrecedente = deviseSource.value
  deviseSource.value = deviseCible.value
  deviseCible.value = sourcePrecedente

  if (resultat.value) convertir()
}

function reinitialiserResultat() {
  resultat.value = ''
  erreur.value = false
}

function gererClavier(event) {
  if (event.ctrlKey || event.metaKey || event.altKey) return

  if (/^[0-9.]$/.test(event.key)) {
    event.preventDefault()
    appuyer(event.key)
  } else if (event.key.toLowerCase() === 'c' || event.key === 'Backspace' || event.key === 'Escape') {
    event.preventDefault()
    appuyer('C')
  } else if (event.key === 'Enter') {
    event.preventDefault()
    convertir()
  }
}

onMounted(() => window.addEventListener('keydown', gererClavier))
onUnmounted(() => window.removeEventListener('keydown', gererClavier))
</script>

<template>
  <section class="converter" aria-labelledby="converter-title">
    <div class="display-panel">
      <div class="display-topline">
        <span class="eyebrow">CHANGE · 01</span>
        <span class="live-mark" aria-hidden="true"></span>
      </div>
      <h1 id="converter-title">Currency <span>Converter</span></h1>

      <div class="currency-row">
        <label class="currency-select-wrap" for="source-currency">
          <span class="sr-only">Devise source</span>
          <select id="source-currency" v-model="deviseSource" @change="reinitialiserResultat">
            <option v-for="devise in devises" :key="devise" :value="devise">{{ devise }}</option>
          </select>
        </label>
        <div class="amount-wrap">
          <span class="field-label">MONTANT</span>
          <div class="amount-value" aria-live="polite">{{ montant }}</div>
        </div>
      </div>

      <div class="swap-row">
        <span class="swap-rule"></span>
        <button class="swap-button" type="button" aria-label="Inverser les devises" title="Inverser les devises" @click="inverser">⇅</button>
      </div>

      <div class="currency-row target-row">
        <label class="currency-select-wrap" for="target-currency">
          <span class="sr-only">Devise cible</span>
          <select id="target-currency" v-model="deviseCible" @change="reinitialiserResultat">
            <option v-for="devise in devises" :key="devise" :value="devise">{{ devise }}</option>
          </select>
        </label>
        <div class="amount-wrap result-wrap">
          <span class="field-label">RÉSULTAT</span>
          <div class="amount-value result-value" aria-live="polite">{{ resultat || '—' }}</div>
        </div>
      </div>

      <button class="convert-button" type="button" @click="convertir">
        Convertir <span aria-hidden="true">↗</span>
      </button>
      <p v-if="erreur" class="error-message" role="alert">Veuillez saisir un montant</p>
    </div>

    <div class="keypad-panel" aria-label="Clavier numérique">
      <div class="keypad-heading">
        <span>SAISIR UN MONTANT</span>
        <span>EUR · TAUX FIXES</span>
      </div>
      <div class="keypad">
        <button
          v-for="touche in touches"
          :key="touche"
          class="key"
          :class="{ 'key-clear': touche === 'C' }"
          :aria-label="touche === 'C' ? 'Effacer le montant' : touche"
          type="button"
          @click="appuyer(touche)"
        >
          {{ touche }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.converter {
  width: min(100%, 360px);
  overflow: hidden;
  background: #fffefa;
  border: 1px solid rgba(21, 59, 74, 0.08);
  border-radius: 8px;
  box-shadow: 0 24px 60px rgba(21, 59, 74, 0.15);
  animation: arrive 420ms ease-out both;
}

.display-panel {
  min-height: 360px;
  padding: 23px 24px 21px;
  background: #2bb8e8;
  color: #fff;
}

.display-topline,
.keypad-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.eyebrow,
.field-label,
.keypad-heading {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0;
}

.eyebrow {
  color: rgba(255, 255, 255, 0.77);
}

.live-mark {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.19);
}

h1 {
  margin: 10px 0 24px;
  font-size: 25px;
  font-weight: 600;
  line-height: 1.1;
}

h1 span {
  font-weight: 400;
}

.currency-row {
  display: flex;
  min-height: 74px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.currency-select-wrap {
  position: relative;
  display: inline-flex;
  flex: 0 0 100px;
  align-items: center;
}

.currency-select-wrap::after {
  position: absolute;
  right: 12px;
  color: rgba(255, 255, 255, 0.8);
  content: '⌄';
  pointer-events: none;
}

select {
  width: 100%;
  height: 42px;
  appearance: none;
  padding: 0 30px 0 13px;
  border: 1px solid rgba(255, 255, 255, 0.38);
  border-radius: 4px;
  background: rgba(9, 91, 121, 0.16);
  color: #fff;
  cursor: pointer;
  font-family: 'Space Mono', monospace;
  font-size: 14px;
  font-weight: 700;
}

select option {
  background: #fffefa;
  color: #153b4a;
}

.amount-wrap {
  min-width: 0;
  flex: 1;
  text-align: right;
}

.field-label {
  display: block;
  margin-bottom: 2px;
  color: rgba(255, 255, 255, 0.76);
}

.amount-value {
  min-height: 52px;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.55);
  font-family: 'Space Mono', monospace;
  font-size: 39px;
  font-variant-numeric: tabular-nums;
  line-height: 1.28;
  text-overflow: clip;
  white-space: nowrap;
}

.result-value {
  color: #fff;
}

.swap-row {
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.swap-rule {
  height: 1px;
  flex: 1;
  background: rgba(255, 255, 255, 0.32);
}

.swap-button {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
  transition: transform 160ms ease, background-color 160ms ease;
}

.swap-button:hover {
  transform: rotate(180deg);
  background: rgba(255, 255, 255, 0.26);
}

.convert-button {
  display: flex;
  width: 100%;
  height: 43px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin-top: 17px;
  border: 0;
  border-radius: 4px;
  background: #fffefa;
  color: #12617c;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition: transform 150ms ease, box-shadow 150ms ease;
}

.convert-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 14px rgba(9, 91, 121, 0.18);
}

.convert-button span {
  font-size: 18px;
}

.error-message {
  margin: 8px 0 0;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
}

.keypad-panel {
  padding: 17px 24px 19px;
  background: #fffefa;
}

.keypad-heading {
  margin-bottom: 9px;
  color: #779198;
  font-size: 9px;
}

.keypad {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(4, 48px);
  gap: 2px 8px;
}

.key {
  display: grid;
  min-width: 0;
  place-items: center;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: #1ba6c9;
  cursor: pointer;
  font-family: 'Space Mono', monospace;
  font-size: 24px;
  font-weight: 700;
  transition: background-color 130ms ease, transform 130ms ease;
}

.key:hover {
  transform: scale(1.04);
  background: #edf8fa;
}

.key:active {
  transform: scale(0.96);
}

.key-clear {
  color: #f0727a;
  font-size: 17px;
}

.key-clear:hover {
  background: #fff0ef;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  clip-path: inset(50%);
}

@keyframes arrive {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 380px) {
  .currency-select-wrap {
    flex-basis: 92px;
  }

  .amount-value {
    font-size: 30px;
  }

  .display-panel {
    padding-right: 20px;
    padding-left: 20px;
  }

  .keypad-panel {
    padding-right: 20px;
    padding-left: 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>