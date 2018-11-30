# Procédure de déploiement

## Vérifier pour des mises à jour npm

- `npm run outdated`
- Faire les ajustements dans le fichier `package.json`



## Vérifier pour des mises à jour bower (sous `packages/grow-project/boilerplate`)

- `nwayo doctor`
- Faire les ajustements dans le fichier `bower.json`



## Faire les tests

- `npm test`
- **Commiter les changements de mises à jour + corrections de tests**



## Version bump

- Changer la version dans le fichier `lerna.json`
- `npm run build`

### Sous `packages/grow-project/boilerplate`)

- `nwayo rebuild`

**Commiter tous les changements avec le message `Version bump`**



## Release Github

- Créer une [nouvelle release](https://github.com/absolunet/nwayo/releases/new) sur Github
- `Tag version` et `Release title` sont le numéro de version
- Ajouter dans la description le changelog
- Enjoy  🥂
