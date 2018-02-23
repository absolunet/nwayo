//-------------------------------------
//-- Flow
//-------------------------------------
'use strict';

const gulp     = require('gulp');
const ora      = require('ora');
const fss      = require('@absolunet/fss');
const terminal = require('@absolunet/terminal');
const env      = require('../helpers/env');
const paths    = require('../helpers/paths');


//-- Static properties
const STATIC = global.___NwayoFlow___ ? global.___NwayoFlow___ : global.___NwayoFlow___ = {
	watchSpinner: false,
	watchTicker:  0
};






module.exports = class flow {

	//-- Create gulp task
	static createTask(name, task) {
		gulp.task(name, () => {
			const start = new Date();
			terminal.echo(`${name} Start`);

			return task().on('finish', () => {
				terminal.echo(`/${name} Finish - [${(new Date() - start) / 1000}s]`);
			});
		});
	}


	//-- Create tasks sequence
	static createSequence(name, sequence, { cleanPaths = [], cleanBundle } = {}) {
		gulp.task(name, () => {
			const start = new Date();
			terminal.echo(`${name} Start`);

			// Global paths to delete
			const list = cleanPaths;

			// Bundles paths to delete
			if (cleanBundle) {
				for (const name of Object.keys(env.bundles)) {
					list.push(...cleanBundle({ name:name, bundle:env.bundles[name] }));
				}
			}

			// Delete
			fss.del(list);

			gulp.series(sequence, () => {
				terminal.echo(`/${name} End - [${(new Date() - start) / 1000}s]`);
			})();
		});
	}


	//-- Watcher sequence
	static watchSequence(files, ...tasks) {
		return gulp.watch(files, gulp.series(
			...tasks,

			(cb) => {
				terminal.echo(`Scout #${STATIC.watchTicker} shift ended\n`);
				this.startWatchSpinner();
				cb();
			}
		)).on('all', (action, triggeredPath) => {
			STATIC.watchSpinner.stop();
			terminal.echo(`Scout #${STATIC.watchTicker} alerted by ${triggeredPath.split(`${paths.dir.root}/`)[1]} calling ${tasks.join(', ')}`);
		});
	}


	//-- Watch spinner
	static startWatchSpinner() {
		terminal.spacer();

		STATIC.watchSpinner = ora({
			text:    `Scout #${++STATIC.watchTicker} recceing...`,
			spinner: {
				interval: 250,
				frames: [
					'●',
					'○'
				]
			},
			color:   'green'
		}).start();
	}

};
