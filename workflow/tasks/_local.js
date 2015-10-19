//-------------------------------------
//-- Local
//-------------------------------------
'use strict';

let merge = require('merge-stream');
let gulp  = require('gulp');
//let debug = require('gulp-debug');

const PATH = global.nwayo.path;
const ENV  = global.nwayo.env;
const Util = global.nwayo.util;




//-- Convert constants to JSON
gulp.task('local-constants', () => {
	let streams = [];

	for (let name of Object.keys(ENV.bundles)) {
		let bundle = ENV.bundles[name];

		let data = {
			GENERATION: Util.getGeneratedBanner(name, 'text'),
			nwayo:      ENV.pkg.nwayo.version,
			project:    ENV.pkg.name,
			bundle:     name,
			konstan:    Util.parseKonstan('local', bundle.output.url)
		};

		streams.push(
			Util.vinylStream(PATH.filename.konstanLocal, JSON.stringify(data, null, 2))
				.pipe( gulp.dest(bundle.output.konstan) )
		);
	}

	return merge.apply(null, streams);
});




//-- Rebuild
gulp.task('local', cb => {
	Util.taskGrouper({ cb,
		tasks:       ['local-constants'],
		cleanBundle: (name, bundle) => {
			return [`${bundle.output.konstan}/${PATH.filename.konstanLocal}`];
		}
	});
});
