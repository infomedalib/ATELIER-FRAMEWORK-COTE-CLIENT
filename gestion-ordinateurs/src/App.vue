
<script setup>
import { ref, computed, onMounted } from 'vue'

const CLE = 'ordinateurs'

const exemples = [
  {
    id: 1,
    modele: 'Dell XPS 15',
    processeur: 'Intel Core i7',
    memoire: 16,
    disque: 512,
    carteGraphique: 'NVIDIA RTX 4050',
    photo: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    modele: 'MacBook Pro',
    processeur: 'Apple M3',
    memoire: 16,
    disque: 512,
    carteGraphique: 'Apple GPU',
    photo: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    modele: 'HP Pavilion',
    processeur: 'Intel Core i5',
    memoire: 8,
    disque: 256,
    carteGraphique: 'Intel Iris Xe',
    photo: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    modele: 'Lenovo ThinkPad',
    processeur: 'AMD Ryzen 7',
    memoire: 16,
    disque: 1024,
    carteGraphique: 'AMD Radeon',
    photo: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    modele: 'ASUS ROG',
    processeur: 'Intel Core i9',
    memoire: 32,
    disque: 1024,
    carteGraphique: 'NVIDIA RTX 4070',
    photo: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80'
  }
]

const ordinateurs = ref([])
const recherche = ref('')
const triMemoire = ref(false)
const afficherFormulaire = ref(false)
const idModification = ref(null)
const erreur = ref('')

const formulaire = ref(creerFormulaireVide())

function creerFormulaireVide() {
  return {
    modele: '',
    processeur: '',
    memoire: 8,
    disque: 256,
    carteGraphique: '',
    photo: ''
  }
}

onMounted(() => {
  const donnees = localStorage.getItem(CLE)

  if (donnees !== null) {
    try {
      ordinateurs.value = JSON.parse(donnees)
    } catch {
      ordinateurs.value = [...exemples]
      sauvegarder()
    }
  } else {
    ordinateurs.value = [...exemples]
    sauvegarder()
  }
})

function sauvegarder() {
  localStorage.setItem(CLE, JSON.stringify(ordinateurs.value))
}

const listeFiltree = computed(() => {
  const texte = recherche.value.trim().toLowerCase()

  const resultat = ordinateurs.value.filter(pc =>
    pc.modele.toLowerCase().includes(texte) ||
    pc.processeur.toLowerCase().includes(texte)
  )

  if (triMemoire.value) {
    return [...resultat].sort((a, b) => b.memoire - a.memoire)
  }

  return resultat
})

function ajouterOrdinateur() {
  idModification.value = null
  formulaire.value = creerFormulaireVide()
  erreur.value = ''
  afficherFormulaire.value = true
}

