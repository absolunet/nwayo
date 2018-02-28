//-------------------------------------
//-- Flow
//-------------------------------------
'use strict';

const chalk    = require('chalk');
const globAll  = require('glob-all');
const gulp     = require('gulp');
const log      = require('fancy-log');
const ora      = require('ora');
const emoji    = require('node-emoji');
const fss      = require('@absolunet/fss');
const terminal = require('@absolunet/terminal');
const env      = require('../helpers/env');
const paths    = require('../helpers/paths');
const toolbox  = require('../helpers/toolbox');


//-- Static properties
const STATIC = global.___NwayoFlow___ ? global.___NwayoFlow___ : global.___NwayoFlow___ = {
	standingSpinner: false,  // Recceing spinner
	totalWatchers:   0,      // Total of called watchers
	activeWatchers:  0,      // Number of currently running watchers
	cascadeSkip:     false,  // In watch mode, is currently skipping tasks because of one failed task ?
	watchSkip:       {}      // In watch mode, skip these tasks
};






const START        = 'Starting';
const END          = 'Finished';
const HALT         = 'Halting';
const ALERT        = 'Alerted';
const TASK         = 'task';
const SEQUENCE     = 'sequence';
const DEPENDENCIES = 'dependencies';


const logStep = (action, scope, name, start) => {
	const logType       = action === HALT  ? log : log.warn;
	const logAction     = action === HALT  ? chalk.yellow(action) : action;
	const nameStyles    = scope === TASK ? chalk.cyan : chalk.cyan.underline;
	const logName       = action === START ? nameStyles(name) : nameStyles.dim(name);
	const logScopedName = scope === DEPENDENCIES ? `${logName} ${scope}` : `${scope} ${logName}`;
	const logTime       = start ? `after ${chalk.magenta(`${(new Date() - start) / 1000}s`)}` : '';

	logType(`${logAction} ${logScopedName} ${logTime}`);
};


const logGuard = (action, file, name) => {
	switch (action) {

		case START:
			return `${emoji.get('guardsman')}  Guard n°${STATIC.totalWatchers + 1} standing guard...`;

		case ALERT:
			return terminal.echo(`${emoji.get('mega')}  Guard n°${++STATIC.totalWatchers} alerted by ${chalk.magenta(file.split(`${paths.dir.root}/`)[1])} calling ${chalk.cyan(name)}`);

		case END:
			return terminal.echo(`${emoji.get('zzz')}  Guard n°${STATIC.totalWatchers - STATIC.activeWatchers} duty is completed\n`);

		default: return undefined;

	}
};






const isSkipping = (name) => {
	return STATIC.cascadeSkip || STATIC.watchSkip[name];
};


const runTask = ({ name, task, start }) => {
	return task({ taskName:name })

		// Log task as completed
		.on('finish', () => {
			if (!STATIC.cascadeSkip) {
				logStep(END, TASK, name, start);
			} else {
				logStep(HALT, TASK, name);
			}
		})

		// Error
		.on('error', function() {

			// In watch mode, cascade skip all pending tasks
			if (env.watching) {
				STATIC.cascadeSkip = true;

			// In run mode, rage quit  (╯°□°）╯︵ ┻━┻
			} else {
				terminal.exit();
			}

			// Close stream
			this.emit('end');
		})
	;
};






module.exports = class flow {

	//-- Create gulp task
	static createTask(name, task, dependencies) {
		gulp.task(name, (cb) => {

			// Run task if not skipping tasks
			if (!isSkipping(name)) {
				const start = new Date();

				// Run task dependencies first
				if (dependencies) {
					logStep(START, DEPENDENCIES, name);

					return gulp.series(dependencies, () => {  // eslint-disable-line consistent-return

						// Run task if not skipping
						if (!isSkipping()) {
							logStep(END, DEPENDENCIES, name);
							logStep(START, TASK, name);

							// Then run task
							runTask({ name, task, start }).on('finish', () => {

								// Close stream
								return cb ? cb() : undefined;
							});

						} else {
							logStep(HALT, DEPENDENCIES, name);

							// Close stream
							return cb ? cb() : undefined;
						}

					})();
				}

				// If no dependencies run task immediately
				logStep(START, TASK, name);

				return runTask({ name, task, start });
			}

			// ADD VERBOSE MODE LOGGING SKIPS

			// Else skip task
			return toolbox.selfClosingStream();
		});
	}


	//-- Create tasks sequence
	static createSequence(name, sequence, { cleanPaths = [], cleanBundle } = {}) {
		gulp.task(name, (cb) => {
			const start = new Date();
			logStep(START, SEQUENCE, name);

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

			// Run sequence
			gulp.series(sequence, () => {

				// Log sequence as completed
				if (!STATIC.cascadeSkip) {
					logStep(END, SEQUENCE, name, start);
				} else {
					logStep(HALT, SEQUENCE, name);
				}

				// Close stream
				return cb ? cb() : undefined;
			})();
		});
	}


	//-- Create watch tasks sequence
	static watchSequence(name, patterns, sequence) {

		// Can't trust chokidar to do globbing
		const files = globAll.sync(patterns);

		return gulp.watch(files, gulp.series(sequence, (cb) => {

			// Log watcher as completed
			--STATIC.activeWatchers;
			logGuard(END);

			// When there is no more running watchers
			if (STATIC.activeWatchers === 0) {
				this.startWatchSpinner();
			}

			cb();
		}))

			// When watcher triggered
			.on('all', (action, triggeredPath) => {
				++STATIC.activeWatchers;
				STATIC.standingSpinner.stop();
				logGuard(ALERT, triggeredPath, name);
			})
		;
	}


	//-- Start watch spinner
	static startWatchSpinner() {
		STATIC.cascadeSkip = false;

		terminal.spacer();
		STATIC.standingSpinner = ora({
			text:    logGuard(START),
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


	//-- Add a task to skip
	static skipOnWatch(task) {
		STATIC.watchSkip[task] = true;
	}

};
