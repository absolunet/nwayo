/*
//-------------------------------------
//-- Scripts
//-------------------------------------
'use strict';

// const debug = require('gulp-debug');
const async     = require('async');
const { exec }  = require('child_process');
const gulp      = require('gulp');
const cache     = require('gulp-cached');
const eslint    = require('gulp-eslint');
const gulpif    = require('gulp-if');
const lec       = require('gulp-line-ending-corrector');
const uglify    = require('gulp-uglify');
const _         = require('lodash');
const merge     = require('merge-stream');
const modernizr = require('modernizr');
const fsp       = require('@absolunet/fsp');
const fss       = require('@absolunet/fss');
const include   = require('@absolunet/gulp-include');
const env       = require('../helpers/env');
const paths     = require('../helpers/paths');
const toolbox   = require('../helpers/toolbox');
const util      = require('../helpers/util');


let vendorCached = false;






//-- Lint JS
gulp.task('scripts-lint', () => {

	return gulp.src(paths.files.scriptsLint)
		.pipe(cache('scripts', { optimizeMemory:true }))

		.pipe(gulpif(env.isWindows, lec()))

		.pipe(eslint())

		.pipe(eslint.results((files) => {
			files.forEach((file) => {
				if (file.errorCount || file.warningCount) {
					delete cache.caches.scripts[file.filePath];
				}
			});
		}))

		.pipe(eslint.format('stylish'))

		.pipe(eslint.failAfterError())
	;
});


//-- Convert constants to JS
gulp.task('scripts-constants', () => {
	const streams = [];

	for (const name of Object.keys(env.bundles)) {
		const data = {
			nwayo:   env.workflowPkg.version,
			project: env.pkg.name,
			bundle:  name,
			konstan: util.parseKonstan('scripts', name, env.bundles[name].output.url)
		};

		streams.push(
			toolbox.vinylStream(paths.filename.konstanScripts, `var konstan = ${JSON.stringify(data, null, '\t')};`)
				.pipe(gulp.dest(`${paths.dir.cacheScripts}/${name}`))
		);
	}

	return merge(...streams);
});


//-- Generate vendor libraries
gulp.task('scripts-vendors', (cb) => {

	const done = () => {
		vendorCached = true;
		cb();
	};

	// Run once on 'watch'
	if (!vendorCached) {

		async.parallel([

			// Modernizr
			(callback) => {
				modernizr.build(toolbox.readYAML(paths.config.modernizr), (result) => {
					const file = `${paths.dir.cacheScripts}/${paths.filename.modernizr}.${paths.ext.scripts}`;
					fsp.ensureFile(file).then(() => {
						fss.writeFile(file, result);
					});
					callback(null);
				});
			},

			// lodash
			(callback) => {
				const options = util.parseLodash();

				exec(`node ${paths.config.lodashBin} ${options} --development --output ${paths.dir.cacheScripts}/${paths.filename.lodash}.${paths.ext.scripts}`, (error, stdout, stderr) => {
					if (error !== null) {
						console.log(stderr); // eslint-disable-line no-console
					}
					callback(null);
				});
			}

		], () => { done(); });

	} else {
		done();
	}
});



//-- Compile
gulp.task('scripts-compile', ['scripts-lint', 'scripts-constants', 'scripts-vendors'], () => {
	const streams = [];

	for (const name of Object.keys(env.bundles)) {
		const bundle = env.bundles[name];

		// Babel extra allowed
		const babelExtraAllowed = util.getBabelAllowedRules(bundle.scripts.allowBabel);

		// For each collection
		for (const collection of Object.keys(bundle.scripts.collections)) {
			const list = _.cloneDeep(bundle.scripts.collections[collection]);

			// Resolve real filepaths
			const replacements = {
				konstan:   `${paths.folder.cacheScripts}/${name}/${paths.filename.konstan}`,
				lodash:    `${paths.folder.cacheScripts}/${paths.filename.lodash}`,
				modernizr: `${paths.folder.cacheScripts}/${paths.filename.modernizr}`
			};
			for (const title of Object.keys(replacements)) {
				const pos = list.indexOf(`~${title}`);
				if (pos !== -1) {
					list[pos] = replacements[title];
				}
			}

			// Require each file
			list.forEach((file, i) => {
				list[i] = `//= require ${file}`;
			});

			const source = `${util.getGeneratedBanner(name)} (function(global, undefined) { \n\t${list.join('\n')}\n })(typeof window !== 'undefined' ? window : this);\n`;
			streams.push(
				toolbox.vinylStream(`${collection}.${paths.ext.scripts}`, source)
					.pipe(include({
						basePath:      paths.dir.root,
						autoExtension: true,
						partialPrefix: true,
						fileProcess:   (options) => {
							return util.babelProcess(options, bundle.scripts.options.babel, babelExtraAllowed);
						}
					}))
					.pipe(gulpif(bundle.scripts.options.minify && !env.watching, uglify({ output:{ comments:'some' } })))
					.pipe(gulp.dest(`${paths.dir.root}/${bundle.output.build}/${paths.build.scripts}`))
			);
		}
	}

	return merge(...streams)
		.on('end', () => { return util.watchableTaskCompleted('Scripts compilation'); })
	;
});


//-- Rebuild
gulp.task('scripts', (cb) => {
	util.taskGrouper({
		cb:          cb,
		tasks:       ['scripts-compile'],
		cleanBundle: (name, bundle) => {
			return [`${paths.dir.root}/${bundle.output.build}/${paths.build.scripts}`, `${paths.dir.cacheScripts}/${name}`];
		}
	});
});
*/
