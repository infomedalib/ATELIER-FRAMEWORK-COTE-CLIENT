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

- Liste de cinq contacts d’exemple, avec initiales, nom, prénom et téléphone.
- Fiche contact avec modification des champs et affichage des initiales.
- Fiche détaillée et formulaire d’ajout.
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

Captures : [liste et initiales](./captures/01-liste-contacts.png), [fiche](./captures/02-fiche-contact.png), [modification](./captures/03-modification-contact.png) et [galerie et caméra](./captures/04-galerie-camera.png).

## Tests

Les cinq contacts initiaux, leurs initiales, noms et numéros ont été vérifiés dans la liste. Les essais navigateur couvrent la modification et la persistance après rechargement, le retour sans sauvegarde, les champs vides et l’e-mail invalide. Les liens `tel:` et `mailto:` ont été vérifiés. La sélection d’un fichier image via Galerie et le champ Caméra a été testée dans le navigateur ; l’ouverture des applications natives et la prise de photo réelle restent à essayer sur un téléphone compatible. Les avatars restent en initiales même lorsqu’une photo est choisie.

## Déploiement

Le workflow GitHub Actions construit l’application et la publie sur GitHub Pages après chaque mise à jour de `main`. Pour la première publication, sélectionnez **GitHub Actions** comme source dans **Settings → Pages**. Après publication, l’application est accessible à l’adresse :

<https://infomedalib.github.io/ATELIER-FRAMEWORK-COTE-CLIENT/>
