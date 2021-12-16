//--------------------------------------------------------
//-- Util
//--------------------------------------------------------
'use strict';

// We disable global require rule to optimize the speed of the CLI for unrelated workflow stuff
/* eslint-disable global-require */

const chalk = require('chalk');

const argv = require('minimist')(process.argv.slice(2));

const obnoxiousMessage = (update = {}) => {
	return `Update available ${chalk.dim(update.current)} ${chalk.reset('→')} ${chalk.green(update.latest)}\nRun ${chalk.cyan('nwayo update')} to update`;
};





class Util {

	get packageConfig() {
		return require(`../package.json`);
	}


	get usageData() {
		return {
			tasks: {
				'update':      [`update`, `Update the CLI`],
				'outdated':    [`outdated`, `Check if CLI is outdated`],
				'grow':        [`grow ${chalk.reset('[')}${chalk.yellow('extension')}${chalk.reset(']')}`, `Generate new project or extension`],
				'docs':        [`docs`, `Open documentation`],
				'--help':      [`-h, --help`, `Show help`],
				'--version':   [`-v, --version`, 'Show CLI version'],
				'--pronounce': [`--pronounce`, `Listen to nwayo pronunciation`]
			},
			full: {
				Global: ['update', 'outdated', 'grow', 'docs', '--help', '--version', '--pronounce']
			}
		};
	}

	get usageTasks() {
		const stringWidth = require('string-width');

		let tasks = '';
		const max = Math.max(...Object.values(this.usageData.tasks).map(([item]) => { return stringWidth(item); }));

		this.usageData.full.Global.forEach((name) => {
			const [task, description] = this.usageData.tasks[name];
			tasks += `  ${chalk.yellow(task)}${' '.repeat(max - stringWidth(task))}  ${description}\n`;
		});

		return tasks;
	}






	flag(name) {
		if (Object.keys(argv).length === 2 && argv._.length === 0) {
			if (name === 'completion-logic') {
				return argv[name];
			}

			return argv[name] === true;
		}

		return false;
	}


	cmd(command, optionalFlag) {
		const [action, scope] = command.split(' ');

		if (argv._[0] === action && (
			argv._.length === 1 ||
			(argv._.length === 2 && argv._[1] === scope)
		)) {
			if (Object.keys(argv).length === 1) {
				return true;
			} else if (optionalFlag && Object.keys(argv).length === 2 && argv[optionalFlag] === true) {
				return { flag: true };
			}
		}

		return false;
	}






	//-- Nano wrappers to refrain the use of packages
	echo(message) {
		console.log(message);  // eslint-disable-line no-console
	}

	exit(message) {
		if (message && !argv['completion-logic']) {
			const { terminal } = require('@absolunet/terminal');
			terminal.exit(message);
		} else {
			process.exit();  // eslint-disable-line no-process-exit, unicorn/no-process-exit
		}
	}

	workflowNotInstalled() {
		this.exit(`
			Workflow not installed
			Please run ${chalk.underline('nwayo install workflow')}
		`);
	}






	//-- Check for updates and be obnoxious about it
	async obnoxiousNotificator(packageConfig, sync = false) {
		const boxen          = require('boxen');
		const updateNotifier = require('update-notifier');

		const options = {
			pkg:                 packageConfig,  // eslint-disable-line unicorn/prevent-abbreviations
			updateCheckInterval: 1
		};

		const notifier = updateNotifier(options);

		if (sync) {
			const update = await notifier.fetchInfo();

			if (update.current !== update.latest) {
				this.echo(boxen(obnoxiousMessage(update), {
					padding:     1,
					margin:      1,
					align:       'center',
					borderColor: 'yellow',
					borderStyle: 'round'
				}));
			}
		} else {
			notifier.notify({ message: obnoxiousMessage(notifier.update) });
		}
	}


	//-- Check for updates
	checkUpdate(packageConfig) {
		const updateNotifier = require('update-notifier');
		const notifier = updateNotifier({ pkg: packageConfig, updateCheckInterval: 1 });  // eslint-disable-line unicorn/prevent-abbreviations

		return notifier.fetchInfo();
	}






	//-- Show usage
	showUsageIfNotArguments() {
		if (Object.keys(argv).length === 1 && argv._.length === 0) {
			const fs = require('fs');

			this.echo(`
  Usage: ${chalk.yellow('nwayo')} ${chalk.cyan('<command>')}

  ${chalk.underline('Global')}
${this.usageTasks}
  cli${chalk.yellow('@')}${this.packageConfig.version} ${fs.realpathSync(`${__dirname}/..`)}
			`);

			this.exit();
		}
	}

}


module.exports = new Util();

/* eslint-enable global-require */
