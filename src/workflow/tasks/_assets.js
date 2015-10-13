//-------------------------------------
//-- Assets
//-------------------------------------
'use strict';

//let debug  = require('gulp-debug');
let gulp   = require('gulp');
let rename = require('gulp-rename');

const PATH = global.nwayo.path;
const Util = global.nwayo.util;




//-- Fonts copy
gulp.task('assets-fonts', () => {
	return Util.assetsProcess(PATH.files.fonts, stream => {
		return stream
			.pipe( rename( path => {
				path.dirname = Util.assetsRename(path.dirname);
				return;
			}))
		;
	});
});


//-- Images optimization
gulp.task('assets-images-optimization', () => {
	let imagemin = require('gulp-imagemin');

	return Util.assetsProcess(PATH.files.images, stream => {
		return stream
			.pipe( imagemin(Util.imageminParams) )

			.pipe( rename( path => {
				path.dirname = Util.assetsRename(path.dirname);
				return;
			}))
		;
	});
});


//-- High density images generation
gulp.task('assets-images-highdensity', () => {
	let imagemin = require('gulp-imagemin');
	let gm       = require('gulp-gm');

	return Util.assetsProcess(PATH.files.images2x, stream => {
		return stream
			.pipe( gm( (gmfile, done) => {
				gmfile.identify( (err, info) => {
					Util.gmOptimization( gmfile.resize('50%','50%'), info);
					done(null, gmfile);
				});
			}))

			.pipe( imagemin(Util.imageminParams) )

			.pipe( rename( path => {
				path.dirname  = Util.assetsRename(path.dirname);
				path.basename = path.basename.slice(0,-3);
				return;
			}))
		;
	});
});


//-- Raw copy
gulp.task('assets-raw', () => {
	return Util.assetsProcess(PATH.files.raw, stream => {
		return stream
			.pipe( rename( path => {
				path.dirname = Util.assetsRename(path.dirname);
				return;
			}))
		;
	});
});




//-- Rebuild images
gulp.task('assets-images', cb => {
	Util.taskGrouper({ cb,
		tasks:       ['assets-images-optimization', 'assets-images-highdensity'],
		cleanBundle: (name, bundle) => {
			return [`${bundle.output.build}/${PATH.build.images}`];
		}
	});
});


//-- Rebuild
gulp.task('assets', cb => {
	Util.taskGrouper({ cb,
		tasks:       ['assets-fonts', 'assets-images', 'assets-raw'],
		cleanBundle: (name, bundle) => {
			return [`${bundle.output.build}/${PATH.build.fonts}`, `${bundle.output.build}/${PATH.build.images}`, `${bundle.output.build}/${PATH.build.raw}`];		}
	});
});
