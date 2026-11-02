import { reactive } from 'vue'
// Couleurs pastel pour les avatars à initiales (comme dans la maquette)
const AVATAR_COLORS = ['#dbeafe', '#fce7f3', '#dcfce7', '#fef9c3', '#ede9fe', '#ffedd5']

// Placeholder photos (colored circles) for initial contacts
const PLACEHOLDER_PHOTOS = [
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAABkElEQVR4nO3d0RWDMAxD0ey/FIN0GLpAoXHiWAo8HQ1g38MvTjtJd5p6gJ1iinV8TsMosY7PYN+CNQzkANc2NZKotd2NKtXak5hWk7XnMa0jS8aS6yz1SsOSoxSQ5WDJLWq8ZrHkBJVkU1jyzYu9xrHkO9d7DWLJt5V4jWDJ91R5hbHkGwq9Yljy3bReASz5VnKvXiz5Pg5eXVjyTUy8wErFku/g4/UHSz69lRdYSVjyud28LrHkExt6gTWNJZ/VoWBlY8mn9ClYYEmw5PO5FSywirHkk3kWLLDAcsSSz+RcsMACS16wwAJLXrDAKsCST+NfvqyAFFhggQXWNgROLLDAKsPC60oKLLAqsfD6KQVWBhZePwNWBtabva7Cn6y9UmClYr3N6z7cdeiVAmsB1hu8esKVo14p7mcFpLjMFtudm3+LsZ7hNRDulJZg7es1HG4rF2JtRDYf7sEHwksDgfCGRSC8jhII7+4EwotOgfBWWCC8QhcI7xvuj3Va5gvBWr9kQ8PRcQAAAABJRU5ErkJggg==',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAABmElEQVR4nO3dwQ3DMAxDUe+/aAfotUC6QJNatizSySc0gPiQa+R2kO409QI7xRTr83offlFifV7vsXkK1jCQA1zb1Eii1nY3qlRrd2JaTdbux7SOLBlLrrPUKw1LjlJAloMlt6jxmsWSE1SSTWHJmxd7jWPJO9d7DWLJ20q8RrDkPVVeYSx5Q6FXDEveTesVwJK3knv1Ysn7OHh1YcmbmHiBlYol7+Dj9QdLvr2VF1hJWPK93bxOseQbG3qBNY0l39VhwMrGkm/pM2CBJcGS7+c2YIFVjCXfzHPAAgssRyz5Ts4DFlhgyQcssMCSD1hgFWDJt/EfvqyAFFhggQXWNgMWWGDJB6wJLLyupcACCyw7LLwupMACqwwLrzMpsMCqxMLrpxRYGVh4/TQBKwPryV5nIPzJ2isFVirW07yuKbjr0CsF1gKsJ3j1IHDlqFeK+1kBKS6zrbzMdjOvaHGuSa7H2t1rrDIXcKuwdvSaKcvV7kC4Bx8ILw0EwhsWgfA6SiC8uxMILzoFwlthgfAKXSC8b7g/1mGZL0rMdobVdccZAAAAAElFTkSuQmCC',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAABmElEQVR4nO3dwQ3DMAxDUe8/Y+9dokC6QJNatizSySc0gPiQa+R2kO409QI7xRTr9XkfflFivT7vsXkK1jCQA1zb1Eii1nY3qlRrd2JaTdbux7SOLBlLrrPUKw1LjlJAloMlt6jxmsWSE1SSTWHJmxd7jWPJO9d7DWLJ20q8RrDkPVVeYSx5Q6FXDEveTesVwJK3knv1Ysn7OHh1YcmbmHiBlYol7+Dj9QdLvr2VF1hJWPK93bxOseQbG3qBNY0l39VhwMrGkm/pM2CBJcGS7+c2YIFVjCXfzHPAAgssRyz5Ts4DFlhgyQcssMCSD1hgFWDJt/EfvqyAFFhggQXWNgMWWGDJB6wJLLyupcACCyw7LLwupMACqwwLrzMpsMCqxMLrpxRYGVh4/TQBKwPryV5nIPzJ2isFVirW07yuKbjr0CsF1gKsJ3j1IHDlqFeK+1kBKS6zrbzMdjOvaHGuSa7H2t1rrDIXcKuwdvSaKcvV7kC4Bx8ILw0EwhsWgfA6SiC8uxMILzoFwlthgfAKXSC8b7g/1mGZL2S+7k6INpjmAAAAAElFTkSuQmCC',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAABl0lEQVR4nO3dwRHDIAxEUfpvK1XlEqeB2EEgtIv9d1SA9o2vFu0g3WnqBXaKKdb79Tn8osR6vz5j8xSsYSAHuLapkUSt7W5UqdbuxLSarN2PaR1ZMpZcZ6lXGpYcpYAsB0tuUeM1iyUnqCSbwpI3L/Yax5J3rvcaxJK3lXiNYMl7qrzCWPKGQq8Ylryb1iuAJW8l9+rFkvdx8OrCkjcx8QIrFUvewcfrD5Z8eysvsJKw5Hu7eZ1iyTc29AJrGku+q8OAlY0l39JnwAJLgiXfz23AAqsYS76Z54AFFliOWPKdnAcssMCSD1hggSUfsMAqwJJv4z98WQEpsMACC6xtBiywwJIPWBNYeF1LgQUWWHZYeF1IgQVWGRZeZ1JggVWJhddPKbAysPD6aQJWBtaTvc5A+JO1VwqsVKyneV1TcNehVwqsBVhP8OpB4MpRrxT3swJSXGZbeZntZl7R4lyTXI+1u9dYZS7gVmHt6DVTlqvdgXAPPhBeGgiENywC4XWUQHh3JxBedAqEt8IC4RW6QHjfcH+swzJfuwthbccHXDoAAAAASUVORK5CYII=',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAABl0lEQVR4nO3dwRHDIAxEUfrvNIe0EKeB2EEgtIv9d1SA9o2vFu0g3WnqBXaKKdb79Tn8osR6vz5j8xSsYSAHuLapkUSt7W5UqdbuxLSarN2PaR1ZMpZcZ6lXGpYcpYAsB0tuUeM1iyUnqCSbwpI3L/Yax5J3rvcaxJK3lXiNYMl7qrzCWPKGQq8Ylryb1iuAJW8l9+rFkvdx8OrCkjcx8QIrFUvewcfrD5Z8eysvsJKw5Hu7eZ1iyTc29AJrGku+q8OAlY0l39JnwAJLgiXfz23AAqsYS76Z54AFFliOWPKdnAcssMCSD1hggSUfsMAqwJJv4z98WQEpsMACC6xtBiywwJIPWBNYeF1LgQUWWHZYeF1IgQVWGRZeZ1JggVWJhddPKbAysPD6aQJWBtaTvc5A+JO1VwqsVKyneV1TcNehVwqsBVhP8OpB4MpRrxT3swJSXGZbeZntZl7R4lyTXI+1u9dYZS7gVmHt6DVTlqvdgXAPPhBeGgiENywC4XWUQHh3JxBedAqEt8IC4RW6QHjfcH+swzJfSEk+LJfpFrgAAAAASUVORK5CYII=',
]

// Palette initiale de contacts (maquette : initiales + couleurs pastel + photos)
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
    photo: PLACEHOLDER_PHOTOS[index] || '',
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
            : (initial?.photo || ''),
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
  const prenom = contact?.prenom?.trim() || ''
  const nom = contact?.nom?.trim() || ''
  const i = `${prenom.charAt(0) || ''}${nom.charAt(0) || ''}`.toUpperCase()
  return i || 'NC'
}

export function useContacts() {
  function getContact(id) {
    const normalizedId = Number(id)
    return state.contacts.find(c => c.id === normalizedId) ?? null
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
