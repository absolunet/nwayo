//-------------------------------------
//-- Rebuild
//-------------------------------------
'use strict';

let fs          = require('fs-extra');
let runsequence = require('run-sequence');
let gulp        = require('gulp');
//let debug = require('gulp-debug');

const Util = global.nwayo.util;
const ENV  = global.nwayo.env;




//-- Rebuild scripts & styles
gulp.task('rebuild-ss', cb => {
	runsequence(['scripts', 'styles'], cb);
});


//-- Rebuild
gulp.task('rebuild', cb => {
	for (let name of Object.keys(ENV.bundles)) {
		fs.outputFileSync(`${ENV.bundles[name].output.build}/readme-nwayo.md`, `# ${Util.getGeneratedBanner(name, 'text')}\n`);
	}

	runsequence(['assets', 'icons', 'local', 'scripts', 'styles'], cb);
});
