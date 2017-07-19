//-------------------------------------
//-- Styles
//-------------------------------------
'use strict';

const _            = require('lodash');
const fs           = require('fs-extra');
const merge        = require('merge-stream');
const gulp         = require('gulp');
const gulpif       = require('gulp-if');
const cache        = require('gulp-cached');
const rename       = require('gulp-rename');
const imagemin     = require('gulp-imagemin');
const scsslint     = require('gulp-scss-lint');
const sass         = require('gulp-ruby-sass');
const jsonsass     = require('gulp-json-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano      = require('gulp-cssnano');
const sourcemaps   = require('gulp-sourcemaps');
// const debug = require('gulp-debug');

const PATH = global.nwayo.path;
const ENV  = global.nwayo.env;
const Util = global.nwayo.util;




//-- Inline images optimization
gulp.task('styles-images', () => {
	return gulp.src(PATH.files.inline, { base:PATH.dir.root })
		.pipe(imagemin())
		.pipe(rename(Util.assetsRename()))
		.pipe(gulp.dest(PATH.dir.cache))
	;
});


//-- Lint SCSS
gulp.task('styles-lint', () => {
	return gulp.src(PATH.files.stylesLint)
		.pipe(cache('styles', { optimizeMemory:true }))

		.pipe(scsslint({
			config:       PATH.config.scsslint,
			customReport: function(file) {
				if (!file.scsslint.success) {
					delete cache.caches.styles[file.path];
				}
				scsslint.defaultReporter(file);
			}
		}))

		.pipe(scsslint.failReporter())
	;
});


//-- Convert constants to SCSS
gulp.task('styles-constants', () => {
	const streams = [];

	for (const name of Object.keys(ENV.bundles)) {
		const data = Util.parseKonstan('styles', name, ENV.bundles[name].output.url);
		data.bundle = `'${name}'`;

		streams.push(
			Util.vinylStream(PATH.filename.konstanStyles, JSON.stringify({ konstan:data }))
				.pipe(jsonsass())
				.pipe(gulp.dest(`${PATH.dir.cacheStyles}/${name}`))
		);
	}

	return merge(...streams);
});


//-- Compile
gulp.task('styles-compile', ['styles-lint', 'styles-constants'], () => {
	const streams = [];

	for (const name of Object.keys(ENV.bundles)) {
		const bundle = ENV.bundles[name];

		// For each collection
		for (const collection of Object.keys(bundle.styles.collections)) {
			const list = _.cloneDeep(bundle.styles.collections[collection].files);

			// Add konstan
			list.unshift(`${PATH.dir.cacheStyles}/${name}/${PATH.filename.konstan}`);

			// Require each file
			list.forEach((file, i) => {
				list[i] = `@import '${file}';`;
			});

			fs.outputFileSync(`${PATH.dir.cacheStyles}/${name}/collections/${collection}.${PATH.ext.styles}`, `${Util.getGeneratedBanner(name)}${list.join('\n')}\n`);
			// Process all collections from this bundle
			streams.push(
				sass(`${PATH.dir.cacheStyles}/${name}/${collection}/*.${PATH.ext.styles}`, {
					loadPath:      PATH.dir.root,
					cacheLocation: PATH.dir.cacheSass,
					compass:       true,
					trace:         true,
					sourcemap:     bundle.styles.options.sourcemaps,
+					style:         bundle.styles.collections[collection].options.style
				})

					.pipe(autoprefixer({ browsers:bundle.styles.options.autoprefixer }))

					.pipe(gulpif(bundle.styles.options.minify && !ENV.watching, cssnano({ zindex:false })))

					.pipe(gulpif(bundle.styles.options.sourcemaps, sourcemaps.write('maps', {
						includeContent: false,
						sourceRoot:     'source'
					})))

					.pipe(gulp.dest(`${bundle.output.build}/${PATH.build.styles}`))
			);
		}
	}

	return merge(...streams)
		.on('end', () => { return Util.watchableTaskCompleted('Styles compilation'); })
	;
});


//-- Rebuild
gulp.task('styles', (cb) => {
	Util.taskGrouper({
		cb:          cb,
		tasks:       ['styles-images', 'styles-compile'],
		cleanPaths:  [PATH.dir.cacheInline, PATH.dir.cacheSass],
		cleanBundle: (name, bundle) => {
			return [`${bundle.output.build}/${PATH.build.styles}`, `${PATH.dir.cacheStyles}/${name}`];
		}
	});
});
