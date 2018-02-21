//-------------------------------------
//-- Flow
//-------------------------------------
'use strict';

const gulp     = require('gulp');
const terminal = require('@absolunet/terminal');






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
		gulp.task(name, () => {
			const start = new Date();
			terminal.echo(`${name} Start`);

			gulp.series(...sequence, () => {
				terminal.echo(`/${name} End - [${(new Date() - start) / 1000}s]`);
			})();

		});
	}

};
