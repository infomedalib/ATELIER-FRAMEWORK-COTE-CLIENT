import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
})

export async function getTickets() {
  const response = await api.get('/tickets')
  return response.data
}
