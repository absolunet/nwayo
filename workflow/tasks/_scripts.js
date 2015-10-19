//-------------------------------------
//-- Scripts
//-------------------------------------
'use strict';

//let debug  = require('gulp-debug');
let gulp   = require('gulp');

const PATH = global.nwayo.path;
const ENV  = global.nwayo.env;
const Util = global.nwayo.util;




//-- Lint JS
gulp.task('scripts-lint', () => {
	let cache   = require('gulp-cached');
	let jshint  = require('gulp-jshint');
	let stylish = require('jshint-stylish');

	return gulp.src(PATH.files.scriptsLint)
		.pipe( cache('scripts', {optimizeMemory:true}) )

		.pipe( jshint() )

		.pipe( jshint.reporter({
			reporter: (files) => {
				files.forEach( file => delete cache.caches.scripts[file.file] );
			}
		}))
		.pipe( jshint.reporter(stylish) )
		.pipe( jshint.reporter('fail') )
	;
});


//-- Convert constants to JS
gulp.task('scripts-constants', () => {
	let merge = require('merge-stream');

	let streams = [];
	for (let name of Object.keys(ENV.bundles)) {
		let data = {
			nwayo:   ENV.pkg.nwayo.version,
			project: ENV.pkg.name,
			bundle:  name,
			konstan: Util.parseKonstan('scripts', ENV.bundles[name].output.url)
		};

		streams.push(
			Util.vinylStream(PATH.filename.konstanScripts, `var konstan = ${JSON.stringify(data, null, '\t')};`)
				.pipe( gulp.dest(`${PATH.dir.cacheScripts}/${name}`))
		);
	}

	return merge.apply(null, streams);
});


//-- Compile
gulp.task('scripts-compile', ['scripts-lint', 'scripts-constants'], () => {
	let _       = require('lodash');
	let merge   = require('merge-stream');
	let include = require('gulp-nwayo-include');
	let gulpif  = require('gulp-if');
	let uglify  = require('gulp-uglify');

	let streams = [];

	for (let name of Object.keys(ENV.bundles)) {
		let bundle = ENV.bundles[name];

		// For each collection
		for (let collection of Object.keys(bundle.scripts.collections)) {
			let list = _.cloneDeep(bundle.scripts.collections[collection]);

			// Resolve konstan real filepath
			let pos = list.indexOf('konstan');
			if (pos !== -1) {
				list[pos] = `${PATH.dir.cacheScripts}/${name}/${PATH.filename.konstan}`;
			}

			// Require each file
			list.forEach((file, i) => {
				list[i] = `//= require ${file}`;
 			});

			let source = `${Util.getGeneratedBanner(name)} (function(global, undefined) { \n\t${list.join('\n')}\n })(typeof window !== 'undefined' ? window : this);\n`;

			streams.push(
				Util.vinylStream(`${collection}.${PATH.ext.scripts}`, source)
					.pipe( include({
						basePath:'./',
						autoExtension:true
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
