//-------------------------------------
//-- Styles
//-------------------------------------
'use strict';

let _            = require('lodash');
let fs           = require('fs-extra');
let merge        = require('merge-stream');
let gulp         = require('gulp');
let gulpif       = require('gulp-if');
let cache        = require('gulp-cached');
let rename       = require('gulp-rename');
let imagemin     = require('gulp-imagemin');
let scsslint     = require('gulp-scss-lint');
let sass         = require('gulp-ruby-sass');
let jsonsass     = require('gulp-json-sass');
let autoprefixer = require('gulp-autoprefixer');
let minifycss    = require('gulp-minify-css');
//let debug = require('gulp-debug');

const PATH = global.nwayo.path;
const ENV  = global.nwayo.env;
const Util = global.nwayo.util;




//-- Inline images optimization
gulp.task('styles-images', () => {
	return gulp.src(PATH.files.inline, { base:PATH.dir.root })
		.pipe( imagemin(Util.imageminParams) )
		.pipe( rename(Util.assetsRename()) )
		.pipe( gulp.dest(PATH.dir.cache) )
	;
});


//-- Lint SCSS
gulp.task('styles-lint', () => {
	return gulp.src(PATH.files.stylesLint)
		.pipe( cache('styles', {optimizeMemory:true}) )

		.pipe( scsslint({
			config: PATH.config.scsslint,
			customReport: function(file) {
				if (!file.scsslint.success) {
					delete cache.caches.styles[file.path];
				}
				scsslint.defaultReporter.apply(null, arguments);
			}
		}))

		.pipe( scsslint.failReporter() )
	;
});


//-- Convert constants to SCSS
gulp.task('styles-constants', () => {
	let streams = [];

	for (let name of Object.keys(ENV.bundles)) {
		let data = Util.parseKonstan('styles', name, ENV.bundles[name].output.url);
		data.bundle = `'${name}'`;

		streams.push(
			Util.vinylStream(PATH.filename.konstanStyles, JSON.stringify({ konstan:data }))
				.pipe( jsonsass() )
				.pipe( gulp.dest(`${PATH.dir.cacheStyles}/${name}`))
		);
	}

	return merge.apply(null, streams);
});


//-- Compile
gulp.task('styles-compile', ['styles-lint', 'styles-constants'], () => {
	let streams = [];

	for (let name of Object.keys(ENV.bundles)) {
		let bundle = ENV.bundles[name];

		// For each collection
		for (let collection of Object.keys(bundle.styles.collections)) {
			let list = _.cloneDeep(bundle.styles.collections[collection]);

			// Add konstan
			list.unshift(`${PATH.dir.cacheStyles}/${name}/${PATH.filename.konstan}`);

			// Require each file
			list.forEach((file, i) => {
				list[i] = `@import '${file}';`;
 			});

			fs.outputFileSync(`${PATH.dir.cacheStyles}/${name}/collections/${collection}.${PATH.ext.styles}`, Util.getGeneratedBanner(name)+list.join('\n')+'\n');
		}

		// Process all collections from this bundle
		streams.push(
			sass(`${PATH.dir.cacheStyles}/${name}/collections/*.${PATH.ext.styles}`, {
				loadPath:      PATH.dir.root,
				cacheLocation: PATH.dir.cacheSass,
				compass:       true,
				trace:         true,
				sourcemap:     false
			})

				.pipe( autoprefixer({
					browsers: bundle.styles.options.autoprefixer
				}))

				.pipe( gulpif( bundle.styles.options.minify && !ENV.watching, minifycss()) )

				.pipe( gulp.dest(`${bundle.output.build}/${PATH.build.styles}`) )
		);
	}

	return merge.apply(null, streams)
		.on('end', () => Util.watchableTaskCompleted('Styles compilation') )
	;
});


//-- Rebuild
gulp.task('styles', cb => {
	Util.taskGrouper({ cb,
		tasks:       ['styles-images', 'styles-compile'],
		cleanPaths:  [PATH.dir.cacheInline, PATH.dir.cacheSass],
		cleanBundle: (name, bundle) => {
			return [`${bundle.output.build}/${PATH.build.styles}`, `${PATH.dir.cacheStyles}/${name}`];
		}
	});
});
