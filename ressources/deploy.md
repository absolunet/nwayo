# Procédure de déploiement

## Vérifier pour des mises à jour npm / node

- `npm outdated`
- `node --version`
- Faire les ajustements dans le fichier `package.json`



## Vérifier pour des mises à jour bower (sous `boilerplate`)

- `nwayo doctor`
- Faire les ajustements dans les fichiers `bower.json`



## Faire les tests

- Au root, supprimer `package-lock.json` et `node_modules`
- Faire un `npm install`
- Faire des tests fonctionnels et rouler un `npm test` pour le linter
- **Commiter les changements de mises à jour + corrections de tests**



## Version bump

- Ajuster la version dans le `package.json`

- Supprimer `package-lock.json` et `node_modules`

- Faire un `npm install --production`

  - Le fichier `package-lock.json` ne devrait pas contenir des références à `@absolunet/tester` 

- Faire un `npm publish` ⚠️ **ATTENTION C'EST UNE COMMANDE SANS LENDEMAIN**

  ​

  ### Sous `boilerplate`

- Ajuster la version dans le `package.json` et `SAMPLE.index.html`

- Supprimer `package-lock.json` et `node_modules`

- Faire un `npm install`

- **Commiter tous les changements avec le message `Version bump`**



## Release Github

- Créer une (nouvelle release)[https://github.com/absolunet/nwayo/releases/new] sur Github
- `Tag version` et `Release title` sont le numéro de version
- Ajouter dans la description le changelog
- Enjoy  🥂

