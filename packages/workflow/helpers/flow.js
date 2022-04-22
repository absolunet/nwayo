//-------------------------------------
//-- Flow
//-------------------------------------
'use strict';

const chalk        = require('chalk');
const log          = require('fancy-log');
const globAll      = require('glob-all');
const gulp         = require('gulp');
const emoji        = require('node-emoji');
const ora          = require('ora');
const pluralize    = require('pluralize');
const fss          = require('@absolunet/fss');
const { terminal } = require('@absolunet/terminal');
const env          = require('./env');
const paths        = require('./paths');
const toolbox      = require('./toolbox');


const __ = {
	standingSpinner: false,  // Recceing spinner
	totalGuards:     0,      // Total of called guards
	activeGuards:    {},     // Registry of guards that are currently running
	ignoredChanges:  {},     // Registry of changes that were made during a watched task
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
	const nameStyles    = scope  === TASK ? chalk.cyan : chalk.cyan.underline;
	const logName       = action === START ? nameStyles(name) : nameStyles.dim(name);
	const logScopedName = scope  === DEPENDENCIES ? `${logName} ${scope}` : `${scope} ${logName}`;
	const logTime       = start ? `after ${chalk.magenta(`${(new Date() - start) / 1000}s`)}` : '';

	logType(`${logAction} ${logScopedName} ${logTime}`);
};


const logGuard = (action, name, file) => {
	switch (action) {

		case START:
			return `${emoji.get('guardsman')}  Guard n°${__.totalGuards + 1} standing guard...`;

		case ALERT:
			return terminal.echo(`${emoji.get('mega')}  Guard n°${__.totalGuards} alerted by ${chalk.magenta(file.split(`${paths.directory.root}/`)[1])} calling ${chalk.cyan(name)}`);

		case END:
			return terminal.echo(`${emoji.get('zzz')}  Guard n°${__.activeGuards[name]} duty is completed ${chalk.cyan.dim(`(${name})`)}${
				__.ignoredChanges[name] ? chalk.yellow(`    ⚠ ${pluralize('change', __.ignoredChanges[name], true)} ${__.ignoredChanges[name] === 1 ? 'was' : 'were'} ignored`) : ''
			}\n`);

		default: return undefined;

	}
};






const isSkipping = (name) => {
	return __.cascadeSkip || __.watchSkip[name];
};


const runTask = ({ name, task, start }) => {
	return task({ taskName: name })

		// Log task as completed
		.on('finish', () => {
			if (!__.cascadeSkip) {
				logStep(END, TASK, name, start);
			} else {
				logStep(HALT, TASK, name);
			}
		})

		// Error
		.on('error', function() {

			// In watch mode, cascade skip all pending tasks
			if (env.watching) {
				__.cascadeSkip = true;

			// In run mode, rage quit  (╯°□°）╯︵ ┻━┻
			} else {
				terminal.exit();
			}

			// Close stream
			if (name === 'scripts-lint') {
				this.emit('finish');
			}

			this.emit('end');
		})
	;
};






class Flow {

	//-- Create gulp task
	createTask(name, task, dependencies) {
		gulp.task(name, (callback) => {

			// Run task if not skipping tasks
			if (!isSkipping(name)) {
				const start = new Date();

				// Run task dependencies first
				if (dependencies) {
					logStep(START, DEPENDENCIES, name);

					return gulp.series(dependencies, () => {

						// Run task if not skipping
						if (!isSkipping()) {
							logStep(END, DEPENDENCIES, name);
							logStep(START, TASK, name);

							// Then run task
							return runTask({ name, task, start }).on('finish', () => {

								// Close stream
								return callback ? callback() : undefined;
							});
						}

						// Halted
						logStep(HALT, DEPENDENCIES, name);

						// Close stream
						return callback ? callback() : undefined;
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
	createSequence(name, sequence, { cleanPaths = [], cleanBundle } = {}) {
		gulp.task(name, (callback) => {
			const start = new Date();
			logStep(START, SEQUENCE, name);

			// Global paths to delete
			const list = cleanPaths;

			// Bundles paths to delete
			if (cleanBundle) {
				for (const bundleName of Object.keys(env.bundles)) {
					list.push(...cleanBundle({ name: bundleName, bundle: env.bundles[bundleName] }));
				}
			}

			// Delete
			list.forEach((path) => {
				fss.remove(path);
			});

			// Run sequence
			gulp.series(sequence, () => {

				// Log sequence as completed
				if (!__.cascadeSkip) {
					logStep(END, SEQUENCE, name, start);
				} else {
					logStep(HALT, SEQUENCE, name);
				}

				// Close stream
				return callback ? callback() : undefined;
			})();
		});
	}


	//-- Create watch tasks sequence
	watchSequence(name, patterns, sequence) {
		__.activeGuards[name] = 0;
		__.ignoredChanges[name] = 0;

		// Can't trust chokidar to do globbing
		const files = globAll.sync(patterns);

		return gulp.watch(files, { queue: false }, gulp.series(sequence, (callback) => {

			// Log watcher as completed
			logGuard(END, name);
			__.activeGuards[name] = 0;
			__.ignoredChanges[name] = 0;

			// When there is no more running watchers
			let anyGuardLeft = false;
			Object.keys(__.activeGuards).forEach((key) => {
				if (__.activeGuards[key]) {
					anyGuardLeft = true;
				}
			});

			if (!anyGuardLeft) {
				this.startWatchSpinner();
			}

			callback();
		}))

			// When watcher triggered
			.on('all', (action, triggeredPath) => {
				if (__.activeGuards[name]) {
					++__.ignoredChanges[name];
				} else {
					__.activeGuards[name] = ++__.totalGuards;
					__.standingSpinner.stop();
					logGuard(ALERT, name, triggeredPath);
				}
			})
		;
	}


	//-- Start watch spinner
	startWatchSpinner() {
		__.cascadeSkip = false;

		terminal.spacer();
		__.standingSpinner = ora({
			text:    logGuard(START),
			spinner: {
				interval: 250,
				frames: ['●', '○']
			},
			color:   'green'
		}).start();
	}


	//-- Add a task to skip
	skipOnWatch(task) {
		__.watchSkip[task] = true;
	}

}


module.exports = new Flow();
