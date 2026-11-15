export function formatDate(value) {
  if (!value) return '—'

  const date = new Date(`${value}T00:00:00`)
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(date)
}

export function errorMessage(error) {
  if (error.response?.status === 404) return 'Ce ticket n’existe pas ou a été supprimé.'

  if (error.code === 'ECONNABORTED' || !error.response) {
    return 'Impossible de contacter le serveur. Vérifiez que JSON Server fonctionne sur le port 3000.'
  }

  return error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
}
