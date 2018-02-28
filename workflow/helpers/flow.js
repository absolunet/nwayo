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
const toolbox  = require('../helpers/toolbox');


//-- Static properties
const STATIC = global.___NwayoFlow___ ? global.___NwayoFlow___ : global.___NwayoFlow___ = {
	recceingSpinner: false,  // Recceing spinner
	totalWatchers:   0,      // Total of called watchers
	activeWatchers:  0,      // Number of currently running watchers
	cascadeSkip:     false   // In watch mode, is currently skipping tasks because of one failed task ?
};


const color = {
	task:     chalk.cyan,
	sequence: chalk.cyan.underline,
	duration: chalk.magenta,
	file:     chalk.magenta,
	halting:  chalk.yellow
};

const log = (str) => {
	terminal.echo(`${env.watching ? '   ' : ''}${str}`);
};






module.exports = class flow {

	//-- Create gulp task
	static createTask(name, task) {
		gulp.task(name, () => {

			// Run task if not skipping tasks
			if (!STATIC.cascadeSkip) {
				const start = new Date();
				log(`Starting task ${color.task(name)}`);

				return task()

					// Log task as completed
					.on('finish', () => {
						if (!STATIC.cascadeSkip) {
							log(`/Finished task ${color.task(name)} after ${color.duration(`${(new Date() - start) / 1000}s`)}`);
						} else {
							log(`${color.halting('Halting')} task ${color.task(name)}`);
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
			}

			// Else skip task
			return toolbox.selfClosingStream();
		});
	}


	//-- Create tasks sequence
	static createSequence(name, sequence, { cleanPaths = [], cleanBundle } = {}) {
		gulp.task(name, (cb) => {
			const start = new Date();
			log(`Starting sequence ${color.sequence(name)}`);

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
					log(`/Finished sequence ${color.sequence(name)} after ${color.duration(`${(new Date() - start) / 1000}s`)}`);
				} else {
					log(`${color.halting('Halting')} sequence ${color.sequence(name)}`);
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
			terminal.echo(`${emoji.get('zzz')}  Scout #${STATIC.totalWatchers - STATIC.activeWatchers} shift ended\n`);

			// When there is no more running watchers
			if (STATIC.activeWatchers === 0) {
				this.startWatchSpinner();
			}

			cb();
		}))

			// When watcher triggered
			.on('all', (action, triggeredPath) => {
				++STATIC.activeWatchers;
				STATIC.recceingSpinner.stop();
				terminal.echo(`${emoji.get('mega')}  Scout #${++STATIC.totalWatchers} alerted by ${color.file(triggeredPath.split(`${paths.dir.root}/`)[1])} calling ${color.task(name)}`);
			})
		;
	}


	//-- Start watch spinner
	static startWatchSpinner() {
		STATIC.cascadeSkip = false;

		terminal.spacer();
		STATIC.recceingSpinner = ora({
			text:    `${emoji.get('guardsman')}  Scout #${STATIC.totalWatchers + 1} recceing...`,
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
