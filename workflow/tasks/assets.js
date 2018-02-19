//-------------------------------------
//-- Assets
//-------------------------------------
'use strict';

// const debug = require('gulp-debug');
const gulp     = require('gulp');
const gm       = require('gulp-gm');
const imagemin = require('gulp-imagemin');
const rename   = require('gulp-rename');
const paths    = require('../helpers/paths');
const util     = require('../helpers/util');






//-- Fonts copy
gulp.task('assets-fonts', () => {
	return util.assetsProcess(paths.files.fonts, (stream) => {
		return stream
			.pipe(rename(util.assetsRename()))
		;
	}, 'Fonts copy');
});


//-- Images optimization
gulp.task('assets-images-optimization', () => {
	return util.assetsProcess(paths.files.images, (stream) => {
		return stream
			.pipe(imagemin())
			.pipe(rename(util.assetsRename()))
		;
	});
});


//-- High density images generation
gulp.task('assets-images-highdensity', () => {
	return util.assetsProcess(paths.files.images2x, (stream) => {
		return stream
			.pipe(gm((gmfile, done) => {
				gmfile.identify((err, info) => {
					if (err) {
						console.log(err); // eslint-disable-line no-console
					}
					util.gmOptimization(gmfile.resize('50%', '50%'), info);
					done(null, gmfile);
				});
			}))

			.pipe(imagemin())

			.pipe(rename(util.assetsRename((filename) => { return filename.slice(0, -3); })))
		;
	});
});


//-- Raw copy
gulp.task('assets-raw', () => {
	return util.assetsProcess(paths.files.raw, (stream) => {
		return stream
			.pipe(rename(util.assetsRename()))
			.on('end', () => { return util.watchableTaskCompleted('Raw files copy'); })
		;
	});
});




//-- Rebuild images
gulp.task('assets-images', (cb) => {
	util.taskGrouper({
		cb:           cb,
		taskName:    'Images optimization',
		tasks:       [['assets-images-optimization', 'assets-images-highdensity']],
		cleanBundle: (name, bundle) => {
			return [`${paths.dir.root}/${bundle.output.build}/${paths.build.images}`];
		}
	});
});


//-- Rebuild
gulp.task('assets', (cb) => {
	util.taskGrouper({
		cb:          cb,
		tasks:       [['assets-fonts', 'assets-images', 'assets-raw']],
		cleanBundle: (name, bundle) => {
			return [`${paths.dir.root}/${bundle.output.build}/${paths.build.fonts}`, `${paths.dir.root}/${bundle.output.build}/${paths.build.images}`, `${paths.dir.root}/${bundle.output.build}/${paths.build.raw}`];
		}
	});
});
