//-------------------------------------
//-- Scripts
//-------------------------------------
'use strict';

// const debug = require('gulp-debug');
const { exec }     = require('child_process');
const corejs       = require('core-js-builder');
const gulp         = require('gulp');
const cache        = require('gulp-cached');
const eslint       = require('gulp-eslint-new');
const gulpif       = require('gulp-if');
const lec          = require('gulp-line-ending-corrector');
const uglify       = require('gulp-uglify');
const cloneDeep    = require('lodash.clonedeep');
const modernizr    = require('modernizr');
const pluralize    = require('pluralize');
const fsp          = require('@absolunet/fsp');
const fss          = require('@absolunet/fss');
const include      = require('@absolunet/gulp-include');
const { terminal } = require('@absolunet/terminal');
const env          = require('../helpers/env'); // eslint-disable-line unicorn/prevent-abbreviations
const flow         = require('../helpers/flow');
const paths        = require('../helpers/paths');
const toolbox      = require('../helpers/toolbox');
const util         = require('../helpers/util');


module.exports = () => {

	//-- Lint JS
	flow.createTask('scripts-lint', ({ taskName }) => {
		return gulp.src(paths.files.scriptsLint)
			// .pipe(toolbox.plumber())   // skip cuz of watch

			.pipe(cache('scripts', { optimizeMemory: true }))

			.pipe(gulpif(env.isWindows, lec()))

			.pipe(eslint({
				resolvePluginsRelativeTo:      paths.directory.root,
				reportUnusedDisableDirectives: 'error'
			}))

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
				[env.id]: env.workflowConfig.version,
				project:  env.packageConfig.name,
				bundle:   name,
				konstan:  util.parseKonstan('scripts', name, env.bundles[name].output)
			};

			streams.push(
				toolbox.vinylStream(paths.filename.konstanScripts, `var konstan = ${JSON.stringify(data, null, '\t')};`)
					.pipe(toolbox.plumber())
					.pipe(gulp.dest(`${paths.directory.cacheScripts}/${name}`))
			);
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

		return toolbox.fakeStream((callback) => {

			const modernizrBuild = new Promise((resolve) => {
				modernizr.build(fss.readYaml(paths.config.modernizr), (result) => {
					const file = `${paths.directory.cacheScripts}/${paths.filename.modernizr}.${paths.extension.scripts}`;
					fsp.ensureFile(file).then(() => {
						fss.writeFile(file, result);
						log('Modernizr', file);
						resolve();
					});
				});
			});

			const lodashBuild = new Promise((resolve) => {
				const options = util.parseLodash();
				const file    = `${paths.directory.cacheScripts}/${paths.filename.lodash}.${paths.extension.scripts}`;

				exec(`node ${paths.config.lodashBin} ${options} --development --output ${file}`, (error, stdout, stderr) => {
					if (error !== null) {
						terminal.error(stderr);
					}
					log('Lodash', file);
					resolve();
				});
			});

			const polyfillBuild = new Promise((resolve) => {
				const file = `${paths.directory.cacheScripts}/${paths.filename.polyfill}.${paths.extension.scripts}`;

				corejs({
					modules:  ['web', 'es'],
					targets:  env.configRaw.polyfill,
					filename: file
				}).then(() => {
					fsp.appendFile(file, fss.readFile(paths.config.regeneratorRuntime, 'utf8')).then(() => {
						log('core-js polyfill', file);
						resolve();
					});
				});
			});


			Promise.all([modernizrBuild, lodashBuild, polyfillBuild]).then(() => {
				flow.skipOnWatch(taskName);
				callback();
			});

		});

	});


	//-- Compile
	flow.createTask(
		'scripts-compile',

		({ taskName }) => {
			const streams = [];

			for (const name of Object.keys(env.bundles)) {
				const bundle = env.bundles[name];

				// Babel extra allowed
				const babelExtraAllowed = util.getBabelAllowedRules(bundle.scripts.allowBabel);

				// For each collection
				for (const collection of Object.keys(bundle.scripts.collections)) {
					const list = cloneDeep(bundle.scripts.collections[collection]);

					// Resolve real filepaths
					const replacements = {
						konstan:   `${paths.folder.cacheScripts}/${name}/${paths.filename.konstan}`,
						lodash:    `${paths.folder.cacheScripts}/${paths.filename.lodash}`,
						modernizr: `${paths.folder.cacheScripts}/${paths.filename.modernizr}`,
						polyfill:  `${paths.folder.cacheScripts}/${paths.filename.polyfill}`
					};
					for (const title of Object.keys(replacements)) {
						const pos = list.indexOf(`~${title}`);
						if (pos !== -1) {
							list[pos] = replacements[title];
						}
					}

					// Require each file
					list.forEach((file, index) => {
						list[index] = `//= require ${file}`;
					});

					const toMinify    = (bundle.scripts.options.minify && !env.watching) || env.production;
					const filename    = `${collection}.${paths.extension.scripts}`;
					const destination = `${bundle.output.build}/${paths.build.scripts}`;
					const source      = `${util.getGeneratedBanner(name)} (function(global, undefined) { \n\t${list.join('\n')}\n })(typeof window !== 'undefined' ? window : this);\n`;

					streams.push(
						toolbox.vinylStream(filename, source)
							.pipe(toolbox.plumber())

							.pipe(include({
								basePath:      paths.directory.root,
								autoExtension: true,
								partialPrefix: true,
								fileProcess:   (options) => {
									return util.babelProcess(options, bundle.scripts.options.babel, babelExtraAllowed);
								}
							}))

							.pipe(gulpif(toMinify, uglify({ output: { comments: 'some' } })))

							.pipe(gulp.dest(`${paths.directory.root}/${destination}`))

							.on('finish', () => {
								toolbox.log(taskName, `'${destination}/${filename}' written`, toolbox.filesize(`${paths.directory.root}/${destination}/${filename}`));
							})
					);
				}
			}

			return toolbox.mergeStreams(streams);

		},

		gulp.parallel('scripts-lint', 'scripts-constants', 'scripts-vendors')
	);






	//-- Rebuild
	flow.createSequence('scripts', gulp.series('scripts-compile'), {
		cleanBundle: ({ name, bundle }) => {
			const buildPath = `${paths.directory.root}/${bundle.output.build}/${paths.build.scripts}`;
			const cachePath = `${paths.directory.cacheScripts}/${name}`;

			if (env.isScopeSubbundle) {
				return Object.keys(bundle.scripts.collections).flatMap((collection) => {
					return [
						`${buildPath}/${collection}.${paths.extension.scripts}`,
						`${cachePath}/${collection}.${paths.extension.scripts}`
					];
				});
			}

			return [buildPath, cachePath];
		}
	});

};
