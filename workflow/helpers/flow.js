//-------------------------------------
//-- Flow
//-------------------------------------
'use strict';

const chalk     = require('chalk');
const log       = require('fancy-log');
const globAll   = require('glob-all');
const gulp      = require('gulp');
const emoji     = require('node-emoji');
const ora       = require('ora');
const pluralize = require('pluralize');
const fss       = require('@absolunet/fss');
const terminal  = require('@absolunet/terminal');
const env       = require('../helpers/env');
const paths     = require('../helpers/paths');
const toolbox   = require('../helpers/toolbox');


//-- Static properties
const STATIC = global.___NwayoFlow___ ? global.___NwayoFlow___ : global.___NwayoFlow___ = {
	standingSpinner: false,  // Recceing spinner
	totalGuards:     0,      // Total of called guards
	activeGuards:    {},     // Registry of guards that are currently running
	ignoredChanges:  {},     // Registry of changes that were made during a watched task
	cascadeSkip:     false,  // In watch mode, is currently skipping tasks because of one failed task ?
	watchSkip:       {},     // In watch mode, skip these tasks
	delayedLog:      false   // Patch for stylelint reporter
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
	const nameStyles    = scope  === TASK ? chalk.cyan : chalk.cyan.underline;
	const logName       = action === START ? nameStyles(name) : nameStyles.dim(name);
	const logScopedName = scope  === DEPENDENCIES ? `${logName} ${scope}` : `${scope} ${logName}`;
	const logTime       = start ? `after ${chalk.magenta(`${(new Date() - start) / 1000}s`)}` : '';

	logType(`${logAction} ${logScopedName} ${logTime}`);
};


const logGuard = (action, name, file) => {
	switch (action) {

		case START:
			return `${emoji.get('guardsman')}  Guard n°${STATIC.totalGuards + 1} standing guard...`;

		case ALERT:
			return terminal.echo(`${emoji.get('mega')}  Guard n°${STATIC.totalGuards} alerted by ${chalk.magenta(file.split(`${paths.dir.root}/`)[1])} calling ${chalk.cyan(name)}`);

		case END:
			return terminal.echo(`${emoji.get('zzz')}  Guard n°${STATIC.activeGuards[name]} duty is completed ${chalk.cyan.dim(`(${name})`)}${
				STATIC.ignoredChanges[name] ? chalk.yellow(`    ⚠ ${pluralize('change', STATIC.ignoredChanges[name], true)} ${STATIC.ignoredChanges[name] === 1 ? 'was' : 'were'} ignored`) : ''
			}\n`);

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

				// Patch for stylelint to make reporter show this
				if (name === 'styles-lint') {
					STATIC.delayedLog = { name, start };
				} else {
					logStep(END, TASK, name, start);
				}
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
							return runTask({ name, task, start }).on('finish', () => {

								// Close stream
								return cb ? cb() : undefined;
							});
						}

						// Halted
						logStep(HALT, DEPENDENCIES, name);

						// Close stream
						return cb ? cb() : undefined;
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
		STATIC.activeGuards[name] = 0;
		STATIC.ignoredChanges[name] = 0;

		// Can't trust chokidar to do globbing
		const files = globAll.sync(patterns);

		return gulp.watch(files, { queue:false }, gulp.series(sequence, (cb) => {

			// Log watcher as completed
			logGuard(END, name);
			STATIC.activeGuards[name] = 0;
			STATIC.ignoredChanges[name] = 0;

			// When there is no more running watchers
			let anyGuardLeft = false;
			Object.keys(STATIC.activeGuards).forEach((key) => {
				if (STATIC.activeGuards[key]) {
					anyGuardLeft = true;
				}
			});

			if (!anyGuardLeft) {
				this.startWatchSpinner();
			}

			cb();
		}))

			// When watcher triggered
			.on('all', (action, triggeredPath) => {
				if (STATIC.activeGuards[name]) {
					++STATIC.ignoredChanges[name];
				} else {
					STATIC.activeGuards[name] = ++STATIC.totalGuards;
					STATIC.standingSpinner.stop();
					logGuard(ALERT, name, triggeredPath);
				}
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


	//-- Show delayed log
	static showDelayedLog(error) {
		if (!(error && !env.watching)) {
			const { name, start } = STATIC.delayedLog;
			logStep(error ? HALT : END, TASK, name, start);
			STATIC.delayedLog = undefined;
		}
	}

};
