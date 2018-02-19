//-------------------------------------
//-- Watch
//-------------------------------------
'use strict';

// const debug = require('gulp-debug');
const gulp  = require('gulp');
const env   = require('../helpers/env');
const paths = require('../helpers/paths');





//-- Watch
gulp.task('watch', () => {

	env.setToWatching();

	// Assets
	gulp.watch([paths.files.fonts],  ['assets-fonts']);
	gulp.watch([paths.files.images], ['assets-images']);
	gulp.watch([paths.files.raw],    ['assets-raw']);

	// Icons
	gulp.watch([paths.files.iconsFavicon],                      ['icons-favicon']);
	gulp.watch([paths.files.iconsIcon, paths.files.iconsLarge], ['icons-share']);
	gulp.watch([paths.files.iconsTile],                         ['icons-tile']);

	// Scripts
	gulp.watch([paths.files.bundles, paths.files.scripts, paths.files.templates, paths.files.bowerScripts], ['scripts-compile']);

	// Styles
	gulp.watch([paths.files.inline],                      ['styles-images', 'styles-compile']);
	gulp.watch([paths.files.bundles, paths.files.styles], ['styles-compile']);

});
