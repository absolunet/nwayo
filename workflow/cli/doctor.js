//--------------------------------------------------------
//-- Doctor
//--------------------------------------------------------
'use strict';

const chalk    = require('chalk');
const figures  = require('figures');
const cli      = require('@absolunet/cli');
const terminal = require('@absolunet/terminal');
const env      = require('../helpers/env');


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
		terminal.echoIndent(chalk.red(`${figures.cross} ${data.error}`));


	//-- Outdated stuff
	} else if (data.outdated && data.outdated.length !== 0) {
		success = false;
		reportTitle(title, success);

		data.outdated.forEach((item) => {
			const msg = item.message ? `${chalk.red(item.message)}` : `${chalk.dim(item.current)} → ${chalk.green(item.latest)}`;
			terminal.echo(`${chalk.red(`${figures.pointerSmall} ${figures.cross}  ${item.name}:`)} ${msg}`);
			++totals.failure;
		});

		terminal.spacer();


	//-- Tests report
	} else if (data.report) {
		success = !data.report.find((test) => { return test.success === false; });
		reportTitle(title, success);

		data.report.forEach((test) => {
			if (test.success) {
				terminal.echoIndent(`${chalk.green(figures.tick)}  ${chalk.dim(test.message)}`);
				++totals.success;
			} else {

				let differences = '';
				if (test.differences) {
					differences += test.differences.superfluous && test.differences.superfluous.length !== 0 ? chalk.green(` [+] ${test.differences.superfluous.join(' | ')}`) : '';
					differences += test.differences.missing     && test.differences.missing.length !== 0     ? chalk.red(` [-] ${test.differences.missing.join(' | ')}`)       : '';
				}

				terminal.echo(`${chalk.red(`${figures.pointerSmall} ${figures.cross}`)}  ${test.message}${differences}`);
				++totals.failure;
			}
		});

		terminal.spacer();


	//-- Clear success
	} else {
		success = true;
		reportTitle(title, success);
		++totals.success;

		terminal.echoIndent(chalk.green(`${figures.tick} ${chalk.dim(data.message)}`));
	}

	terminal.spacer();

	return success;
};






class Doctor {

	cli(meowCli) {
		cli.refuseFlagsAndArguments(meowCli);

		terminal.spacer();
		const spinner = terminal.startSpinner(`Diagnosing ${chalk.cyan(env.pkg.name)}...`);

		//-- Load here to speed up spinner first display
		/* eslint-disable global-require */
		const async     = require('async');
		const pluralize = require('pluralize');
		const fss       = require('@absolunet/fss');
		const paths     = require('../helpers/paths');
		const tester    = require('../helpers/doctor/tester');
		/* eslint-enable global-require */

		async.parallel({
			base:       tester.base,
			bundles:    tester.bundles,
			components: tester.components,
			workflow:   tester.workflowUpdates,
			bower:      tester.bowerUpdates,
			sync:       tester.syncWorkflowToolbox
		}, (error, data) => {

			spinner.stop();

			//-- Reports
			reporter('Base strucure', data.base);
			reporter('Bundles', data.bundles);
			reporter('Components', data.components);
			reporter('Workflow', data.workflow);
			reporter('Vendors', data.bower);
			reporter('Sync between workflow and toolbox', data.sync);


			//-- Totals
			terminal.spacer(2);

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
