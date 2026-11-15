import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000
})

export async function getTickets() {
  return (await api.get('/tickets')).data
}

export async function getTicket(id) {
  return (await api.get(`/tickets/${id}`)).data
}

export async function createTicket(data) {
  return (await api.post('/tickets', data)).data
}

export async function updateTicket(id, data) {
  return (await api.put(`/tickets/${id}`, data)).data
}

export async function deleteTicket(id) {
  return (await api.delete(`/tickets/${id}`)).data
}