function modifierOrdinateur(pc) {
  idModification.value = pc.id
  formulaire.value = { ...pc }
  erreur.value = ''
  afficherFormulaire.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function enregistrer() {
  erreur.value = ''

  if (!formulaire.value.modele.trim()) {
    erreur.value = 'Le modèle est obligatoire.'
    return
  }

  if (!formulaire.value.processeur.trim()) {
    erreur.value = 'Le processeur est obligatoire.'
    return
  }

  if (Number(formulaire.value.memoire) <= 0) {
    erreur.value = 'La mémoire doit être strictement positive.'
    return
  }

  if (Number(formulaire.value.disque) <= 0) {
    erreur.value = 'La capacité du disque doit être strictement positive.'
    return
  }

  const pc = {
    id: idModification.value ?? Date.now(),
    modele: formulaire.value.modele.trim(),
    processeur: formulaire.value.processeur.trim(),
    memoire: Number(formulaire.value.memoire),
    disque: Number(formulaire.value.disque),
    carteGraphique: formulaire.value.carteGraphique.trim() || 'Non spécifiée',
    photo: formulaire.value.photo.trim() ||
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'
  }

  if (idModification.value !== null) {
    const index = ordinateurs.value.findIndex(item => item.id === idModification.value)

    if (index !== -1) {
      ordinateurs.value[index] = pc
    }
  } else {
    ordinateurs.value.push(pc)
  }

  sauvegarder()
  afficherFormulaire.value = false
  idModification.value = null
  formulaire.value = creerFormulaireVide()
}

function annuler() {
  afficherFormulaire.value = false
  idModification.value = null
  erreur.value = ''
  formulaire.value = creerFormulaireVide()
}

function supprimerOrdinateur(pc) {
  if (confirm(`Voulez-vous supprimer l'ordinateur "${pc.modele}" ?`)) {
    ordinateurs.value = ordinateurs.value.filter(item => item.id !== pc.id)
    sauvegarder()
  }
}
</script>

<template>
  <div class="application">
    <header class="entete">
      <div class="marque">
        <span class="logo">PC</span>
        <span>Gestion des ordinateurs</span>
      </div>

      <button class="bouton bouton-principal" @click="ajouterOrdinateur">
        + Ajouter un ordinateur
      </button>
    </header>

    <main class="contenu">
      <section class="introduction">
        <p class="surtitre">INVENTAIRE INFORMATIQUE</p>
        <h1>Liste des ordinateurs</h1>
        <p class="description">
          Consultez les ordinateurs et gérez leurs caractéristiques.
        </p>
      </section>

      <section class="statistiques">
        <div class="statistique">
          <span class="stat-icone">▣</span>
          <div>
            <p>Nombre d'ordinateurs</p>
            <strong>{{ ordinateurs.length }}</strong>
          </div>
        </div>

        <div class="statistique">
          <span class="stat-icone violet">▤</span>
          <div>
            <p>Mémoire RAM totale</p>
            <strong>
              {{ ordinateurs.reduce((total, pc) => total + Number(pc.memoire), 0) }} Go
            </strong>
          </div>
        </div>

        <div class="statistique">
          <span class="stat-icone orange">▱</span>
          <div>
            <p>Stockage total</p>
            <strong>
              {{ ordinateurs.reduce((total, pc) => total + Number(pc.disque), 0) }} Go
            </strong>
          </div>
        </div>
      </section>

      <section v-if="afficherFormulaire" class="panneau-formulaire">
        <div class="titre-formulaire">
          <div>
            <p class="surtitre">
              {{ idModification !== null ? 'MODIFICATION' : 'NOUVEL ORDINATEUR' }}
            </p>
            <h2>
              {{ idModification !== null ? 'Modifier un ordinateur' : 'Ajouter un ordinateur' }}
            </h2>
          </div>
          <button class="fermer" @click="annuler" aria-label="Fermer">×</button>
        </div>

        <p v-if="erreur" class="erreur">{{ erreur }}</p>

        <form @submit.prevent="enregistrer" class="formulaire">
          <label>
            Modèle <span class="obligatoire">*</span>
            <input
              v-model="formulaire.modele"
              type="text"
              placeholder="Ex. Dell XPS 15"
              required
            />
          </label>

          <label>
            Processeur <span class="obligatoire">*</span>
            <input
              v-model="formulaire.processeur"
              type="text"
              placeholder="Ex. Intel Core i7"
              required
            />
          </label>

          <label>
            Mémoire RAM (Go) <span class="obligatoire">*</span>
            <input
              v-model.number="formulaire.memoire"
              type="number"
              min="1"
              required
            />
          </label>

          <label>
            Capacité du disque (Go) <span class="obligatoire">*</span>
            <input
              v-model.number="formulaire.disque"
              type="number"
              min="1"
              required
            />
          </label>

          <label>
            Carte graphique
            <input
              v-model="formulaire.carteGraphique"
              type="text"
              placeholder="Ex. NVIDIA RTX 4060"
            />
          </label>

          <label>
            Photo (URL)
            <input
              v-model="formulaire.photo"
              type="url"
              placeholder="https://exemple.com/photo.jpg"
            />
          </label>

          <div class="actions-formulaire">
            <button type="button" class="bouton bouton-secondaire" @click="annuler">
              Annuler
            </button>
            <button type="submit" class="bouton bouton-principal">
              Enregistrer
            </button>
          </div>
        </form>
      </section>

      <section class="section-liste">
        <div class="titre-liste">
          <div>
            <h2>Les ordinateurs</h2>
            <p>Les caractéristiques de chaque appareil.</p>
          </div>
          <span class="compteur">{{ listeFiltree.length }} résultat(s)</span>
        </div>

        <div class="barre-outils">
          <div class="recherche">
            <span>⌕</span>
            <input
              v-model="recherche"
              type="search"
              placeholder="Rechercher par modèle ou processeur..."
            />
          </div>

          <button
            class="bouton bouton-secondaire"
            :class="{ selectionne: triMemoire }"
            @click="triMemoire = !triMemoire"
          >
            ↕ {{ triMemoire ? 'RAM décroissante' : 'Trier par RAM' }}
          </button>
        </div>

        <div v-if="listeFiltree.length > 0" class="grille">
          <article v-for="pc in listeFiltree" :key="pc.id" class="carte">
            <div class="image-ordinateur">
              <img :src="pc.photo" :alt="pc.modele" />
              <span class="etiquette">Ordinateur</span>
            </div>

            <div class="corps-carte">
              <h3>{{ pc.modele }}</h3>
              <p class="processeur">{{ pc.processeur }}</p>

              <div class="caracteristiques">
                <div class="caracteristique">
                  <span class="petit-icone">▤</span>
                  <div>
                    <small>Mémoire RAM</small>
                    <strong>{{ pc.memoire }} Go</strong>
                  </div>
                </div>

                <div class="caracteristique">
                  <span class="petit-icone">▱</span>
                  <div>
                    <small>Disque</small>
                    <strong>{{ pc.disque }} Go</strong>
                  </div>
                </div>
              </div>

              <div class="carte-graphique">
                <small>Carte graphique</small>
                <strong>{{ pc.carteGraphique }}</strong>
              </div>

              <div class="actions-carte">
                <button class="bouton bouton-modifier" @click="modifierOrdinateur(pc)">
                  ✎ Modifier
                </button>
                <button class="bouton bouton-supprimer" @click="supprimerOrdinateur(pc)">
                  Supprimer
                </button>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="vide">
          <h3>Aucun ordinateur trouvé</h3>
          <p>Essayez une autre recherche ou ajoutez un ordinateur.</p>
          <button class="bouton bouton-principal" @click="ajouterOrdinateur">
            + Ajouter un ordinateur
          </button>
        </div>
      </section>
    </main>

    <footer class="pied">
      Gestion du parc informatique · Vue.js 3
    </footer>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f5f6fb;
  color: #262640;
  font-family: Arial, Helvetica, sans-serif;
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

.application {
  min-height: 100vh;
}

.entete {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 18px 7%;
  background: white;
  border-bottom: 1px solid #e9eaf2;
}

.marque {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 700;
}

.logo {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  color: white;
  background: #6558df;
  font-size: 13px;
}

.bouton {
  padding: 11px 15px;
  border: 0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  transition: 0.2s;
}

.bouton:hover {
  filter: brightness(0.96);
}

.bouton-principal {
  color: white;
  background: #6558df;
}

.bouton-secondaire {
  color: #4d4d69;
  background: white;
  border: 1px solid #dedfeb;
}

.selectionne {
  color: #6558df;
  background: #eeecff;
  border-color: #6558df;
}

.contenu {
  width: min(1200px, 88%);
  margin: auto;
}

.introduction {
  padding: 42px 0 25px;
}

.surtitre {
  margin: 0 0 10px;
  color: #6558df;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.introduction h1 {
  margin: 0;
  font-size: clamp(27px, 4vw, 38px);
  letter-spacing: -1px;
}

.description {
  margin: 12px 0 0;
  color: #7d7e96;
  font-size: 14px;
  line-height: 1.7;
}

.statistiques {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 17px;
  margin-bottom: 40px;
}

.statistique {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  background: white;
  border: 1px solid #e9eaf2;
  border-radius: 13px;
}

.stat-icone {
  display: grid;
  place-items: center;
  width: 45px;
  height: 45px;
  flex-shrink: 0;
  border-radius: 12px;
  color: #6558df;
  background: #efedff;
  font-size: 22px;
}

.stat-icone.violet {
  color: #3486d9;
  background: #e9f3ff;
}

.stat-icone.orange {
  color: #dc8b3c;
  background: #fff1e2;
}

.statistique p {
  margin: 0 0 7px;
  color: #85869b;
  font-size: 12px;
}

.statistique strong {
  font-size: 22px;
}

.section-liste {
  padding-bottom: 45px;
}

.titre-liste {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.titre-liste h2,
.titre-formulaire h2 {
  margin: 0;
  font-size: 23px;
}

.titre-liste p {
  margin: 8px 0 0;
  color: #85869b;
  font-size: 13px;
}

.compteur {
  padding: 8px 11px;
  border-radius: 8px;
  color: #6558df;
  background: #eeecff;
  font-size: 12px;
  font-weight: 700;
}

.barre-outils {
  display: flex;
  gap: 12px;
  margin: 22px 0;
}

.recherche {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 0 13px;
  background: white;
  border: 1px solid #e2e3ed;
  border-radius: 9px;
}

.recherche span {
  color: #777992;
  font-size: 24px;
}

.recherche input {
  width: 100%;
  min-width: 0;
  height: 44px;
  border: 0;
  outline: none;
  background: transparent;
  font-size: 12px;
}

.grille {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.carte {
  overflow: hidden;
  border: 1px solid #e9eaf2;
  border-radius: 13px;
  background: white;
  transition: transform 0.2s, box-shadow 0.2s;
}

.carte:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px #2520440d;
}

.image-ordinateur {
  height: 185px;
  position: relative;
  overflow: hidden;
  background: #e9eaf2;
}

.image-ordinateur img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.etiquette {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 6px 9px;
  border-radius: 6px;
  color: #4d4d69;
  background: white;
  font-size: 10px;
  font-weight: 700;
}

.corps-carte {
  padding: 17px;
}

.corps-carte h3 {
  margin: 0;
  font-size: 17px;
}

.processeur {
  margin: 7px 0 0;
  color: #85869b;
  font-size: 12px;
}

.caracteristiques {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
  margin-top: 18px;
}

.caracteristique {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 11px 8px;
  border-radius: 8px;
  background: #f7f7fb;
  min-width: 0;
}

.petit-icone {
  color: #6558df;
  font-size: 18px;
}

.caracteristique small,
.caracteristique strong,
.carte-graphique small,
.carte-graphique strong {
  display: block;
}

.caracteristique small,
.carte-graphique small {
  margin-bottom: 5px;
  color: #85869b;
  font-size: 10px;
}

.caracteristique strong {
  font-size: 12px;
}

.carte-graphique {
  margin-top: 15px;
  padding-top: 13px;
  border-top: 1px solid #eeeeF5;
}

.carte-graphique strong {
  overflow-wrap: anywhere;
  font-size: 12px;
}

.actions-carte {
  display: flex;
  gap: 8px;
  margin-top: 17px;
}

.actions-carte .bouton {
  flex: 1;
  padding: 10px 6px;
  font-size: 11px;
}

.bouton-modifier {
  color: #6558df;
  background: #eeecff;
}

.bouton-supprimer {
  color: #cf4658;
  background: #fff0f1;
}

.panneau-formulaire {
  margin-bottom: 35px;
  padding: 25px;
  background: white;
  border: 1px solid #e5e5ef;
  border-radius: 13px;
  box-shadow: 0 8px 25px #29204408;
}

.titre-formulaire {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 22px;
}

.titre-formulaire h2 {
  margin-top: 8px;
}

.fermer {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 8px;
  background: #f0f0f7;
  color: #44445c;
  font-size: 24px;
}

.formulaire {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 17px;
}

.formulaire label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #45455e;
  font-size: 12px;
  font-weight: 700;
}

.obligatoire {
  color: #cf4658;
}

.formulaire input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dedfeb;
  border-radius: 8px;
  outline: none;
  background: white;
  color: #262640;
  font-size: 13px;
}

