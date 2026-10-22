# Gestion des ordinateurs — Vue 3

Application Vue 3 (Vite) de gestion d'un parc informatique : liste des ordinateurs, recherche, tri, ajout, modification et suppression, avec persistance dans le `localStorage`.

## Installation

Prérequis : Node.js (voir `engines` dans `package.json`) et npm.

```sh
cd gestion-ordinateurs
npm install
```

## Exécution

```sh
npm run dev
```

Puis ouvrir http://localhost:5173

### Production

```sh
npm run build     # type-check + build
npm run preview   # prévisualiser le build
```

## Fonctionnalités

- Liste des ordinateurs sous forme de cartes (modèle, processeur, RAM, disque, carte graphique, photo)
- Statistiques : nombre d'ordinateurs, RAM totale, stockage total
- Recherche par modèle ou processeur
- Tri par mémoire RAM (décroissante)
- Formulaire d'ajout / modification avec validation (modèle et processeur obligatoires, RAM et disque strictement positifs)
- Suppression avec confirmation
- Persistance des données dans le `localStorage`

## Captures d'écran

Voir le dossier [`../captures/`](../captures/) (fichiers 01 à 04) et le compte rendu [`../COMPTE_RENDU.md`](../COMPTE_RENDU.md).
