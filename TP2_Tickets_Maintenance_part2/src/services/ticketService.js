import axios from 'axios'

const API_URL = 'http://localhost:3000/tickets'

export async function getTickets() {
  const reponse = await axios.get(API_URL)
  return reponse.data
}

export async function getTicket(id) {
  const reponse = await axios.get(`${API_URL}/${id}`)
  return reponse.data
}

export async function createTicket(data) {
  const nouveauTicket = {
    ...data,
    statut: 'Ouvert',
    dateCreation: new Date().toISOString().slice(0, 10)
  }
  const reponse = await axios.post(API_URL, nouveauTicket)
  return reponse.data
}

export async function updateTicket(id, data) {
  const reponse = await axios.patch(`${API_URL}/${id}`, data)
  return reponse.data
}

export async function deleteTicket(id) {
  await axios.delete(`${API_URL}/${id}`)
}