.formulaire input:focus {
  border-color: #6558df;
  box-shadow: 0 0 0 3px #6558df19;
}

.actions-formulaire {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 5px;
}

.erreur {
  margin-bottom: 18px;
  padding: 12px;
  border-radius: 8px;
  color: #b72f43;
  background: #fff0f1;
  font-size: 13px;
}

.vide {
  padding: 50px 20px;
  border: 1px dashed #d9d9e7;
  border-radius: 12px;
  background: white;
  text-align: center;
}

.vide h3 {
  margin-top: 0;
}

.vide p {
  margin-bottom: 20px;
  color: #85869b;
  font-size: 13px;
}

.pied {
  padding: 22px;
  border-top: 1px solid #e9eaf2;
  background: white;
  color: #85869b;
  text-align: center;
  font-size: 12px;
}

@media (max-width: 900px) {
  .grille {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .statistiques {
    gap: 10px;
  }

  .statistique {
    padding: 13px;
  }
}

@media (max-width: 600px) {
  .entete {
    align-items: flex-start;
    padding: 15px 5%;
  }

  .marque {
    font-size: 14px;
  }

  .entete .bouton {
    max-width: 145px;
    font-size: 11px;
  }

  .contenu {
    width: 90%;
  }

  .introduction {
    padding-top: 30px;
  }

  .statistiques,
  .grille,
  .formulaire {
    grid-template-columns: 1fr;
  }

  .statistiques {
    margin-bottom: 30px;
  }

  .barre-outils {
    flex-direction: column;
  }

  .titre-liste {
    align-items: flex-start;
  }

  .panneau-formulaire {
    padding: 17px;
  }

  .actions-formulaire {
    grid-column: auto;
    flex-direction: column-reverse;
  }
}
</style>
