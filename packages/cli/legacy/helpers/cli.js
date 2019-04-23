//-------------------------------------
//-- CLI helpers
//-------------------------------------
'use strict';

const chalk  = require('chalk');
const spawn  = require('cross-spawn');
const fs     = require('fs');
const path   = require('path');
const semver = require('semver');
const util   = require('../../helpers/util');

//-- PUBLIC
module.exports = {
	packageConfig: require(`${__dirname}/../../package`),  // eslint-disable-line global-require


	//-- Echo
	echo: console.log,  // eslint-disable-line no-console


	//-- Error
	error: function(message) {
		if (message) {
			this.echo(chalk.red(`\n ${message}`));
		}

		return process ? process.exit(1) : undefined;  // eslint-disable-line no-process-exit, unicorn/no-process-exit
	},


	//-- Usage
	usage: function() {
		return this.echo(`
 Usage: ${chalk.yellow('nwayo')} ${chalk.cyan('<command>')}

  ${chalk.underline('Project commands')}
  ${chalk.yellow('run')} [${chalk.cyan('<task>')} [${chalk.cyan('<bundle>')}]]       Run a task
  ${chalk.yellow('rebuild')} [${chalk.cyan('<bundle>')}]            Run rebuild task
  ${chalk.yellow('watch')} [${chalk.cyan('<bundle>')}]              Run watch task
  ${chalk.yellow('install')} [${chalk.cyan('<scope>')}] [${chalk.yellow('--force')}]   Install dependencies ex:[workflow|vendors]
  ${chalk.yellow('doctor')}                        Diagnose project dependencies

  ${chalk.underline('Global commands')}
${util.usageTasks}
  Legacy mode
  nwayo@${this.packageConfig.version} ${path.normalize(`${__dirname}/../`)}
		`);
	},



	//-- Run
	run: function(task, context) {
		const tool = semver.lt(context.packageConfig.nwayo.version, '2.2.0') ? 'grunt' : 'gulp';
		const base = `${context.cwd}/node_modules/${tool}`;

		if (fs.existsSync(`${base}/package.json`)) {
			const params = [task];

			const gruntCli = `${__dirname}/../../node_modules/grunt-cli`;
			let packageConfig;
			let bin = '';

			switch (tool) {

				case 'gulp':
					packageConfig = require(`${base}/package`);  // eslint-disable-line global-require
					bin = `${base}/${packageConfig.bin.gulp}`;
					params.push('--cwd', context.cwd);
					break;

				case 'grunt':
					packageConfig = require(`${gruntCli}/package`);  // eslint-disable-line global-require

					bin = `${gruntCli}/${packageConfig.bin.grunt}`;
					params.push('--gruntfile', `${context.cwd}/gruntfile.js`);
					break;

				default: break;

			}

			if (context.flags) {
				context.flags.forEach((value, flag) => {
					params.push(`--${flag}`, value);
				});
			}

			const cmd = spawn(`${bin}`, params, {
				env:   process.env,  // eslint-disable-line no-process-env, unicorn/prevent-abbreviations
				stdio: 'inherit'
			});

			return cmd.on('close', (code) => {
				return code && code !== 65 ? this.echo(code) : undefined;
			});

		}

		// Shouldn't be used anymore
		return this.error('Build tool not found. Please run `npm install`');

	}
};
