//-------------------------------------
//-- Scripts
//-------------------------------------
'use strict';

const _         = require('lodash');
const yaml      = require('js-yaml');
const fs        = require('fs');
const fsExtra   = require('fs-extra');
const { exec }  = require('child_process');
const async     = require('async');
const merge     = require('merge-stream');
const gulp      = require('gulp');
const gulpif    = require('gulp-if');
const cache     = require('gulp-cached');
const include   = require('gulp-nwayo-include');
const uglifyjs  = require('uglify-js');
const minifier  = require('gulp-uglify/minifier');
const eslint    = require('gulp-eslint');
const modernizr = require('modernizr');
// const debug = require('gulp-debug');

const PATH = global.nwayo.path;
const ENV  = global.nwayo.env;
const Util = global.nwayo.util;

let vendorCached = false;



//-- Lint JS
gulp.task('scripts-lint', () => {

	return gulp.src(PATH.files.scriptsLint)
		.pipe(cache('scripts', { optimizeMemory:true }))

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

	for (const name of Object.keys(ENV.bundles)) {
		const data = {
			nwayo:   ENV.pkg.nwayo.version,
			project: ENV.pkg.name,
			bundle:  name,
			konstan: Util.parseKonstan('scripts', name, ENV.bundles[name].output.url)
		};

		streams.push(
			Util.vinylStream(PATH.filename.konstanScripts, `var konstan = ${JSON.stringify(data, null, '\t')};`)
				.pipe(gulp.dest(`${PATH.dir.cacheScripts}/${name}`))
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
				modernizr.build(yaml.safeLoad(fs.readFileSync(PATH.config.modernizr, 'utf8')), (result) => {
					const file = `${PATH.dir.cacheScripts}/${PATH.filename.modernizr}.${PATH.ext.scripts}`;
					fsExtra.ensureFile(file, () => {
						fs.writeFileSync(file, result);
					});
					callback(null);
				});
			},

			// lodash
			(callback) => {
				const config  = JSON.parse(fs.readFileSync(PATH.config.lodashPackage, 'utf8'));
				const options = Util.parseLodash();

				exec(`node ${PATH.config.lodashRoot}/${config.bin.lodash} ${options} --development --output ${PATH.dir.cacheScripts}/${PATH.filename.lodash}.${PATH.ext.scripts}`, (error, stdout, stderr) => {
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

	for (const name of Object.keys(ENV.bundles)) {
		const bundle = ENV.bundles[name];

		// Babel rules
		const babelRules = Util.getBabelRules(bundle.scripts.allowBabel);

		// For each collection
		for (const collection of Object.keys(bundle.scripts.collections)) {
			const list = _.cloneDeep(bundle.scripts.collections[collection]);

			// Resolve real filepaths
			const replacements = {
				konstan:   `${PATH.dir.cacheScripts}/${name}/${PATH.filename.konstan}`,
				lodash:    `${PATH.dir.cacheScripts}/${PATH.filename.lodash}`,
				modernizr: `${PATH.dir.cacheScripts}/${PATH.filename.modernizr}`
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

			const source = `${Util.getGeneratedBanner(name)} (function(global, undefined) { \n\t${list.join('\n')}\n })(typeof window !== 'undefined' ? window : this);\n`;

			streams.push(
				Util.vinylStream(`${collection}.${PATH.ext.scripts}`, source)
					.pipe(include({
						basePath:      './',
						autoExtension: true,
						partialPrefix: true,
						fileProcess:   (options) => {
							return Util.babelProcess(options, babelRules);
						}
					}))
					.pipe(gulpif(bundle.scripts.options.minify && !ENV.watching, minifier({ preserveComments:'license' }, uglifyjs)))
					.pipe(gulp.dest(`${bundle.output.build}/${PATH.build.scripts}`))
			);
		}
	}

	return merge(...streams)
		.on('end', () => { return Util.watchableTaskCompleted('Scripts compilation'); })
	;
});


//-- Rebuild
gulp.task('scripts', (cb) => {
	Util.taskGrouper({
		cb:          cb,
		tasks:       ['scripts-compile'],
		cleanBundle: (name, bundle) => {
			return [`${bundle.output.build}/${PATH.build.scripts}`, `${PATH.dir.cacheScripts}/${name}`];
		}
	});
});
