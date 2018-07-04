//--------------------------------------------------------
//-- Tests
//--------------------------------------------------------
'use strict';

const path   = require('path');
const slash  = require('slash');
const tester = require('@absolunet/tester');

const rootPath = slash(path.normalize(`${__dirname}/..`));

tester.lintJs([
	`*.js`,
	`*/*.js`,
	`*/!(node_modules)/**/*.js`,
	`!boilerplate/bower_components/**/*.js`,
	`!boilerplate/components/**/scripts/vendor/**/*.js`,
	`!ressources/docs-builder/bower_components/**/*.js`,
	`!ressources/docs-builder/node_modules/**/*.js`,
	`!test/fixtures/**/*.js`
], {
	cwd: rootPath
});


tester.lintScss([
	`*.scss`,
	`*/*.scss`,
	`*/!(node_modules)/**/*.scss`,
	`!boilerplate/bower_components/**/*`,
	`!boilerplate/components/**/styles/vendor/**/*.scss`,
	`!ressources/docs-builder/bower_components/**/*.scss`,
	`!ressources/docs-builder/node_modules/**/*.scss`,
	`!ressources/docs-builder/styles/vendor/*.scss`
], {
	cwd: rootPath
});
