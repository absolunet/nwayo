//-------------------------------------
//-- CLI utils
//-------------------------------------
'use strict';

// const debug = require('gulp-debug');
const boxen    = require('boxen');
const chalk    = require('chalk');
const gulp     = require('gulp');
const semver   = require('semver');
const cli      = require('@absolunet/cli');
const fss      = require('@absolunet/fss');
const terminal = require('@absolunet/terminal');
const env      = require('./env');
const paths    = require('./paths');






module.exports = class cliUtil {

	//-- Init
	static init() {
		terminal.setDefault({
			logo:   env.logo,
			color: 'green',
			lang:  'en'
		});

		cli.init({
			pkg: { name:env.name }
		});

		cli.initTasksList(paths.workflow.cliTasks);



		const tasks = ['assets', 'icons', 'local', 'scripts', 'styles'];

		/* eslint-disable quote-props */
		cli.setUsageTasks({

			// Project
			'run':     [`run ${cli.placeholder('<task>')} ${cli.optionalPlaceholder('<bundle>')}`, `Run a task ex:[${tasks.join('|')}]`, [tasks]],
			'rebuild': [`rebuild ${cli.optionalPlaceholder('<bundle>')}`, `Rebuild the entire project from scratch`],
			'watch':   [`watch ${cli.optionalPlaceholder('<bundle>')}`, `Listens for changes on files and run appropriate tasks`],
			'doctor':  [`doctor`, `Checks Node.js / Bower packages for updates`],

			// Options
			'--help':      [`-h, --help`, `Show help`],
			'--version':   [`-v, --version`, 'Show CLI version'],
			'--pronounce': [`--pronounce`, `Listen to ${env.name} pronunciation`]

		});

		cli.setFullUsage({
			'Project': ['run', 'rebuild', 'watch', 'doctor'],
			'Options': ['--help', '--version', '--pronounce']
		}, { showBin:false });
		/* eslint-enable quote-props */
	}


	//-- Init project task
	static initProjectTask({ bundle }) {

		// Check for asked version vs installed version
		const requiredVersion  = env.pkg.dependencies['@absolunet/nwayo-workflow'];
		const installedVersion = env.workflowPkg.version;

		if (semver.gt(requiredVersion, installedVersion)) {
			terminal.echo(boxen(
				`Workflow update available ${chalk.dim(installedVersion)} ${chalk.reset('→')} ${chalk.green(requiredVersion)}

The required version in your project's package.json
is greater than the installed one

Run ${chalk.cyan('npm install')} to update`,
				{
					padding:     1,
					margin:      0.5,
					align:       'center',
					borderColor: 'yellow'
				}
			));

			terminal.exit();
		}

		// Validate bundle
		if (bundle) {
			const [main, sub] = bundle.split(':');

			if (!fss.exists(`${paths.dir.bundles}/${main}/${sub ? `_${sub}` : main}.${paths.ext.bundles}`)) {
				terminal.exit(`No bundle ${chalk.underline(bundle)} found.`);
			}
		}
	}


	//-- Run workflow task
	static runWorkflowTask(task) {
		require('../workflow.js'); // eslint-disable-line
		gulp.task(task)();
	}

};
