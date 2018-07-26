//--------------------------------------------------------
//-- Doctor
//--------------------------------------------------------
'use strict';

const async     = require('async');
const chalk     = require('chalk');
const pluralize = require('pluralize');
const cli       = require('@absolunet/cli');
const fss       = require('@absolunet/fss');
const terminal  = require('@absolunet/terminal');
const env       = require('../helpers/env');
const paths     = require('../helpers/paths');
const tester    = require('../helpers/tester');


const totals = {
	success: 0,
	failure:  0
};

const reportTitle = (title, success) => {
	terminal.echo(`${chalk.cyan(title)} diagnosis  ${success ? chalk.green('(^_^)') : chalk.red('ಠ_ಠ')}\n`);
};


const reporter = (title, data) => {
	let success;

	//-- Error
	if (data.error) {
		success = false;
		reportTitle(title, success);
		++totals.failure;
		terminal.failure(data.error);


	//-- Outdated stuff
	} else if (data.outdated && data.outdated.length !== 0) {
		success = false;
		reportTitle(title, success);

		data.outdated.forEach((item) => {
			const msg = item.message ? `${chalk.red(item.message)}` : `${chalk.dim(item.current)} → ${chalk.green(item.latest)}`;
			terminal.echoIndent(`${chalk.red(`✘  ${item.name}:`)} ${msg}`);
			++totals.failure;
		});

		terminal.spacer();


	//-- Tests report
	} else if (data.report) {
		success = !data.report.find((test) => { return test.success === false; });
		reportTitle(title, success);

		data.report.forEach((test) => {
			if (test.success) {
				terminal.echoIndent(chalk.green(`✓  ${test.message}`));
				++totals.success;
			} else {
				terminal.echoIndent(chalk.red(`✘  ${test.message}`));
				++totals.failure;
			}
		});

		terminal.spacer();


	//-- Clear success
	} else {
		success = true;
		reportTitle(title, success);
		++totals.success;

		terminal.success(data.message);
	}

	terminal.spacer();

	return success;
};






class Doctor {

	cli(meowCli) {
		cli.refuseFlagsAndArguments(meowCli);

		terminal.spacer();
		const spinner = terminal.startSpinner(`Diagnosing ${chalk.cyan(env.pkg.name)}...`);

		async.parallel({
			config:   tester.config,
			workflow: tester.workflowUpdates,
			bower:    tester.bowerUpdates,
			sync:     tester.syncWorkflowToolbox
		}, (error, data) => {

			spinner.stop();

			//-- Reports
			reporter('Config', data.config);
			reporter('Workflow', data.workflow);
			reporter('Vendors', data.bower);
			reporter('Sync between workflow and toolbox', data.sync);


			//-- Totals
			if (totals.success) {
				terminal.echo(chalk.green(`${pluralize('test', totals.success, true)} passed`));
			}

			if (totals.failure) {
				terminal.echo(chalk.red(`${pluralize('test', totals.failure, true)} failed`));
			}

			terminal.spacer();


			//-- Reward
			if (totals.failure === 0) {
				const reward = fss.readFile(`${paths.workflow.ressources}/doctor-reward`, 'utf8');
				const pink   = chalk.hex('#ff69b4');
				const green  = chalk.hex('#198c19');

				terminal.echo(reward
					.replace(/_.--._/g, `_${pink('.--.')}_`)
					.replace(/`--'/g, pink('`--\''))
					.replace(/\(\)/g, pink('()'))
					.replace(/.==./g, green('.==.')))
				;
				terminal.spacer();
			}

		});
	}

}


module.exports = new Doctor();
