//-------------------------------------
//-- Rebuild
//-------------------------------------
'use strict';

//let debug  = require('gulp-debug');
let gulp        = require('gulp');
let runsequence = require('run-sequence');




//-- Rebuild scripts & styles
gulp.task('rebuild-ss', cb => {
	runsequence(['scripts', 'styles'], cb);
});


//-- Rebuild
gulp.task('rebuild', cb => {
	runsequence(['assets', 'icons', 'local', 'scripts', 'styles'], cb);
});
