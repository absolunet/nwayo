//-------------------------------------
//-- Assets
//-------------------------------------
'use strict';

//let debug = require('gulp-debug');
let gulp   = require('gulp');
let rename = require('gulp-rename');

let util = require('./_util');
let path = util.path;


//-- Assets processing pattern
util.processAssets = (files, customPiping) => {
	let _     = require('lodash');
	let merge = require('merge-stream');

	let streams = [];

	for (let component of util.bundlesComponents) {

		// Create stream for component
		let stream = gulp.src(files.replace(path.pattern.anytree, component), {base:path.dir.root});
		stream = customPiping(stream);

		// Output to each bundle
		for (let name in util.bundles) {
			if (util.bundles.hasOwnProperty(name)) {
				let bundle = util.bundles[name];

				if ( _.includes(bundle.assets.components, component) ) {
					stream.pipe( gulp.dest(bundle.output.build) );
				}
			}
		}

		streams.push(stream);
	}

	return merge.apply(null, streams);
};


//-- Task grouper
util.taskGrouper = (options) => {
	let del         = require('del');
	let runsequence = require('run-sequence');

	// Global paths to delete
	let list = options.cleanPaths || [];

	// Bundles paths to delete
	for (let name in util.bundles) {
		if (util.bundles.hasOwnProperty(name)) {
			Array.prototype.push.apply(list, options.cleanBundle(name, util.bundles[name]) );
		}
	}

	del.sync(list, {force:true});
	runsequence(options.tasks, options.cb);
};










//-- Fonts copy
gulp.task('assets-fonts', () => {
	return util.processAssets(path.files.fonts, stream => {
		return stream
			.pipe( rename( path => {
				path.dirname = util.assets_rename(path.dirname);
				return;
			}))
		;
	});
});


//-- Images optimization
gulp.task('assets-images-optimization', () => {
	let imagemin = require('gulp-imagemin');

	return util.processAssets(path.files.images, stream => {
		return stream
			.pipe( imagemin(util.imagemin_params()) )

			.pipe( rename( path => {
				path.dirname = util.assets_rename(path.dirname);
				return;
			}))
		;
	});
});


//-- High density images generation
gulp.task('assets-images-highdensity', () => {
	let imagemin = require('gulp-imagemin');
	let gm       = require('gulp-gm');

	return util.processAssets(path.files.images2x, stream => {
		return stream
			.pipe( gm( (gmfile, done) => {
				gmfile.identify( (err, info) => {
					util.gm_optimization( gmfile.resize('50%','50%'), info);
					done(null, gmfile);
				});
			}))

			.pipe( imagemin(util.imagemin_params()) )

			.pipe( rename( path => {
				path.dirname  = util.assets_rename(path.dirname);
				path.basename = path.basename.slice(0,-3);
				return;
			}))
		;
	});
});


//-- Raw copy
gulp.task('assets-raw', () => {
	return util.processAssets(path.files.raw, stream => {
		return stream
			.pipe( rename( path => {
				path.dirname = util.assets_rename(path.dirname);
				return;
			}))
		;
	});
});




//-- Rebuild images
gulp.task('assets-images', cb => {
	util.taskGrouper({ cb,
		tasks:       ['assets-images-optimization', 'assets-images-highdensity'],
		cleanBundle: (name, bundle) => {
			return [`${bundle.output.build}/${path.build.images}`];
		}
	});
});


//-- Rebuild
gulp.task('assets', cb => {
	util.taskGrouper({ cb,
		tasks:       ['assets-fonts', 'assets-images', 'assets-raw'],
		cleanBundle: (name, bundle) => {
			return [`${bundle.output.build}/${path.build.fonts}`, `${bundle.output.build}/${path.build.images}`, `${bundle.output.build}/${path.build.raw}`];		}
	});
});
