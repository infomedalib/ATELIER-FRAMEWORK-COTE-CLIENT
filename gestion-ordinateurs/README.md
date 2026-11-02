# Gestion des contacts — Vue.js

Application Vue 3 permettant de consulter, modifier et ajouter des contacts. Les pages Liste et Détail partagent leur état avec un composable ; les changements sont conservés dans le stockage local du navigateur.

## Installation et lancement

Prérequis : Node.js 20.19+ ou 22.12+ et npm.

```bash
npm ci
npm run dev
```

Ouvrir l’URL affichée par Vite. Pour vérifier le build destiné à GitHub Pages :

```bash
npm run build
npm run preview
```

## Fonctionnalités

- Liste de cinq contacts d’exemple, avec avatar à l’initiale du prénom, nom, prénom et téléphone.
- Avatars affichés avec des initiales dans la liste et la fiche, selon le choix de présentation.
- Fiche de consultation/modification et formulaire d’ajout.
- Actions natives `tel:` et `mailto:`.
- Sélection d’image depuis la galerie et capture via `input type="file" capture="environment"`.
- Les commandes de sélection et de capture restent disponibles ; les avatars affichent toujours les initiales.
- Images sélectionnées redimensionnées avant l’enregistrement.
- Validation des champs et de l’adresse e-mail ; retour à la liste sans sauvegarder.
- Persistance locale avec migration des anciens contacts et des photos manquantes.
- Routage par fragment d’URL pour fonctionner sur l’hébergement statique GitHub Pages.

## Livrables et structure

- `src/App.vue` : cadre responsive de l’application.
- `src/router/index.js` : navigation Vue Router.
- `src/composables/useContacts.js` : contacts partagés et sauvegarde locale.
- `src/views/ListeContacts.vue` : liste et accès aux fiches.
- `src/views/DetailContact.vue` : consultation, modification et ajout.
- `captures/` : captures réalisées depuis l’application.
- `Rapport-TP-Gestion-Contacts.pdf` : compte rendu du projet et des tests.

Captures : [liste et initiales](./captures/01-liste-contacts.png), [fiche](./captures/02-fiche-contact.png), [modification](./captures/03-modification-contact.png) et [fiche avec les commandes de sélection](./captures/04-selection-photo.png).

## Tests

Les cinq contacts initiaux, leurs initiales, noms et numéros ont été vérifiés dans la liste. Les essais navigateur couvrent la modification et la persistance après rechargement, le retour sans sauvegarde, les champs vides et l’e-mail invalide. Les liens `tel:` et `mailto:` ont été vérifiés ; l’ouverture d’applications natives et la prise de photo doivent encore être essayées sur un téléphone compatible. Les avatars restent en initiales même lorsqu’une photo est choisie.

## Déploiement

Le workflow GitHub Actions du dépôt construit l’application et la publie sur GitHub Pages après chaque mise à jour de `main`. L’action tente d’activer Pages automatiquement. Si le compte du workflow n’a pas les droits nécessaires, un administrateur doit sélectionner la source **GitHub Actions** dans **Settings → Pages**. Après publication, l’application est accessible à l’adresse :

<https://infomedalib.github.io/ATELIER-FRAMEWORK-COTE-CLIENT/>
