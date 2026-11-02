import { reactive } from 'vue'
// Couleurs pastel pour les avatars à initiales (comme dans la maquette)
const AVATAR_COLORS = ['#dbeafe', '#fce7f3', '#dcfce7', '#fef9c3', '#ede9fe', '#ffedd5']

// Palette initiale de contacts (maquette : initiales + couleurs pastel)
function couleurPour(i) {
  return AVATAR_COLORS[i % AVATAR_COLORS.length]
}

const CONTACTS_INITIAUX = [
  { id: 1, nom: 'Ben Ali', prenom: 'Ahmed', telephone: '22 345 678', email: 'ahmed.benali@example.com' },
  { id: 2, nom: 'Trabelsi', prenom: 'Sarra', telephone: '98 765 432', email: 'sarra.trabelsi@mail.com' },
  { id: 3, nom: 'Gharbi', prenom: 'Mohamed', telephone: '55 234 567', email: 'mohamed.gharbi@mail.com' },
  { id: 4, nom: 'Jaziri', prenom: 'Ines', telephone: '29 456 123', email: 'ines.jaziri@mail.com' },
  { id: 5, nom: 'Mansour', prenom: 'Youssef', telephone: '25 678 901', email: 'youssef.mansour@mail.com' },
]

function contactsParDefaut() {
  return CONTACTS_INITIAUX.map((contact, index) => ({
    ...contact,
    couleur: couleurPour(index),
  }))
}

function chargerContacts() {
  const contactsParId = new Map(contactsParDefaut().map(contact => [contact.id, contact]))

  try {
    const saved = localStorage.getItem('contacts')
    if (!saved) return [...contactsParId.values()]

    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed)) {
      throw new TypeError('Les contacts sauvegardés doivent être une liste.')
    }

    const contacts = parsed
      .filter(contact => contact && Number.isFinite(Number(contact.id)))
      .map(contact => {
        const id = Number(contact.id)
        const initial = contactsParId.get(id)
        return {
          ...initial,
          ...contact,
          id,
          photo: typeof contact.photo === 'string' && contact.photo.startsWith('data:image/')
            ? contact.photo
            : '',
          couleur: contact.couleur || initial?.couleur || couleurPour(id - 1),
        }
      })

    const idsExistants = new Set(contacts.map(contact => contact.id))
    for (const contact of contactsParId.values()) {
      if (!idsExistants.has(contact.id)) contacts.push(contact)
    }
    return contacts
  } catch (error) {
    console.warn('Impossible de charger les contacts sauvegardés. Les exemples sont rétablis.', error)
    return [...contactsParId.values()]
  }
}

const state = reactive({ contacts: chargerContacts() })

function persist() {
  try {
    localStorage.setItem('contacts', JSON.stringify(state.contacts))
  } catch (error) {
    console.warn('Impossible de sauvegarder les contacts dans le navigateur.', error)
  }
}

// Initiales affichées dans l'avatar (prénom + nom, ex. "AB", comme la maquette)
function initiales(contact) {
  const i = ((contact.prenom?.[0] || '') + (contact.nom?.[0] || '')).toUpperCase()
  return i || 'NC'
}

export function useContacts() {
  function getContact(id) {
    return state.contacts.find(c => c.id === Number(id))
  }

  function saveContact(updated) {
    const index = state.contacts.findIndex(c => c.id === updated.id)
    if (index !== -1) {
      state.contacts[index] = { ...state.contacts[index], ...updated }
    } else {
      const newId = state.contacts.length
        ? Math.max(...state.contacts.map(c => c.id)) + 1
        : 1
      state.contacts.push({
        ...updated,
        id: newId,
        couleur: updated.couleur || couleurPour(newId),
      })
    }
    persist()
  }

  function deleteContact(id) {
    const index = state.contacts.findIndex(c => c.id === Number(id))
    if (index !== -1) state.contacts.splice(index, 1)
    persist()
  }

  function newContact() {
    return { id: null, nom: '', prenom: '', telephone: '', email: '', photo: '', couleur: '' }
  }

  return { contacts: state.contacts, getContact, saveContact, deleteContact, newContact, initiales }
}
