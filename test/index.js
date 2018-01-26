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
	`!boilerplate/bower_components/**/*`,
	`!boilerplate/components/**/scripts/vendor/**/*.js`,
	`!test/fixtures/**/*.js`
], {
	cwd: rootPath
});


tester.lintScss([
	`*.scss`,
	`*/*.scss`,
	`*/!(node_modules)/**/*.scss`,
	`!boilerplate/bower_components/**/*`,
	`!boilerplate/components/**/styles/vendor/**/*.scss`
], {
	cwd: rootPath
});

