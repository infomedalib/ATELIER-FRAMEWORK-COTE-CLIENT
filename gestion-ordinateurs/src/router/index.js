import { createRouter, createWebHashHistory } from 'vue-router'
import { useContacts } from '../composables/useContacts'
import ListeContacts from '../views/ListeContacts.vue'
import DetailContact from '../views/DetailContact.vue'

function contactExists(to) {
  const { getContact } = useContacts()
  return getContact(to.params.id) ? true : { name: 'ListeContacts' }
}

const routes = [
  { path: '/', name: 'ListeContacts', component: ListeContacts },
  { path: '/contact/nouveau', name: 'NouveauContact', component: DetailContact },
  { path: '/contact/:id', name: 'DetailContact', component: DetailContact, props: true, beforeEnter: contactExists },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
