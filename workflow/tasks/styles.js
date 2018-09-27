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
const pluralize    = require('pluralize');
const fss          = require('@absolunet/fss');
const env          = require('~/helpers/env');
const flow         = require('~/helpers/flow');
const paths        = require('~/helpers/paths');
const toolbox      = require('~/helpers/toolbox');
const util         = require('~/helpers/util');






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
		const data = util.parseKonstan('styles', name, env.bundles[name].output.url);
		data.bundle = `'${name}'`;

		/* eslint-disable function-paren-newline */
		streams.push(
			toolbox.vinylStream(paths.filename.konstanStyles, JSON.stringify({ konstan:data }))
				.pipe(toolbox.plumber())
				.pipe(jsonsass())
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
flow.createTask('styles-compile', () => {
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
		const toMinify     = (bundle.styles.options.minify && !env.watching) || env.prod;
		const toSourcemaps = bundle.styles.options.sourcemaps && !env.prod;

		/* eslint-disable function-paren-newline */
		streams.push(
			sass(`${paths.dir.cacheStyles}/${name}/collections/*.${paths.ext.styles}`, {
				loadPath:      paths.dir.root,
				cacheLocation: paths.dir.cacheSass,
				require:       paths.config.sass,
				trace:         true,
				sourcemap:     bundle.styles.options.sourcemaps
			})

				.pipe(toolbox.plumber())

				.pipe(autoprefixer({ browsers:bundle.styles.options.autoprefixer }))

				.pipe(gulpif(toMinify, cssnano({ reduceIdents:false, zindex:false })))

				.pipe(gulpif(toSourcemaps, sourcemaps.write('maps', {
					includeContent: false,
					sourceRoot:     'source'
				})))

				.pipe(gulp.dest(`${paths.dir.root}/${bundle.output.build}/${paths.build.styles}`))
		);
		/* eslint-enable function-paren-newline */
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
