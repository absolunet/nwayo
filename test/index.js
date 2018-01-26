//--------------------------------------------------------
//-- Tests
//--------------------------------------------------------
'use strict';

const path   = require('path');
const slash  = require('slash');
const tester = require('@absolunet/tester');

const rootPath = slash(path.normalize(`${__dirname}/..`));

tester.lintJs([
	`**/*.js`,
	`!boilerplate/node_modules/**/*`,
	`!boilerplate/bower_components/**/*`,
	`!boilerplate/components/**/scripts/vendor/**/*.js`,
	`!test/fixtures/**/*.js`,
	`!test/node_modules/**/*`,
	`!workflow/node_modules/**/*`
], {
	cwd: rootPath
});


tester.lintScss(['boilerplate/components/**/*.scss'], {
	cwd:        rootPath,
	configPath: slash(path.normalize(`${rootPath}/boilerplate/.stylelintrc.yaml`))
});
