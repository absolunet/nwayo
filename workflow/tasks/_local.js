//-------------------------------------
//-- Local
//-------------------------------------
'use strict';

const merge = require('merge-stream');
const gulp  = require('gulp');
//const debug = require('gulp-debug');

const PATH = global.nwayo.path;
const ENV  = global.nwayo.env;
const Util = global.nwayo.util;




//-- Convert constants to JSON
gulp.task('local-constants', () => {
	const streams = [];

	for (const name of Object.keys(ENV.bundles)) {
		const bundle = ENV.bundles[name];

		const data = {
			GENERATION: Util.getGeneratedBanner(name, 'text'),
			nwayo:      ENV.pkg.nwayo.version,
			project:    ENV.pkg.name,
			bundle:     name,
			konstan:    Util.parseKonstan('local', name, bundle.output.url)
		};

		streams.push(
			Util.vinylStream(PATH.filename.konstanLocal, JSON.stringify(data, null, 2))
				.pipe( gulp.dest(bundle.output.konstan) )
		);
	}

	return merge(...streams);
});




//-- Rebuild
gulp.task('local', (cb) => {
	Util.taskGrouper({ cb: cb,
		tasks:       ['local-constants'],
		cleanBundle: (name, bundle) => {
			return [`${bundle.output.konstan}/${PATH.filename.konstanLocal}`];
		}
	});
});
