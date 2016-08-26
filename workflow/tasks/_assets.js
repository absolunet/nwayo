//-------------------------------------
//-- Assets
//-------------------------------------
'use strict';

const gulp     = require('gulp');
const rename   = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const gm       = require('gulp-gm');
//const debug = require('gulp-debug');

const PATH = global.nwayo.path;
const Util = global.nwayo.util;




//-- Fonts copy
gulp.task('assets-fonts', () => {
	return Util.assetsProcess(PATH.files.fonts, (stream) => {
		return stream
			.pipe( rename(Util.assetsRename()) )
		;
	}, 'Fonts copy');
});


//-- Images optimization
gulp.task('assets-images-optimization', () => {
	return Util.assetsProcess(PATH.files.images, (stream) => {
		return stream
			.pipe( imagemin() )
			.pipe( rename(Util.assetsRename()) )
		;
	});
});


//-- High density images generation
gulp.task('assets-images-highdensity', () => {
	return Util.assetsProcess(PATH.files.images2x, (stream) => {
		return stream
			.pipe( gm( (gmfile, done) => {
				gmfile.identify( (err, info) => {
					if (err) {
						console.log(err); // eslint-disable-line no-console
					}
					Util.gmOptimization( gmfile.resize('50%','50%'), info);
					done(null, gmfile);
				});
			}))

			.pipe( imagemin() )

			.pipe( rename( Util.assetsRename((filename) => { return filename.slice(0,-3); }) ) )
		;
	});
});


//-- Raw copy
gulp.task('assets-raw', () => {
	return Util.assetsProcess(PATH.files.raw, (stream) => {
		return stream
			.pipe( rename(Util.assetsRename()) )
			.on('end', () => { return Util.watchableTaskCompleted('Raw files copy'); } )
		;
	});
});




//-- Rebuild images
gulp.task('assets-images', (cb) => {
	Util.taskGrouper({ cb: cb,
		taskName:    'Images optimization',
		tasks:       [['assets-images-optimization', 'assets-images-highdensity']],
		cleanBundle: (name, bundle) => {
			return [`${bundle.output.build}/${PATH.build.images}`];
		}
	});
});


//-- Rebuild
gulp.task('assets', (cb) => {
	Util.taskGrouper({ cb: cb,
		tasks:       [['assets-fonts', 'assets-images', 'assets-raw']],
		cleanBundle: (name, bundle) => {
			return [`${bundle.output.build}/${PATH.build.fonts}`, `${bundle.output.build}/${PATH.build.images}`, `${bundle.output.build}/${PATH.build.raw}`];		}
	});
});
