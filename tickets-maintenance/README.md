# TP1 — Tickets de Maintenance

**Étudiant :** Dali, étudiant en Développement Web et Multimédia

## Prérequis

- [Node.js](https://nodejs.org/) (version 22.12 ou supérieure, requise par JSON Server)
- [npm](https://www.npmjs.com/) (fourni avec Node.js)

## Installation

```bash
npm install
```

## Lancement

Il faut **deux terminaux** ouverts simultanément :

**Terminal 1** — Démarrer le serveur JSON Server (simule une API REST) :
```bash
npm run server
```
Ou alternativement :
```bash
npx json-server db.json --port 3000
```

**Terminal 2** — Démarrer l'application Vue :
```bash
npm run dev
```

Ouvrir ensuite dans le navigateur l'adresse indiquée par Vite (généralement http://localhost:5173).

## Captures d'écran

Pour générer les cinq captures obligatoires avec Playwright et Chromium :

```bash
npx playwright install chromium
npm run captures
```

Le script capture la réponse JSON, la liste, la recherche, les filtres combinés et le message obtenu lorsque JSON Server est arrêté. Les ports 3000 et 5173 doivent être libres.

## Fonctionnalités réalisées

- Récupération des tickets depuis une API REST simulée par JSON Server
- Affichage des tickets sous forme de cartes avec titre, description, demandeur et date
- Badges colorés selon la priorité (rouge = Haute, orange = Moyenne, vert = Basse)
- Badges colorés selon le statut (rouge = Ouvert, bleu = En cours, vert = Résolu)
- Champ de recherche textuel qui filtre les tickets par titre en temps réel
- Filtre par statut via un menu déroulant (Tous / Ouvert / En cours / Résolu)
- Filtre par priorité via un menu déroulant (Toutes / Haute / Moyenne / Basse)
- Combinatoire des deux filtres (recherche + statut + priorité)
- Compte du nombre de tickets affichés après filtrage
- Message « Aucun ticket ne correspond à votre recherche » quand le résultat est vide
- Gestion du chargement (message « Chargement… » pendant l'appel API)
- Gestion d'erreur (message si le serveur json-server n'est pas démarré)

## Difficultés rencontrées

> Exemple : Il a fallu comprendre la différence entre `ref()` (valeur réactive simple) et `computed()` (valeur dérivée calculée automatiquement). J'ai aussi appris à utiliser `onMounted()` pour effectuer l'appel API au bon moment, après que le composant soit bien inséré dans le DOM. Enfin, j'ai dû gérer les trois états possibles : chargement, succès et erreur.

*À personnaliser avec vos propres observations.*

## Questions

### 1. Quelle différence entre une API REST et le fichier db.json ?

Le fichier `db.json` est un simple fichier de données statiques. L'API REST est le service fourni par **json-server** qui lit ce fichier et expose ses données via des URLs HTTP classiques (`GET /tickets`, etc.). Pour le développeur front-end, ça donne l'impression de parler à une vraie base de données via HTTP, sans avoir besoin de configurer un backend.

### 2. Pourquoi utiliser onMounted() ?

`onMounted()` est une fonction du cycle de vie de Vue qui exécute le code fourni après l'insertion du composant dans la page. Ici, elle lance la requête pour charger les tickets une fois le composant monté. Pendant la requête, Vue peut afficher le message de chargement, puis les tickets ou le message d'erreur selon le résultat.

### 3. Quel est le rôle d'Axios ?

Axios est une bibliothèque qui simplifie les appels réseau (requêtes HTTP) dans un projet JavaScript/Vue. Ici, elle sert à faire un `GET http://localhost:3000/tickets` et à récupérer le JSON retourné par json-server. Sans Axios, il faudrait utiliser l'API native `fetch()`, mais Axios offre une syntaxe plus simple (`await axios.get(...)`) et gère automatiquement la conversion JSON.

### 4. Quelle différence entre ref() et computed() ?

- `ref()` crée une **variable réactive** simple dont on change la valeur manuellement (ex. stocker la liste des tickets après l'appel API).
- `computed()` crée une **valeur dérivée** qui se calcule automatiquement à partir d'autres refs. Quand les valeurs dont elle dépend changent, le computed est recalculé tout seul. On l'utilise ici pour `filteredTickets` : dès que l'utilisateur tape dans la barre de recherche ou modifie un select, le filtrage se fait instantanément sans code supplémentaire.
