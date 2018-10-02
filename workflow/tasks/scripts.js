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
const modernizr = require('modernizr');
const pluralize = require('pluralize');
const fsp       = require('@absolunet/fsp');
const fss       = require('@absolunet/fss');
const include   = require('@absolunet/gulp-include');
const terminal  = require('@absolunet/terminal');
const env       = require('~/helpers/env');
const flow      = require('~/helpers/flow');
const paths     = require('~/helpers/paths');
const toolbox   = require('~/helpers/toolbox');
const util      = require('~/helpers/util');






//-- Lint JS
flow.createTask('scripts-lint', ({ taskName }) => {
	return gulp.src(paths.files.scriptsLint)
		// .pipe(toolbox.plumber())   // skip cuz of watch

		.pipe(cache('scripts', { optimizeMemory:true }))

		.pipe(gulpif(env.isWindows, lec()))

		.pipe(eslint())

		.pipe(eslint.results((files) => {
			let hasErrors = false;

			files.forEach((file) => {
				if (file.errorCount || file.warningCount) {
					delete cache.caches.scripts[file.filePath];
					hasErrors = true;
				}
			});

			if (!hasErrors) {
				toolbox.log(taskName, `${pluralize('file', files.length, true)} linted`);
			}
		}))

		.pipe(eslint.format('stylish'))

		.pipe(eslint.failAfterError())
	;
});


//-- Convert constants to JS
flow.createTask('scripts-constants', ({ taskName }) => {
	const streams = [];

	for (const name of Object.keys(env.bundles)) {
		const data = {
			[env.id]: env.workflowPkg.version,
			project:  env.pkg.name,
			bundle:   name,
			konstan:  util.parseKonstan('scripts', name, env.bundles[name].output)
		};

		/* eslint-disable function-paren-newline */
		streams.push(
			toolbox.vinylStream(paths.filename.konstanScripts, `var konstan = ${JSON.stringify(data, null, '\t')};`)
				.pipe(toolbox.plumber())
				.pipe(gulp.dest(`${paths.dir.cacheScripts}/${name}`))
		);
		/* eslint-enable function-paren-newline */
	}

	return toolbox.mergeStreams(streams).on('finish', () => {
		flow.skipOnWatch(taskName);
		toolbox.log(taskName, `${pluralize('file', streams.length, true)} generated`);
	});

});


//-- Generate vendor libraries
flow.createTask('scripts-vendors', ({ taskName }) => {

	const log = (name, file) => {
		toolbox.log(taskName, `${name} built`, toolbox.filesize(file));
	};

	return toolbox.fakeStream((cb) => {

		async.parallel([

			// Modernizr
			(callback) => {
				modernizr.build(fss.readYaml(paths.config.modernizr), (result) => {
					const file = `${paths.dir.cacheScripts}/${paths.filename.modernizr}.${paths.ext.scripts}`;
					fsp.ensureFile(file).then(() => {
						fss.writeFile(file, result);
						log('Modernizr', file);
						callback(null);
					});
				});
			},

			// Lodash
			(callback) => {
				const options = util.parseLodash();
				const file    = `${paths.dir.cacheScripts}/${paths.filename.lodash}.${paths.ext.scripts}`;

				exec(`node ${paths.config.lodashBin} ${options} --development --output ${file}`, (error, stdout, stderr) => {
					if (error !== null) {
						terminal.error(stderr);
					}
					log('Lodash', file);
					callback(null);
				});
			}

		], () => {
			flow.skipOnWatch(taskName);
			cb();
		});

	});

});


//-- Compile
flow.createTask('scripts-compile', ({ taskName }) => {
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

			const toMinify = (bundle.scripts.options.minify && !env.watching) || env.prod;
			const filename = `${collection}.${paths.ext.scripts}`;
			const dest     = `${bundle.output.build}/${paths.build.scripts}`;
			const source   = `${util.getGeneratedBanner(name)} (function(global, undefined) { \n\t${list.join('\n')}\n })(typeof window !== 'undefined' ? window : this);\n`;

			/* eslint-disable function-paren-newline */
			streams.push(
				toolbox.vinylStream(filename, source)
					.pipe(toolbox.plumber())

					.pipe(include({
						basePath:      paths.dir.root,
						autoExtension: true,
						partialPrefix: true,
						fileProcess:   (options) => {
							return util.babelProcess(options, bundle.scripts.options.babel, babelExtraAllowed);
						}
					}))

					.pipe(gulpif(toMinify, uglify({ output:{ comments:'some' } })))

					.pipe(gulp.dest(`${paths.dir.root}/${dest}`))

					.on('finish', () => {
						toolbox.log(taskName, `'${dest}/${filename}' written`, toolbox.filesize(`${paths.dir.root}/${dest}/${filename}`));
					})
			);
			/* eslint-enable function-paren-newline */
		}
	}

	return toolbox.mergeStreams(streams);

}, gulp.parallel('scripts-lint', 'scripts-constants', 'scripts-vendors'));






//-- Rebuild
flow.createSequence('scripts', gulp.series('scripts-compile'), {
	cleanBundle: ({ name, bundle }) => {
		return [
			`${paths.dir.root}/${bundle.output.build}/${paths.build.scripts}`,
			`${paths.dir.cacheScripts}/${name}`
		];
	}
});
