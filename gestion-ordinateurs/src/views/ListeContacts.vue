<template>
  <div class="liste-contacts">
    <div class="toolbar">
      <h2>Liste des contacts</h2>
      <button class="btn-ajouter" @click="ajouter">+ Ajouter</button>
    </div>

    <ul class="contact-list">
      <li v-for="contact in contacts" :key="contact.id" class="contact-card">
        <img
          v-if="photoPersonnalisee(contact.photo)"
          :src="contact.photo"
          :alt="'Photo de ' + contact.prenom + ' ' + contact.nom"
          class="contact-photo"
        />
        <span
          v-else
          class="avatar-initiales"
          :style="{ background: contact.couleur || '#dbeafe' }"
          aria-hidden="true"
        >{{ initiale(contact) }}</span>

        <div class="contact-infos">
          <strong>{{ contact.nom }} {{ contact.prenom }}</strong>
          <span class="tel">{{ contact.telephone }}</span>
        </div>
        <button class="btn-modifier" :aria-label="'Modifier ' + contact.prenom + ' ' + contact.nom" @click="modifier(contact.id)">
          Modifier
        </button>
      </li>
    </ul>

    <p v-if="contacts.length === 0" class="empty">Aucun contact pour le moment.</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useContacts } from '../composables/useContacts'

const router = useRouter()
const { contacts } = useContacts()

function photoPersonnalisee(photo) {
  return typeof photo === 'string' && photo.startsWith('data:image/')
}

function initiale(contact) {
  const prenom = contact.prenom?.trim()
  const nom = contact.nom?.trim()
  return (prenom || nom || '?').charAt(0).toUpperCase()
}

function modifier(id) {
  router.push({ name: 'DetailContact', params: { id } })
}

function ajouter() {
  router.push({ name: 'NouveauContact' })
}
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.toolbar h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #1e293b;
}

.btn-ajouter {
  background: #16a34a;
  color: white;
  font-weight: 600;
  padding: 7px 12px;
  border-radius: 6px;
  font-size: 12px;
}

.btn-ajouter:hover {
  background: #15803d;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 10px;
}

.avatar-initiales {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  flex-shrink: 0;
}

.contact-photo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.avatar-initiales {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  color: #334155;
}

.contact-infos {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contact-infos strong {
  font-size: 0.9rem;
  color: #1e293b;
}

.tel {
  color: #64748b;
  font-size: 0.8rem;
}

.btn-modifier {
  background: #eef2ff;
  color: #4338ca;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #e0e7ff;
  font-size: 11px;
}

.btn-modifier:hover {
  background: #e0e7ff;
}

.empty {
  color: #888;
  text-align: center;
  margin-top: 30px;
}

@media (max-width: 380px) {
  .contact-card {
    gap: 7px;
    padding: 8px;
  }

  .avatar-initiales,
  .contact-photo {
    width: 42px;
    height: 42px;
  }

  .btn-modifier {
    padding: 5px 8px;
  }
}
</style>
