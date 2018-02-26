//-------------------------------------
//-- Flow
//-------------------------------------
'use strict';

const chalk    = require('chalk');
const globAll  = require('glob-all');
const gulp     = require('gulp');
const ora      = require('ora');
const emoji    = require('node-emoji');
const fss      = require('@absolunet/fss');
const terminal = require('@absolunet/terminal');
const env      = require('../helpers/env');
const paths    = require('../helpers/paths');


//-- Static properties
const STATIC = global.___NwayoFlow___ ? global.___NwayoFlow___ : global.___NwayoFlow___ = {
	watchSpinner:     false,
	watchTicker:      0,
	currentlyRunning: 0
};

const color = {
	task:     chalk.cyan,
	sequence: chalk.cyan.underline,
	duration: chalk.magenta,
	file:     chalk.magenta
};






module.exports = class flow {

	//-- Create gulp task
	static createTask(name, task) {
		gulp.task(name, () => {
			const start = new Date();
			terminal.echo(`[Starting task ${color.task(name)}]`);

			return task().on('finish', () => {
				terminal.echo(`[/Finished task ${color.task(name)} after ${color.duration(`${(new Date() - start) / 1000}s`)}]`);
			});
		});
	}


	//-- Create tasks sequence
	static createSequence(name, sequence, { cleanPaths = [], cleanBundle } = {}) {
		gulp.task(name, (cb) => {
			const start = new Date();
			terminal.echo(`[Starting sequence ${color.sequence(name)}]`);

			// Global paths to delete
			const list = cleanPaths;

			// Bundles paths to delete
			if (cleanBundle) {
				for (const bundleName of Object.keys(env.bundles)) {
					list.push(...cleanBundle({ name:bundleName, bundle:env.bundles[bundleName] }));
				}
			}

			// Delete
			fss.del(list, { force:true });

			gulp.series(sequence, () => {
				terminal.echo(`[/Finished sequence ${color.sequence(name)} after ${color.duration(`${(new Date() - start) / 1000}s`)}]`);

				return cb ? cb() : undefined;
			})();
		});
	}


	//-- Create watch tasks sequence
	static watchSequence(name, patterns, sequence) {

		// Can't trust chokidar to do globbing
		const files = globAll.sync(patterns);

		return gulp.watch(files, gulp.series(sequence, (cb) => {
			--STATIC.currentlyRunning;
			terminal.echo(`${emoji.get('zzz')}  Scout #${STATIC.watchTicker - STATIC.currentlyRunning} shift ended\n`);

			if (STATIC.currentlyRunning === 0) {
				this.startWatchSpinner();
			}

			cb();
		})).on('all', (action, triggeredPath) => {
			++STATIC.currentlyRunning;
			STATIC.watchSpinner.stop();
			terminal.echo(`${emoji.get('mega')}  Scout #${++STATIC.watchTicker} alerted by ${color.file(triggeredPath.split(`${paths.dir.root}/`)[1])} calling ${color.task(name)}`);
		});
	}


	//-- Start watch spinner
	static startWatchSpinner() {
		STATIC.watchSpinner = ora({
			text:    `${emoji.get('guardsman')}  Scout #${STATIC.watchTicker + 1} recceing...`,
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
