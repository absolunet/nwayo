//-------------------------------------
//-- Rebuild
//-------------------------------------
'use strict';

// const debug = require('gulp-debug');
const gulp        = require('gulp');
const runsequence = require('run-sequence');
const fss         = require('@absolunet/fss');
const env         = require('../helpers/env');
const paths       = require('../helpers/paths');
const util        = require('../helpers/util');






//-- Rebuild scripts & styles
gulp.task('rebuild-ss', (cb) => {
	runsequence(['scripts', 'styles'], cb);
});


//-- Rebuild
gulp.task('rebuild', (cb) => {
	for (const name of Object.keys(env.bundles)) {
		fss.outputFile(`${paths.dir.root}/${env.bundles[name].output.build}/readme-${env.name}.md`, `# ${util.getGeneratedBanner(name, 'text')}\n`);
	}

	runsequence(['assets', 'icons', 'local', 'scripts', 'styles'], cb);
});
