//--------------------------------------------------------
//-- Tester
//--------------------------------------------------------
'use strict';

const tester = require('@absolunet/tester');


const EXCLUDE_MULTI = [
	`!docs/static/**`,
	`!packages/**`,
	`!ressources/docs-builder/app/helpers/generated/**`,
	`!ressources/docs-builder/assets/*/vendor/*`,
	`!ressources/docs-builder/local-server/**`,
	`!ressources/docs-builder/node_modules/**`,
	`!test/fixtures/**`
];

const EXCLUDE_SUB = [
	`!boilerplate/components/**/scripts/vendor/**`,
	`!boilerplate/components/**/styles/vendor/**`,
	`!boilerplate/node_modules/**`,
	`!boilerplate/vendor/node_modules/**`
];


tester.npmPackage.validateMulti({
	js:           tester.all.js.concat(EXCLUDE_MULTI),
	json:         tester.all.json.concat(EXCLUDE_MULTI),
	yaml:         tester.all.yaml.concat(EXCLUDE_MULTI),
	bash:         tester.all.bash.concat(EXCLUDE_MULTI),
	editorconfig: tester.all.editorconfig.concat(EXCLUDE_MULTI),
	scss:         tester.all.scss.concat(EXCLUDE_MULTI)
});

tester.npmPackage.multiPackagesPaths.forEach((path) => {
	tester.npmPackage.validateSub({
		cwd:          path,
		group:        path.split('/').pop(),
		js:           tester.all.js.concat([`bin/**`], EXCLUDE_SUB),
		json:         tester.all.json.concat(EXCLUDE_SUB),
		yaml:         tester.all.yaml.concat(EXCLUDE_SUB),
		bash:         tester.all.bash.concat(EXCLUDE_SUB),
		editorconfig: tester.all.editorconfig.concat(EXCLUDE_SUB),
		scss:         tester.all.scss.concat(EXCLUDE_SUB)
	});
});
