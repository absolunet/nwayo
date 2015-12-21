//-------------------------------------
//-- Watch
//-------------------------------------
'use strict';

const gulp = require('gulp');
//const debug = require('gulp-debug');

const PATH = global.nwayo.path;
const ENV  = global.nwayo.env;




//-- Watch
gulp.task('watch', () => {

	ENV.setToWatching();

	// Assets
	gulp.watch( [PATH.files.fonts],  ['assets-fonts'] );
	gulp.watch( [PATH.files.images], ['assets-images'] );
	gulp.watch( [PATH.files.raw],    ['assets-raw'] );

	// Icons
	gulp.watch( [PATH.files.iconsFavicon],                     ['icons-favicon'] );
	gulp.watch( [PATH.files.iconsIcon, PATH.files.iconsLarge], ['icons-share'] );
	gulp.watch( [PATH.files.iconsTile],                        ['icons-tile'] );

	// Scripts
	gulp.watch( [PATH.files.bundles, PATH.files.scripts, PATH.files.templates], ['scripts-compile'] );

	// Styles
	gulp.watch( [PATH.files.inline],                     ['styles-images', 'styles-compile'] );
	gulp.watch( [PATH.files.bundles, PATH.files.styles], ['styles-compile'] );

});
