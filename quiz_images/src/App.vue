<script setup>
import { ref, computed } from 'vue'

const imagePath = (filename) => new URL(`../images/${filename}`, import.meta.url).href

const questions = [
  {
    texte: 'Combien de côtés possède la forme de l’image ?',
    image: imagePath('triangle.svg'),
    choix: ['3 côtés', '4 côtés', '5 côtés'],
    bonneReponse: 0,
    descriptionImage: 'Un triangle violet sur fond bleu clair'
  },
  {
    texte: 'Quelle est cette forme dont les 4 côtés sont égaux ?',
    image: imagePath('carre.svg'),
    choix: ['Un rectangle', 'Un carré', 'Un cercle'],
    bonneReponse: 1,
    descriptionImage: 'Un carré vert sur fond vert clair'
  },
  {
    texte: 'Quelle forme n’a aucun sommet ni côté droit ?',
    image: imagePath('cercle.svg'),
    choix: ['Un triangle', 'Une étoile', 'Un cercle'],
    bonneReponse: 2,
    descriptionImage: 'Un cercle orange sur fond crème'
  },
  {
    texte: 'Combien de branches (pointes) a cette étoile ?',
    image: imagePath('etoile.svg'),
    choix: ['4 pointes', '5 pointes', '6 pointes'],
    bonneReponse: 1,
    descriptionImage: 'Une étoile jaune à cinq branches'
  },
  {
    texte: 'Comment s’appelle cette forme aux côtés opposés égaux, plus longue que haute ?',
    image: imagePath('rectangle.svg'),
    choix: ['Un rectangle', 'Un carré', 'Un triangle'],
    bonneReponse: 0,
    descriptionImage: 'Un rectangle rose, plus large que haut'
  }
]

const indexQuestion = ref(0)
const score = ref(0)
const reponseChoisie = ref(null)
const termine = ref(false)

const totalQuestions = questions.length
const questionCourante = computed(() => questions[indexQuestion.value])
const aRepondu = computed(() => reponseChoisie.value !== null)
const estDerniereQuestion = computed(() => indexQuestion.value === totalQuestions - 1)
const reponsesDonnees = computed(() => indexQuestion.value + (aRepondu.value ? 1 : 0))

const estCorrecte = computed(
  () => aRepondu.value && reponseChoisie.value === questionCourante.value.bonneReponse
)

function repondre(indiceChoix) {
  if (aRepondu.value || termine.value) return

  reponseChoisie.value = indiceChoix
  if (indiceChoix === questionCourante.value.bonneReponse) {
    score.value++
  }
}

function avancer() {
  if (!aRepondu.value) return

  if (estDerniereQuestion.value) {
    termine.value = true
  } else {
    indexQuestion.value++
    reponseChoisie.value = null
  }
}

function rejouer() {
  indexQuestion.value = 0
  score.value = 0
  reponseChoisie.value = null
  termine.value = false
}

function classeChoix(i) {
  if (!aRepondu.value) return ''
  if (i === questionCourante.value.bonneReponse) return 'juste'
  if (i === reponseChoisie.value) return 'faux'
  return ''
}

function symboleChoix(i) {
  const c = classeChoix(i)
  return c === 'juste' ? '✔ ' : c === 'faux' ? '✘ ' : ''
}
</script>

