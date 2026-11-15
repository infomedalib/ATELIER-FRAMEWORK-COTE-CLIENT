# TP 2 — CRUD, navigation et suivi des tickets

Application de suivi des tickets de maintenance réalisée avec **Vue.js 3**, **Vite**, **Vue Router**, **Axios** et **JSON Server**.

## 1. Prérequis

- Node.js (version 18 ou supérieure recommandée)
- npm
- Visual Studio Code (ou un autre éditeur)

## 2. Installation

Ouvrir un terminal dans le dossier du projet puis exécuter :

```bash
npm install
```

## 3. Lancement

Il faut lancer **deux terminaux** dans le dossier du projet.

**Terminal 1 — API JSON Server :**

```bash
npm run server
```

L'API est disponible sur `http://localhost:3000`. Les tickets sont stockés dans `db.json`.

**Terminal 2 — application Vue :**

```bash
npm run dev
```

Ouvrir l'adresse affichée par Vite, généralement `http://localhost:5173`.

Pour vérifier la compilation de production :

```bash
npm run build
```

## 4. Fonctionnalités réalisées

- Affichage des tickets depuis `GET /tickets`.
- Création avec `POST /tickets`. Le statut est initialisé automatiquement à **Ouvert** et la date à la date du jour.
- Modification avec `PUT /tickets/:id`.
- Suppression avec `DELETE /tickets/:id`, après confirmation.
- Changement rapide du statut : Ouvert → En cours → Résolu → Fermé → Ouvert.
- Détail d'un ticket via `/tickets/:id`.
- Formulaire de création via `/tickets/nouveau`.
- Recherche sur le titre, la description et le demandeur.
- Filtrage par statut et priorité.
- Validation des champs obligatoires : titre, description et demandeur.
- Bouton désactivé pendant l'enregistrement pour éviter les doubles soumissions.
- Messages d'erreur si l'API est indisponible ou si le ticket n'existe pas.

## 5. Routes

| URL | Rôle |
|---|---|
| `/tickets` | Liste, recherche et filtres |
| `/tickets/nouveau` | Création d'un ticket |
| `/tickets/:id` | Détail du ticket |
| `/tickets/:id?edit=1` | Formulaire de modification |

## 6. Organisation des fichiers

```text
TP2_Tickets_Maintenance/
├── db.json
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── captures/
│   └── README.md
└── src/
    ├── App.vue
    ├── main.js
    ├── style.css
    ├── router/
    │   └── index.js
    ├── services/
    │   └── ticketService.js
    ├── utils/
    │   └── format.js
    └── views/
        ├── TicketList.vue
        ├── TicketForm.vue
        └── TicketDetail.vue
```

## 7. Questions demandées

### Différence entre POST, PUT et PATCH

- **POST** crée une nouvelle ressource. Ici, `POST /tickets` ajoute un ticket.
- **PUT** remplace les données d'une ressource existante. Ici, `PUT /tickets/:id` enregistre les informations complètes du ticket modifié.
- **PATCH** modifie seulement une partie d'une ressource. Il serait adapté, par exemple, pour changer uniquement le statut.

### Pourquoi demander une confirmation avant DELETE ?

La suppression est une opération destructive. La confirmation évite une suppression accidentelle et donne à l'utilisateur la possibilité d'annuler son choix.

### Quel est le rôle de Vue Router ?

Vue Router gère la navigation entre les pages de l'application sans recharger toute la page. Il associe chaque URL à un composant : liste, création ou détail/édition.

### Comment éviter les doublons lors de l'enregistrement ?

Le bouton de soumission est désactivé pendant l'appel réseau grâce à l'état `submitting`. La fonction vérifie aussi cet état avant d'envoyer une nouvelle requête. Cela limite les doubles clics.

## 8. Scénario de validation du TP

1. Ouvrir `/tickets/nouveau`.
2. Créer le ticket **Clavier défectueux**, description « Certaines touches ne répondent plus », demandeur « Votre nom », priorité **Haute**.
3. Vérifier que le ticket apparaît dans la liste et dans `db.json`, avec le statut **Ouvert**.
4. Ouvrir le ticket, modifier sa priorité et son statut, puis enregistrer.
5. Actualiser la page et vérifier que les changements persistent.
6. Ouvrir directement `/tickets/ID` pour consulter le détail.
7. Supprimer le ticket et confirmer la suppression.
8. Arrêter JSON Server et vérifier que le message d'erreur réseau apparaît.

## 9. Captures d'écran obligatoires

Le dossier `captures/` contient la liste et la procédure des 7 captures à réaliser depuis l'application en fonctionnement. Les captures doivent être prises sur votre propre navigateur après avoir lancé Vue et JSON Server ; elles ne sont pas remplacées par des images décoratives.

## 10. Difficultés rencontrées — exemple à personnaliser

- Comprendre la différence entre les méthodes HTTP utilisées par une API REST.
- Gérer les erreurs réseau avec `try/catch`.
- Synchroniser l'interface avec les données après chaque opération CRUD.
- Configurer Vue Router pour afficher les pages selon l'URL.

**À personnaliser avant le rendu :** ajouter votre nom/prénom, vos éventuelles difficultés réelles et vos 7 captures d'écran.
