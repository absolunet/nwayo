//-------------------------------------
//-- Rebuild
//-------------------------------------
'use strict';

const fs          = require('fs-extra');
const runsequence = require('run-sequence');
const gulp        = require('gulp');
// const debug = require('gulp-debug');

const Util = global.nwayo.util;
const ENV  = global.nwayo.env;




//-- Rebuild scripts & styles
gulp.task('rebuild-ss', (cb) => {
	runsequence(['scripts', 'styles'], cb);
});


//-- Rebuild
gulp.task('rebuild', (cb) => {
	for (const name of Object.keys(ENV.bundles)) {
		fs.outputFileSync(`${ENV.bundles[name].output.build}/readme-nwayo.md`, `# ${Util.getGeneratedBanner(name, 'text')}\n`);
	}

	runsequence(['assets', 'icons', 'local', 'scripts', 'styles'], cb);
});
