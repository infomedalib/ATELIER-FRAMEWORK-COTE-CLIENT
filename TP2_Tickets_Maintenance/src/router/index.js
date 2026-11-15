import { createRouter, createWebHashHistory } from 'vue-router'
import TicketList from '../views/TicketList.vue'
import TicketForm from '../views/TicketForm.vue'
import TicketDetail from '../views/TicketDetail.vue'

const routes = [
  { path: '/', redirect: '/tickets' },
  { path: '/tickets', name: 'tickets', component: TicketList },
  { path: '/tickets/nouveau', name: 'ticket-new', component: TicketForm },
  {
    path: '/tickets/:id',
    name: 'ticket-detail',
    component: TicketDetail,
    props: true
  },
  { path: '/:pathMatch(.*)*', redirect: '/tickets' }
]

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})
