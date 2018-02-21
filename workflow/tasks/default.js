//-------------------------------------
//-- Default
//-------------------------------------
'use strict';

// const debug = require('gulp-debug');
const gulp        = require('gulp');
const inquirer    = require('inquirer');
const runsequence = require('run-sequence');
const terminal    = require('@absolunet/terminal');
const env         = require('../helpers/env');






//-- Default menu
gulp.task('default', (cb) => {

	terminal.echo('\n');
	terminal.echo(` ${env.pkg.name} `.bgGreen.bold + `    [${env.name} ${env.workflowPkg.version}]`.yellow);
	terminal.echo('');

	inquirer.prompt([
		{
			name:    'task',
			message: 'Alo! Ki sa ou vle?',
			type:    'list',
			choices: [
				{ name:'Everything',       value:'rebuild' },
				{ name:'Scripts & styles', value:'rebuild-ss' },
				new inquirer.Separator(),
				{ name:'Assets only',      value:'assets' },
				{ name:'Icons only',       value:'icons' },
				{ name:'Scripts only',     value:'scripts' },
				{ name:'Styles only',      value:'styles' },
				{ name:'Local only',       value:'local' }
			]
		}
	], (data) => {
		terminal.echo('\n\n');
		runsequence(data.task, cb);
	});
});
