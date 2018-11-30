//-------------------------------------
//-- Styles
//-------------------------------------
'use strict';

// const debug = require('gulp-debug');
const gulp         = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cache        = require('gulp-cached');
const cssnano      = require('gulp-cssnano');
const gulpsass     = require('gulp-dart-sass');
const gulpif       = require('gulp-if');
const imagemin     = require('gulp-imagemin');
const insert       = require('gulp-insert');
const jsonsass     = require('gulp-json-sass');
const rename       = require('gulp-rename');
const sourcemaps   = require('gulp-sourcemaps');
const stylelint    = require('gulp-stylelint');
const cloneDeep    = require('lodash.clonedeep');
const pluralize    = require('pluralize');
const jsonToScss   = require('@absolunet/json-to-scss');
const env          = require('~/helpers/env');
const flow         = require('~/helpers/flow');
const paths        = require('~/helpers/paths');
const toolbox      = require('~/helpers/toolbox');
const util         = require('~/helpers/util');


module.exports = () => {

	//-- Inline images optimization
	flow.createTask('styles-images', () => {
		return gulp.src(paths.files.inline, { base:paths.dir.root })
			.pipe(toolbox.plumber())
			.pipe(imagemin())
			.pipe(rename(util.assetsRename()))
			.pipe(gulp.dest(paths.dir.cache))
		;
	});


	//-- Lint SCSS
	flow.createTask('styles-lint', ({ taskName }) => {

		let hasErrors = false;

		return gulp.src(paths.files.stylesLint)
			// .pipe(toolbox.plumber())   // skip cuz of watch

			.pipe(cache('styles', { optimizeMemory:true }))

			.pipe(stylelint({
				configFile:     paths.config.stylelint,
				syntax:         'scss',
				failAfterError: true,
				reporters: [
					{
						formatter: (results) => {
							hasErrors = false;

							results.forEach((item) => {
								if (item.warnings.length !== 0 || item.deprecations.length !== 0 || item.invalidOptionWarnings.length !== 0) {
									delete cache.caches.styles[item.source];

									if (!hasErrors) {
										item.warnings.forEach((flag) => {
											if (flag.severity === 'error') {
												hasErrors = true;
											}
										});
									}
								}
							});

							if (!hasErrors) {
								toolbox.log(taskName, `${pluralize('file', results.length, true)} linted`);
							}
						}
					},
					{
						formatter: 'string',
						console:   true
					},
					{
						formatter: () => {
							flow.showDelayedLog(hasErrors);
						}
					}
				]
			}))
		;
	});


	//-- Convert constants to SCSS
	flow.createTask('styles-constants', ({ taskName }) => {
		const streams = [];

		for (const name of Object.keys(env.bundles)) {
			const data = util.parseKonstan('styles', name, env.bundles[name].output);
			data.bundle = `'${name}'`;

			const konstanJson = JSON.stringify({ konstan:data });

			/* eslint-disable function-paren-newline */
			streams.push(
				toolbox.vinylStream(paths.filename.konstanStyles, konstanJson)
					.pipe(toolbox.plumber())
					.pipe(jsonsass())
					.pipe(insert.prepend(`${jsonToScss.convert(konstanJson)}\n\n`))
					.pipe(gulp.dest(`${paths.dir.cacheStyles}/${name}`))
			);
			/* eslint-enable function-paren-newline */
		}

		return toolbox.mergeStreams(streams).on('finish', () => {
			flow.skipOnWatch(taskName);
			toolbox.log(taskName, `${pluralize('file', streams.length, true)} generated`);
		});
	});


	//-- Compile
	flow.createTask('styles-compile', ({ taskName }) => {
		const sassFunctions = require(paths.config.sassFunctions);  // eslint-disable-line global-require

		const streams = [];

		for (const name of Object.keys(env.bundles)) {
			const bundle = env.bundles[name];

			// For each collection
			for (const collection of Object.keys(bundle.styles.collections)) {
				const list = cloneDeep(bundle.styles.collections[collection]);

				// Add konstan
				list.unshift(`${paths.dir.cacheStyles}/${name}/${paths.filename.konstan}`);

				// Require each file
				list.forEach((file, i) => {
					list[i] = `@import '${file}';`;
				});

				const toMinify      = (bundle.styles.options.minify && !env.watching) || env.prod;
				const toSourcemaps  = bundle.styles.options.sourcemaps && !env.prod;
				const filename      = `${collection}.${paths.ext.build}`;
				const filenameBuild = `${collection}.${paths.ext.stylesBuild}`;
				const dest          = `${bundle.output.build}/${paths.build.styles}`;
				const source        = `${util.getGeneratedBanner(name)}${list.join('\n')}\n`;

				/* eslint-disable function-paren-newline */
				streams.push(
					toolbox.vinylStream(filename, source)
						.pipe(toolbox.plumber())

						// Note however that by default, renderSync() is more than twice as fast as render(), due to the overhead of asynchronous callbacks. (https://github.com/sass/dart-sass#javascript-api)
						.pipe(
							gulpsass.sync({
								includePaths: [paths.dir.root],
								functions:    sassFunctions       // *.css in a function ?
								// sourcemaps  (bundle.styles.options.sourcemaps)
							})
								.on('error', gulpsass.logError)
						)

						.pipe(autoprefixer({ browsers:bundle.styles.options.autoprefixer }))

						.pipe(gulpif(toMinify, cssnano({ autoprefixer:false, discardUnused:false, mergeIdents:false, reduceIdents:false, zindex:false })))

						.pipe(gulpif(toSourcemaps, sourcemaps.write('maps', {
							includeContent: false,
							sourceRoot:     'source'
						})))

						.pipe(gulp.dest(`${paths.dir.root}/${dest}`))

						.on('finish', () => {
							toolbox.log(taskName, `'${dest}/${filenameBuild}' written`, toolbox.filesize(`${paths.dir.root}/${dest}/${filenameBuild}`));
						})
				);
				/* eslint-enable function-paren-newline */
			}
		}

		return toolbox.mergeStreams(streams);

	}, gulp.parallel('styles-lint', 'styles-constants'));






	//-- Rebuild
	flow.createSequence('styles', gulp.series('styles-images', 'styles-compile'), {
		cleanPaths:  [paths.dir.cacheInline, paths.dir.cacheSass],
		cleanBundle: ({ name, bundle }) => {
			return [
				`${paths.dir.root}/${bundle.output.build}/${paths.build.styles}`,
				`${paths.dir.cacheStyles}/${name}`
			];
		}
	});

};
