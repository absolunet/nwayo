//-------------------------------------
//-- Scripts
//-------------------------------------
'use strict';

const path      = require('path');
const _         = require('lodash');
const yaml      = require('js-yaml');
const fs        = require('fs');
const fsExtra   = require('fs-extra');
const exec      = require('child_process').exec;
const async     = require('async');
const merge     = require('merge-stream');
const gulp      = require('gulp');
const gulpif    = require('gulp-if');
const cache     = require('gulp-cached');
const include   = require('gulp-nwayo-include');
const uglify    = require('gulp-uglify');
const jshint    = require('gulp-jshint');
const jscs      = require('gulp-jscs');
const stylish   = require('gulp-jscs-stylish');
const modernizr = require('modernizr');
//const debug = require('gulp-debug');

const PATH = global.nwayo.path;
const ENV  = global.nwayo.env;
const Util = global.nwayo.util;

let vendorCached = false;



//-- Lint JS
gulp.task('scripts-lint', () => {

	return gulp.src(PATH.files.scriptsLint)
		.pipe( cache('scripts', {optimizeMemory:true}) )

		.pipe( jshint() )
		.pipe( jscs() )

		.pipe( stylish.combineWithHintResults() )
		.pipe( jshint.reporter('jshint-stylish') )

		.pipe( jshint.reporter({
			reporter: files => {
				files.forEach( file => {
					let filepath = file.file;
					if (!path.isAbsolute(filepath)) {
						filepath = path.normalize(`${__dirname}${path.sep}..${path.sep}..${path.sep}${filepath}`);
					}
					delete cache.caches.scripts[filepath];
				});
			}
		}))

		.pipe( jshint.reporter('fail') )
	;
});


//-- Convert constants to JS
gulp.task('scripts-constants', () => {
	let streams = [];

	for (let name of Object.keys(ENV.bundles)) {
		let data = {
			nwayo:   ENV.pkg.nwayo.version,
			project: ENV.pkg.name,
			bundle:  name,
			konstan: Util.parseKonstan('scripts', name, ENV.bundles[name].output.url)
		};

		streams.push(
			Util.vinylStream(PATH.filename.konstanScripts, `var konstan = ${JSON.stringify(data, null, '\t')};`)
				.pipe( gulp.dest(`${PATH.dir.cacheScripts}/${name}`))
		);
	}

	return merge.apply(null, streams);
});


//-- Generate vendor libraries
gulp.task('scripts-vendors', (cb) => {

	let done = () => {
		vendorCached = true;
		cb();
	};

	// Run once on 'watch'
	if (!vendorCached) {

		async.parallel([

			// Modernizr
			(callback) => {
				modernizr.build(yaml.safeLoad(fs.readFileSync(PATH.config.modernizr, 'utf8')), function (result) {
					let file = `${PATH.dir.cacheScripts}/${PATH.filename.modernizr}.${PATH.ext.scripts}`;
					fsExtra.ensureFile(file, () => {
						fs.writeFileSync(file, result);
					});
					callback(null);
				});
			},

			// lodash
			(callback) => {
				let config  = JSON.parse(fs.readFileSync(PATH.config.lodashPackage, 'utf8'));
				let options = Util.parseLodash();

				exec(`node ${PATH.config.lodashRoot}/${config.bin.lodash} ${options} --development --output ${PATH.dir.cacheScripts}/${PATH.filename.lodash}.${PATH.ext.scripts}`, (error, stdout, stderr) => {
					if (error !== null) {
						console.log(stderr);
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
	let streams = [];

	for (let name of Object.keys(ENV.bundles)) {
		let bundle = ENV.bundles[name];

		// For each collection
		for (let collection of Object.keys(bundle.scripts.collections)) {
			let list = _.cloneDeep(bundle.scripts.collections[collection]);

			// Resolve real filepaths
			let replacements = {
				konstan:   `${PATH.dir.cacheScripts}/${name}/${PATH.filename.konstan}`,
				lodash:    `${PATH.dir.cacheScripts}/${PATH.filename.lodash}`,
				modernizr: `${PATH.dir.cacheScripts}/${PATH.filename.modernizr}`
			};
			for (let name of Object.keys(replacements)) {
				let pos = list.indexOf(`~${name}`);
				if (pos !== -1) {
					list[pos] = replacements[name];
				}
			}

			// Require each file
			list.forEach((file, i) => {
				list[i] = `//= require ${file}`;
			});

			let source = `${Util.getGeneratedBanner(name)} (function(global, undefined) { \n\t${list.join('\n')}\n })(typeof window !== 'undefined' ? window : this);\n`;

			streams.push(
				Util.vinylStream(`${collection}.${PATH.ext.scripts}`, source)
					.pipe( include({
						basePath: './',
						autoExtension: true,
						partialPrefix: true,
						fileProcess: Util.babelProcess
					}))
					.pipe( gulpif( bundle.scripts.options.minify && !ENV.watching, uglify({preserveComments:'some'})) )
					.pipe( gulp.dest(`${bundle.output.build}/${PATH.build.scripts}`) )
			);
		}
	}

	return merge.apply(null, streams)
		.on('end', () => Util.watchableTaskCompleted('Scripts compilation') )
	;
});


//-- Rebuild
gulp.task('scripts', cb => {
	Util.taskGrouper({ cb,
		tasks:       ['scripts-compile'],
		cleanBundle: (name, bundle) => {
			return [`${bundle.output.build}/${PATH.build.scripts}`, `${PATH.dir.cacheScripts}/${name}`];
		}
	});
});
