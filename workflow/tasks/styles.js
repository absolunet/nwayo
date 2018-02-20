//-------------------------------------
//-- Styles
//-------------------------------------
'use strict';

// const debug = require('gulp-debug');
const gulp         = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cache        = require('gulp-cached');
const cssnano      = require('gulp-cssnano');
const gulpif       = require('gulp-if');
const imagemin     = require('gulp-imagemin');
const jsonsass     = require('gulp-json-sass');
const rename       = require('gulp-rename');
const sass         = require('gulp-ruby-sass');
const sourcemaps   = require('gulp-sourcemaps');
const stylelint    = require('gulp-stylelint');
const _            = require('lodash');
const merge        = require('merge-stream');
const fss          = require('@absolunet/fss');
const env          = require('../helpers/env');
const paths        = require('../helpers/paths');
const util         = require('../helpers/util');






//-- Inline images optimization
gulp.task('styles-images', () => {
	return gulp.src(paths.files.inline, { base:paths.dir.root })
		.pipe(imagemin())
		.pipe(rename(util.assetsRename()))
		.pipe(gulp.dest(paths.dir.cache))
	;
});


//-- Lint SCSS
gulp.task('styles-lint', () => {

	return gulp.src(paths.files.stylesLint)
		.pipe(cache('styles', { optimizeMemory:true }))

		.pipe(stylelint({
			configFile:     paths.config.stylelint,
			syntax:         'scss',
			failAfterError: true,
			reporters: [
				{
					formatter: (results) => {
						results.forEach((item) => {
							if (item.warnings.length || item.deprecations.length || item.invalidOptionWarnings.length) {
								delete cache.caches.styles[item.source];
							}
						});
					}
				},
				{
					formatter: 'string',
					console:   true
				}
			]
		}))
	;
});


//-- Convert constants to SCSS
gulp.task('styles-constants', () => {
	const streams = [];

	for (const name of Object.keys(env.bundles)) {
		const data = util.parseKonstan('styles', name, env.bundles[name].output.url);
		data.bundle = `'${name}'`;

		streams.push(
			util.vinylStream(paths.filename.konstanStyles, JSON.stringify({ konstan:data }))
				.pipe(jsonsass())
				.pipe(gulp.dest(`${paths.dir.cacheStyles}/${name}`))
		);
	}

	return merge(...streams);
});


//-- Compile
gulp.task('styles-compile', ['styles-lint', 'styles-constants'], () => {
	const streams = [];

	for (const name of Object.keys(env.bundles)) {
		const bundle = env.bundles[name];

		// For each collection
		for (const collection of Object.keys(bundle.styles.collections)) {
			const list = _.cloneDeep(bundle.styles.collections[collection]);

			// Add konstan
			list.unshift(`${paths.dir.cacheStyles}/${name}/${paths.filename.konstan}`);

			// Require each file
			list.forEach((file, i) => {
				list[i] = `@import '${file}';`;
			});

			fss.outputFile(`${paths.dir.cacheStyles}/${name}/collections/${collection}.${paths.ext.styles}`, `${util.getGeneratedBanner(name)}${list.join('\n')}\n`);
		}

		// Process all collections from this bundle
		streams.push(
			sass(`${paths.dir.cacheStyles}/${name}/collections/*.${paths.ext.styles}`, {
				loadPath:      paths.dir.root,
				cacheLocation: paths.dir.cacheSass,
				require:       paths.config.sass,
				trace:         true,
				sourcemap:     bundle.styles.options.sourcemaps
			})

				.pipe(autoprefixer({ browsers:bundle.styles.options.autoprefixer }))

				.pipe(gulpif(bundle.styles.options.minify && !env.watching, cssnano({ reduceIdents:false, zindex:false })))

				.pipe(gulpif(bundle.styles.options.sourcemaps, sourcemaps.write('maps', {
					includeContent: false,
					sourceRoot:     'source'
				})))

				.pipe(gulp.dest(`${paths.dir.root}/${bundle.output.build}/${paths.build.styles}`))
		);
	}

	return merge(...streams)
		.on('end', () => { return util.watchableTaskCompleted('Styles compilation'); })
	;
});


//-- Rebuild
gulp.task('styles', (cb) => {
	util.taskGrouper({
		cb:          cb,
		tasks:       ['styles-images', 'styles-compile'],
		cleanPaths:  [paths.dir.cacheInline, paths.dir.cacheSass],
		cleanBundle: (name, bundle) => {
			return [`${paths.dir.root}/${bundle.output.build}/${paths.build.styles}`, `${paths.dir.cacheStyles}/${name}`];
		}
	});
});
