//-------------------------------------
//-- Rebuild
//-------------------------------------
'use strict';

// const debug = require('gulp-debug');
const gulp    = require('gulp');
const fss     = require('@absolunet/fss');
const env     = require('~/helpers/env');
const flow    = require('~/helpers/flow');
const paths   = require('~/helpers/paths');
const toolbox = require('~/helpers/toolbox');
const util    = require('~/helpers/util');


module.exports = () => {

	util.loadAllTasks();


	//-- Rebuild scripts & styles
	flow.createSequence('rebuild-ss', gulp.series('scripts', 'styles'));


	//-- Rebuild
	flow.createSequence('rebuild', gulp.series(() => {

		return toolbox.fakeStream((cb) => {
			for (const name of Object.keys(env.bundles)) {
				fss.outputFile(`${paths.dir.root}/${env.bundles[name].output.build}/readme-${env.id}.md`, `# ${util.getGeneratedBanner(name, 'text')}\n`);
			}
			cb();
		});

	}, 'assets', 'icons', 'local', 'scripts', 'styles'));

};
