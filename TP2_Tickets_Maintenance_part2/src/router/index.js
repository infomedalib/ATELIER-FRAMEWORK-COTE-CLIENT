import { createRouter, createWebHistory } from 'vue-router'
import TicketListView from '../views/TicketListView.vue'
import TicketFormView from '../views/TicketFormView.vue'
import TicketDetailView from '../views/TicketDetailView.vue'

const routes = [
  { path: '/', redirect: '/tickets' },
  { path: '/tickets', name: 'liste', component: TicketListView },
  { path: '/tickets/nouveau', name: 'nouveau', component: TicketFormView },
  { path: '/tickets/:id', name: 'detail', component: TicketDetailView, props: true }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
