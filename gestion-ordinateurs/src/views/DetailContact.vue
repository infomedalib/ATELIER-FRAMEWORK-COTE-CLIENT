<template>
  <div class="detail-contact">
    <h2>{{ isNew ? 'Nouveau contact' : 'Fiche contact — Modification' }}</h2>

    <div class="photo-zone">
      <img
        v-if="hasCustomPhoto"
        :src="form.photo"
        :alt="'Portrait de ' + form.prenom + ' ' + form.nom"
        class="photo-preview"
      />
      <span v-else class="photo-preview avatar-initiales" :style="{ background: form.couleur || '#dbeafe' }">{{
        initiales(form) }}</span>

      <p class="hint">
        Sur un appareil compatible, Caméra ouvre l’appareil photo. Sinon, choisissez une image dans la galerie.
      </p>
    </div>

    <form class="contact-form" novalidate @submit.prevent="enregistrer">
      <div class="champs-grille">
        <label>
          Nom *
          <input v-model.trim="form.nom" type="text" required />
        </label>

        <label>
          Prénom *
          <input v-model.trim="form.prenom" type="text" required />
        </label>

        <label>
          Téléphone *
          <input v-model.trim="form.telephone" type="tel" required />
        </label>

        <label>
          E-mail *
          <input v-model.trim="form.email" type="email" required />
        </label>
      </div>

      <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>

      <div class="actions-grille">
        <a :href="telephoneHref" class="btn-appeler">Appeler</a>
        <a :href="'mailto:' + form.email" class="btn-email">E-mail</a>
        <label class="btn-galerie file-btn">
          Galerie
          <input type="file" accept="image/*" @change="onFileChange" hidden />
        </label>
        <label class="btn-camera file-btn">
          Caméra
          <input type="file" accept="image/*" capture="environment" @change="onFileChange" hidden />
        </label>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-retour" @click="retour">Retour</button>
        <button type="submit" class="btn-enregistrer">Enregistrer</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useContacts } from '../composables/useContacts'

const router = useRouter()
const route = useRoute()
const { getContact, saveContact, newContact, initiales } = useContacts()

const isNew = computed(() => route.name === 'NouveauContact')
const telephoneHref = computed(() => `tel:${form.telephone.replace(/[^\d+]/g, '')}`)
const hasCustomPhoto = computed(() =>
  typeof form.photo === 'string' && form.photo.startsWith('data:image/'),
)

const existing = isNew.value ? null : getContact(route.params.id)
const form = reactive(existing ? { ...existing } : newContact())

const errorMessage = ref('')

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Veuillez choisir un fichier image.'
    return
  }
  if (file.size > 8 * 1024 * 1024) {
    errorMessage.value = 'La photo ne peut pas dépasser 8 Mo.'
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result !== 'string') {
      errorMessage.value = 'Impossible de lire cette image.'
      return
    }

    const image = new Image()
    image.onload = () => {
      const maxDimension = 640
      const scale = Math.min(1, maxDimension / image.width, maxDimension / image.height)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(image.width * scale)
      canvas.height = Math.round(image.height * scale)
      const context = canvas.getContext('2d')

      if (!context) {
        errorMessage.value = 'Impossible de préparer cette image.'
        return
      }

      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      form.photo = canvas.toDataURL('image/jpeg', 0.82)
      errorMessage.value = ''
    }
    image.onerror = () => {
      errorMessage.value = 'Impossible de charger cette image.'
    }
    image.src = reader.result
  }
  reader.onerror = () => {
    errorMessage.value = 'Impossible de lire cette image.'
  }
  reader.readAsDataURL(file)
}

function isEmailValide(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function enregistrer() {
  if (!form.nom || !form.prenom || !form.telephone || !form.email) {
    errorMessage.value = 'Tous les champs obligatoires doivent être remplis.'
    return
  }
  if (!isEmailValide(form.email)) {
    errorMessage.value = "L'adresse e-mail n'est pas valide."
    return
  }
  errorMessage.value = ''
  saveContact(form)
  router.push({ name: 'ListeContacts' })
}

function retour() {
  router.push({ name: 'ListeContacts' })
}

</script>

<style scoped>
.detail-contact h2 {
  margin: 0 0 12px;
  color: #1e293b;
  font-size: 18px;
  line-height: 22px;
}

.photo-zone {
  text-align: center;
  margin-bottom: 8px;
}

.photo-preview.avatar-initiales {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 24px;
  color: #1d4ed8;
  margin: 0 auto;
}

.file-btn {
  display: flex;
  cursor: pointer;
  color: white;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 5px;
}

.btn-galerie {
  background: #6652b8;
}

.btn-galerie:hover {
  background: #5845a5;
}

.btn-camera {
  background: #6652b8;
}

.btn-camera:hover {
  background: #5845a5;
}

.hint {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 10px;
}

.photo-preview {
  width: 94px;
  height: 94px;
  border-radius: 50%;
  object-fit: cover;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.champs-grille {
  display: grid;
  width: calc(100% - 9px);
  margin-left: 1px;
  grid-template-columns: 1fr 1fr;
  gap: 10px 19px;
}

.contact-form label {
  display: flex;
  flex-direction: column;
  font-size: 11px;
  font-weight: 600;
  color: #334155;
  gap: 3px;
}

.contact-form input {
  height: 27px;
  padding: 5px 7px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 400;
  color: #1e293b;
}

.contact-form input:focus {
  outline: 2px solid #3b82f6;
  outline-offset: -1px;
  border-color: #3b82f6;
}

.error {
  color: #e63946;
  font-size: 0.9rem;
  margin: 0;
}

.actions-grille {
  display: grid;
  margin-left: 2px;
  grid-template-columns: repeat(4, 1fr);
  gap: 11px;
}

.actions-grille a,
.actions-grille .file-btn {
  text-align: center;
  text-decoration: none;
  color: white;
  font-weight: 600;
  padding: 6px 8px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 11px;
  line-height: 16px;
}

.btn-appeler {
  background: #15966c;
}

.btn-appeler:hover {
  background: #117d59;
}

.btn-email {
  background: #2478d1;
}

.btn-email:hover {
  background: #1b65b2;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: -17px;
}

.btn-retour {
  width: 76px;
  padding: 3px 8px;
  border: 1px solid #dbe3ee;
  border-radius: 5px;
  background: #eef2f7;
  color: #334155;
  font-size: 11px;
  font-weight: 600;
  line-height: 15px;
}

.btn-retour:hover {
  background: #e2e8f0;
}

.btn-enregistrer {
  background: #16a34a;
  color: white;
  font-weight: 600;
  padding: 3px 11px;
  border-radius: 5px;
  font-size: 11px;
  line-height: 15px;
  width: 107px;
}

.btn-enregistrer:hover {
  background: #15803d;
}

@media (max-width: 480px) {
  .champs-grille,
  .actions-grille {
    grid-template-columns: 1fr;
  }
}
</style>
