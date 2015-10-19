//-------------------------------------
//-- Rebuild
//-------------------------------------
'use strict';

let runsequence = require('run-sequence');
let gulp        = require('gulp');
//let debug = require('gulp-debug');




//-- Rebuild scripts & styles
gulp.task('rebuild-ss', cb => {
	runsequence(['scripts', 'styles'], cb);
});


//-- Rebuild
gulp.task('rebuild', cb => {
	runsequence(['assets', 'icons', 'local', 'scripts', 'styles'], cb);
});
