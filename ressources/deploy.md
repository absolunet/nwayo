# Procédure de déploiement

## Vérifier pour des mises à jour npm

- `npm run outdated`
- Faire les ajustements dans les fichiers `package.json`
- `npm install`



## Faire les tests

- `npm test`
- **Commiter les changements de mises à jour + corrections de tests**



## Version bump

- Changer la version dans le fichier `lerna.json`
- `npm run build`

### Sous `root`

- Refaire un `npm test`
- `npm run deploy`

**Commiter tous les changements avec le message `Version bump`**



## Release Github

- Créer une [nouvelle release](https://github.com/absolunet/nwayo/releases/new) sur Github
- `Tag version` et `Release title` sont le numéro de version
- Ajouter dans la description le changelog
- Enjoy  🥂
