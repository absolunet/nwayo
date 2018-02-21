//-------------------------------------
//-- Flow
//-------------------------------------
'use strict';

const gulp     = require('gulp');
const ora      = require('ora');
const terminal = require('@absolunet/terminal');


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

			return task().on('end', () => {
				terminal.echo(`/${name} End - [${(new Date() - start) / 1000}s]`);
			});
		});
	}


	//-- Create tasks sequence
	static createSequence(name, ...sequence) {
		gulp.task(name, (cb) => {
			const start = new Date();
			terminal.echo(`${name} Start`);

			gulp.series(...sequence, () => {
				terminal.echo(`/${name} End - [${(new Date() - start) / 1000}s]`);
				cb();
			})();
		});
	}


	//-- Watcher sequence
	static watcherSequence(...tasks) {
		return gulp.series(
			(cb) => {
				STATIC.watchSpinner.stop();
				terminal.echo(`Watcher Start #${++STATIC.watchTicker}`);
				cb();
			},

			...tasks,

			(cb) => {
				terminal.echo(`Watcher End #${STATIC.watchTicker}\n`);
				this.startWatchSpinner();
				cb();
			}
		);
	}


	//-- Watch spinner
	static startWatchSpinner() {
		terminal.spacer();

		STATIC.watchSpinner = ora({
			text:    'Watching...',
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
