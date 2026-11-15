# TP2 — Tickets de Maintenance (Vue 3 + Vite + Axios + JSON Server)

**Auteur :** Dali — Développement Web et Multimédia

## Installation

```bash
npm install
```

## Lancement

Il faut **2 terminaux** ouverts en même temps :

```bash
# Terminal 1 : l'API simulée (db.json)
npm run server

# Terminal 2 : l'application Vue
npm run dev
```

Puis ouvrir http://localhost:5173

## Fonctionnalités réalisées

- Liste des tickets avec recherche par titre et filtres (statut, priorité)
- Création d'un ticket (formulaire validé) → `POST /tickets`
- Modification d'un ticket depuis la page détail → `PATCH /tickets/:id`
- Changement rapide du statut depuis la liste (Ouvert → En cours → Résolu → Fermé)
- Suppression avec boîte de confirmation → `DELETE /tickets/:id`
- Navigation avec Vue Router : `/tickets`, `/tickets/nouveau`, `/tickets/:id`
- Message "ticket introuvable" si l'id n'existe pas (404)
- Gestion des erreurs réseau avec try/catch (message affiché si JSON Server est arrêté)
- Bouton désactivé pendant l'enregistrement (anti double-clic)

## Réponses aux questions du TP

**Différence entre POST, PUT et PATCH ?**
POST crée une nouvelle ressource. PUT remplace entièrement une ressource existante (il faut renvoyer tous les champs). PATCH ne modifie que les champs envoyés, les autres restent inchangés — c'est pour ça qu'on utilise PATCH ici pour modifier un ticket.

**Pourquoi une confirmation avant DELETE ?**
Parce que la suppression est irréversible : la boîte de confirmation (`confirm()`) évite de perdre un ticket par un clic accidentel.

**Quel est le rôle de Vue Router ?**
Il permet de changer de "page" (liste, nouveau ticket, détail) sans recharger le navigateur, en associant une URL à un composant Vue.

**Comment éviter les doublons lors de l'enregistrement ?**
En désactivant le bouton (`:disabled="enregistrement"`) pendant l'appel à l'API, pour empêcher un double clic d'envoyer deux fois le même formulaire.

## Difficultés rencontrées

À compléter par Dali selon son expérience personnelle du TP.

## Captures automatiques

Après l'installation des dépendances et de Chromium Playwright, lancer :

```bash
node scripts/captures.js
```

Le script démarre json-server sur le port 3000 et utilise Vite sur le port 5174 (il le démarre si nécessaire), puis crée les sept captures dans `captures/`. Le port 3000 doit être libre. json-server est arrêté avant la dernière capture pour montrer le message d'erreur réseau. La capture 05 représente la confirmation dans la page, car les captures Playwright ne peuvent pas inclure l'interface native du navigateur; le script ouvre aussi la vraie boîte `window.confirm` et la ferme sans supprimer le ticket.

## GitHub Pages

L'application est publiée sous `https://infomedalib.github.io/ATELIER-FRAMEWORK-COTE-CLIENT/tp2-tickets-maintenance-dali/`. GitHub Pages héberge uniquement le frontend statique : json-server doit toujours être lancé localement pour les opérations CRUD.
