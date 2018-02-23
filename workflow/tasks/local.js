//-------------------------------------
//-- Local
//-------------------------------------
'use strict';

// const debug = require('gulp-debug');
const gulp    = require('gulp');
const merge   = require('merge-stream');
const env     = require('../helpers/env');
const flow    = require('../helpers/flow');
const paths   = require('../helpers/paths');
const toolbox = require('../helpers/toolbox');
const util    = require('../helpers/util');






//-- Convert constants to JSON
flow.createTask('local-constants', () => {
	const streams = [];

	for (const name of Object.keys(env.bundles)) {
		const bundle = env.bundles[name];

		const data = {
			GENERATION: util.getGeneratedBanner(name, 'text'),
			nwayo:      env.workflowPkg.version,
			project:    env.pkg.name,
			bundle:     name,
			konstan:    util.parseKonstan('local', name, bundle.output.url)
		};

		streams.push(
			toolbox.vinylStream(paths.filename.konstanLocal, JSON.stringify(data, null, 2))
				.pipe(gulp.dest(`${paths.dir.root}/${bundle.output.konstan}`))
		);
	}

	return merge(...streams);
});






//-- Rebuild
flow.createSequence('local', gulp.series('local-constants'), {
	cleanBundle: ({ name, bundle }) => {
		return [`${paths.dir.root}/${bundle.output.konstan}/${paths.filename.konstanLocal}`];
	}
});
