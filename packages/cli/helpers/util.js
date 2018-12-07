//--------------------------------------------------------
//-- Util
//--------------------------------------------------------
'use strict';

// We disable global require rule to optimize the speed of the CLI for unrelated workflow stuff
/* eslint-disable global-require */

const chalk = require('chalk');

const argv = require('minimist')(process.argv.slice(2));






class Util {

	get pkg() {
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
				return { flag:true };
			}
		}

		return false;
	}






	//-- Nano wrappers to refrain the use of packages
	echo(msg) {
		console.log(msg);  // eslint-disable-line no-console
	}

	exit(msg) {
		if (msg && !argv['completion-logic']) {
			const terminal = require('@absolunet/terminal');
			terminal.exit(msg);
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
	obnoxiousNotificator(pkg, sync = false) {
		const boxen          = require('boxen');
		const updateNotifier = require('update-notifier');

		const message = (update = {}) => {
			return `Update available ${chalk.dim(update.current)} ${chalk.reset('→')} ${chalk.green(update.latest)}\nRun ${chalk.cyan('nwayo update')} to update`;
		};

		const options = {
			pkg: pkg,
			updateCheckInterval: 1
		};

		if (sync) {
			options.callback = (error, update) => {
				if (!error) {
					if (update.current !== update.latest) {
						this.echo(boxen(message(update), {
							padding:     1,
							margin:      1,
							align:       'center',
							borderColor: 'yellow',
							borderStyle: 'round'
						}));
					}
				} else {
					this.exit(error);
				}
			};
		}

		const notifier = updateNotifier(options);

		if (!sync) {
			notifier.notify({ message:message(notifier.update) });
		}
	}


	//-- Check for updates
	checkUpdate(pkg, callback) {
		const updateNotifier = require('update-notifier');
		updateNotifier({ pkg:pkg, updateCheckInterval:1, callback:callback });
	}






	//-- Boot in legacy mode
	bootLegacyMode({ root }) {
		this.echo(chalk.yellow(`\n [Legacy mode]\n\n`));
		require(`../legacy`)({ root });
	}


	//-- Show usage
	showUsageIfNotArgs() {
		if (Object.keys(argv).length === 1 && argv._.length === 0) {
			const fs = require('fs');

			this.echo(`
  Usage: ${chalk.yellow('nwayo')} ${chalk.cyan('<command>')}

  ${chalk.underline('Global')}
${this.usageTasks}
  cli${chalk.yellow('@')}${this.pkg.version} ${fs.realpathSync(`${__dirname}/..`)}
			`);

			this.exit();
		}
	}

}


module.exports = new Util();

/* eslint-enable global-require */
