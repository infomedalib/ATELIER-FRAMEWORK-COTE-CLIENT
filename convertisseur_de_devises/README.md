# Currency Converter

Convertisseur de devises réalisé avec Vue 3, la Composition API et Vite pour le TP de Tahar Haouet. L'interface comporte deux listes de devises, un clavier numérique, l'inversion source/cible et une conversion via l'euro avec les taux fixes fournis dans l'énoncé.

## Démarrer le projet

Prérequis : Node.js et npm.

```sh
npm install
npm run dev
```

Pour vérifier la version de production :

```sh
npm run build
npm run preview
```

## Générer les livrables

Démarrer d'abord `npm run dev`, puis dans un second terminal :

```sh
npm run capture:deliverables
```

La commande vérifie les conversions dans Chromium, crée cinq captures dans `screenshots/` et génère le compte rendu de trois pages `Compte-rendu.pdf`. Au premier lancement, installer Chromium avec `npx playwright install chromium`.

## Utilisation

- Choisir les devises source et cible, saisir le montant avec le clavier affiché ou le clavier physique, puis sélectionner **Convertir** ou appuyer sur Entrée.
- Le bouton ⇅ inverse les devises. La touche C efface le montant ; la saisie accepte une seule décimale et au plus 10 caractères.
- Les taux sont fixes et exprimés pour 1 EUR. Ils sont uniquement pédagogiques et ne représentent pas des cours en temps réel.

## Cas de vérification

| Montant | Source | Cible | Résultat |
| ---: | :---: | :---: | ---: |
| 120 | USD | EUR | 102.56 |
| 100 | EUR | TND | 340.00 |
| 50 | GBP | USD | 67.24 |
| 10 | EUR | EUR | 10.00 |

Les captures des cas de test sont disponibles dans [`screenshots/`](screenshots/).

## Dépôt

Ce projet est publié dans le dépôt de cours sous le dossier `convertisseur_de_devises/`. Il peut être cloné avec le dépôt complet puis démarré avec les commandes ci-dessus.