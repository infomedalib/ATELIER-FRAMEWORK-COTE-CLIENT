## Captures du TP

Générez automatiquement les cinq captures depuis la racine du projet avec :

```sh
npm run captures
```

Le script démarre JSON Server et Vite, réalise les captures avec Chromium, puis arrête les serveurs qu'il a lui-même démarrés. Les ports 3000 et 5173 doivent être libres. Pour la capture d'erreur, il arrête JSON Server avant de recharger l'application.

| N° | Capture | Contenu |
|---|---|---|
| 01 | `01-api-json.png` | Réponse JSON de GET `/tickets` |
| 02 | `02-liste-tickets.png` | Les trois tickets dans l'application Vue |
| 03 | `03-recherche.png` | Résultat de la recherche « Wi-Fi » |
| 04 | `04-filtres.png` | Résultat des filtres « En cours » et « Moyenne » |
| 05 | `05-erreur-serveur.png` | Message affiché lorsque JSON Server est arrêté |

### Vérification rapide
Après génération, ce dossier contient les images suivantes :
```
captures/
├── README.md
├── 01-api-json.png
├── 02-liste-tickets.png
├── 03-recherche.png
├── 04-filtres.png
└── 05-erreur-serveur.png
```
