//-------------------------------------
//-- Watch
//-------------------------------------
'use strict';

//let debug = require('gulp-debug');
let gulp = require('gulp');
let util = require('./_util');

let path = util.path;


//-- Watch
gulp.task('watch', () => {

	// Assets
	gulp.watch( [path.files.fonts],  ['assets.fonts'] );
	gulp.watch( [path.files.images], ['assets.images'] );
	gulp.watch( [path.files.raw],    ['assets.raw'] );

	// Icons
	gulp.watch( [path.files.icons_favicon],                      ['icons_favicon'] );
	gulp.watch( [path.files.icons_icon, path.files.icons_large], ['icons_share'] );
	gulp.watch( [path.files.icons_tile],                         ['icons_tile'] );

	// Scripts
	gulp.watch( [path.files.bundles_scripts, path.files.scripts, path.files.templates], ['scripts_compile'] );

	// Styles
	gulp.watch( [path.files.inline],                            ['styles_images', 'styles_compile'] );
	gulp.watch( [path.files.bundles_styles, path.files.styles], ['styles_compile'] );

});
