//--------------------------------------------------------
//-- Tests
//--------------------------------------------------------
'use strict';

const path   = require('path');
const slash  = require('slash');
const tester = require('@absolunet/tester');

const rootPath = slash(path.normalize(`${__dirname}/..`));

tester.lint.js([
	`*.js`,
	`*/*.js`,
	`*/!(node_modules)/**/*.js`,
	`!boilerplate/bower_components/**`,
	`!boilerplate/components/**/scripts/vendor/**`,
	`!ressources/docs-builder/bower_components/**`,
	`!ressources/docs-builder/node_modules/**`,
	`!test/fixtures/**`,
	`!workflow/tests-matrix/**`
], {
	cwd: rootPath
});


tester.lint.scss([
	`*.scss`,
	`*/*.scss`,
	`*/!(node_modules)/**/*.scss`,
	`!boilerplate/bower_components/**`,
	`!boilerplate/components/**/styles/vendor/**`,
	`!ressources/docs-builder/bower_components/**`,
	`!ressources/docs-builder/node_modules/**`,
	`!ressources/docs-builder/styles/vendor/**`,
	`!workflow/tests-matrix/**`
], {
	cwd: rootPath
});