<template>
  <main class="app">
    <header class="bandeau">
      <h1>Quiz en images</h1>
      <p class="score" aria-live="polite">Score : {{ score }} / {{ totalQuestions }}</p>
    </header>

    <div class="progression">
      <progress :value="reponsesDonnees" :max="totalQuestions"></progress>
      <span>{{ reponsesDonnees }} / {{ totalQuestions }} réponse(s)</span>
    </div>

    <section v-if="!termine" class="carte">
      <p class="numero">Question {{ indexQuestion + 1 }} sur {{ totalQuestions }}</p>

      <img
        class="illustration"
        :src="questionCourante.image"
        :alt="questionCourante.descriptionImage"
      />

      <h2>{{ questionCourante.texte }}</h2>

      <div class="choix">
        <button
          v-for="(choix, i) in questionCourante.choix"
          :key="i"
          type="button"
          :class="['bouton-choix', classeChoix(i)]"
          :disabled="aRepondu"
          @click="repondre(i)"
        >
          {{ symboleChoix(i) }}{{ choix }}
        </button>
      </div>

      <p
        v-if="aRepondu"
        :class="['retour', estCorrecte ? 'juste' : 'faux']"
        role="status"
      >
        <template v-if="estCorrecte">✔ Bonne réponse ! +1 point</template>
        <template v-else>
          ✘ Réponse fausse. La bonne réponse était :
          {{ questionCourante.choix[questionCourante.bonneReponse] }}
        </template>
      </p>

      <button
        v-if="aRepondu"
        type="button"
        class="bouton-action"
        @click="avancer"
      >
        {{ estDerniereQuestion ? 'Voir le résultat' : 'Question suivante' }}
      </button>
    </section>

    <section v-else class="carte resultat">
      <h2>Quiz terminé !</h2>
      <p class="score-final">{{ score }} / {{ totalQuestions }}</p>
      <p>
        <template v-if="score === totalQuestions">Parfait, tout est juste !</template>
        <template v-else-if="score >= 3">Bien joué !</template>
        <template v-else>Courage, retentez votre chance.</template>
      </p>
      <button type="button" class="bouton-action" @click="rejouer">Rejouer</button>
    </section>
  </main>
</template>

<style>
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  background: #f3f4f6;
  color: #111827;
}
</style>

<style scoped>
.app { max-width: 640px; margin: 0 auto; padding: 1rem; }

.bandeau {
  display: flex; justify-content: space-between; align-items: center;
  gap: 1rem; flex-wrap: wrap;
}
.bandeau h1 { font-size: 1.5rem; margin: 0; }
.score {
  margin: 0; padding: .35rem .8rem; border-radius: 999px;
  background: #4f46e5; color: #fff; font-weight: 700;
}

.progression { display: flex; align-items: center; gap: .75rem; margin: 1rem 0; }
.progression progress { flex: 1; height: 14px; }
.progression span { font-size: .85rem; white-space: nowrap; }

.carte {
  background: #fff; border-radius: 12px; padding: 1.25rem;
  box-shadow: 0 2px 8px rgb(0 0 0 / .1);
}
.numero { margin: 0 0 .75rem; font-weight: 600; color: #4b5563; }

.illustration {
  display: block; width: 100%; max-height: 260px;
  object-fit: contain; border-radius: 8px; background: #f9fafb;
}
h2 { font-size: 1.15rem; margin: 1rem 0; }

.choix { display: grid; gap: .6rem; }
.bouton-choix {
  padding: .8rem 1rem; font-size: 1rem; text-align: left; cursor: pointer;
  border: 2px solid #c7d2fe; border-radius: 8px; background: #fff;
}
.bouton-choix:hover:not(:disabled) { background: #eef2ff; }
.bouton-choix:disabled { cursor: not-allowed; opacity: .9; }
.bouton-choix.juste { border-color: #059669; background: #d1fae5; font-weight: 700; }
.bouton-choix.faux  { border-color: #dc2626; background: #fee2e2; font-weight: 700; }

.retour { margin: 1rem 0 0; padding: .7rem; border-radius: 8px; font-weight: 600; }
.retour.juste { background: #d1fae5; color: #065f46; }
.retour.faux  { background: #fee2e2; color: #991b1b; }

.bouton-action {
  margin-top: 1rem; width: 100%; padding: .85rem; font-size: 1rem; font-weight: 700;
  color: #fff; background: #4f46e5; border: 0; border-radius: 8px; cursor: pointer;
}
.bouton-action:hover { background: #4338ca; }

.resultat { text-align: center; }
.score-final { font-size: 3rem; font-weight: 800; margin: .5rem 0; color: #4f46e5; }

@media (min-width: 600px) {
  .choix { grid-template-columns: repeat(3, 1fr); }
  .bouton-action { width: auto; min-width: 220px; }
}
</style>