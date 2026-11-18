# TP1 — Consultation des tickets

Le projet TP1 autonome est conserve dans `../tickets-maintenance/`. Le projet TP2 situe dans `TP2_Tickets_Maintenance/` reprend aussi les fonctionnalites de consultation du TP1 et les complete avec le CRUD du TP2. Les captures TP1 sont copiees dans `captures/TP1/`.

## Installation et lancement

Depuis la racine du dossier `TP2_Tickets_Maintenance/` :

```bash
npm install
```

Dans deux terminaux :

```bash
npm run server
npm run dev
```

L'API est disponible sur `http://localhost:3000/tickets` et Vite affiche l'adresse de l'application.

## Fonctionnalites du TP1

- Chargement des tickets avec Axios et affichage des etats de chargement et d'erreur.
- Affichage du titre, du demandeur, de la priorite, du statut et de la date.
- Recherche par titre, filtres par statut et priorite, compteur et message si aucun resultat ne correspond.
- Badges visuels pour les priorites et les statuts.

## Questions

### Quelle difference entre une API REST et `db.json` ?

`db.json` contient les donnees. JSON Server lit ce fichier et expose les ressources au moyen d'URL HTTP, comme `GET /tickets`.

### Pourquoi utiliser `onMounted()` ?

`onMounted()` lance le chargement une fois le composant insere dans la page, ce qui permet d'afficher l'etat de chargement pendant la requete.

### Quel est le role d'Axios ?

Axios envoie les requetes HTTP vers JSON Server et facilite la lecture des reponses JSON ainsi que la gestion des erreurs.

### Quelle difference entre `ref()` et `computed()` ?

`ref()` stocke une valeur reactive, comme les tickets charges. `computed()` derive une valeur a partir d'autres valeurs reactives, comme la liste filtree.

## Captures

Les cinq captures du TP1 sont dans [`captures/TP1/`](./captures/TP1/). Les captures TP2 sont documentees dans [`captures/README.md`](./captures/README.md).

## Difficultes rencontrees

Personnaliser cette section avec les difficultes rencontrees pendant le TP.
