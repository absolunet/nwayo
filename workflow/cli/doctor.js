//--------------------------------------------------------
//-- Doctor
//--------------------------------------------------------
'use strict';

const chalk    = require('chalk');
const figures  = require('figures');
const ow       = require('ow');
const cli      = require('@absolunet/cli');
const terminal = require('@absolunet/terminal');
const env      = require('../helpers/env');


const totals = {
	success: 0,
	failure:  0
};

let verbose = false;

const reportTitle = (title, summary) => {
	const color = summary.success ? chalk.green : chalk.red;
	terminal.echo(`${chalk.cyan(title)} diagnosis  ${color(`${summary.success ? '(^_^)' : 'ಠ_ಠ'} ${summary.nb ? ` [${summary.nb.success}/${summary.nb.total}]` : ''}`)}\n`);
};


const reporter = (title, data) => {
	let success;

	//-- Error
	if (data.error) {
		success = false;
		reportTitle(title, { success });
		++totals.failure;
		terminal.echoIndent(chalk.red(`${figures.cross} ${data.error}`));


	//-- Outdated stuff
	} else if (data.outdated && data.outdated.length !== 0) {
		success = false;
		reportTitle(title, { success });

		data.outdated.forEach((item) => {
			const msg = item.message ? `${chalk.red(item.message)}` : `${chalk.dim(item.current)} → ${chalk.green(item.latest)}`;
			terminal.echo(`${chalk.red(`${figures.pointerSmall} ${figures.cross}  ${item.name}:`)} ${msg}`);
			++totals.failure;
		});


	//-- Tests report
	} else if (data.report) {
		reportTitle(`${title}`, data.report.summary);

		totals.success += data.report.summary.nb.success;
		totals.failure += data.report.summary.nb.failure;

		if (data.report.summary.success && !verbose) {
			terminal.echoIndent(chalk.green(`${figures.tick}  ${data.report.summary.nb.total === 1 ? data.report.last.message : 'All tests passed'}`));
		} else {

			data.report.list.forEach((test) => {
				if (test.success && verbose) {
					terminal.echoIndent(`${chalk.green(figures.tick)}  ${chalk.dim(test.message)}`);

				} else if (!test.success) {

					let extra = '';
					if (test.differences) {
						extra += test.differences.superfluous && test.differences.superfluous.length !== 0 ? chalk.yellow(` [+] ${test.differences.superfluous.join(' | ')}`) : '';
						extra += test.differences.missing     && test.differences.missing.length !== 0     ? chalk.red(` [-] ${test.differences.missing.join(' | ')}`) : '';
						extra += test.differences.mismatched  && test.differences.mismatched.length !== 0  ? chalk.red(` [*] ${test.differences.mismatched.join(' | ')}`) : '';
					}

					if (test.outdated) {
						extra += `  ${chalk.dim(test.outdated.current)} → ${chalk.yellow(test.outdated.latest)}`;
					}

					terminal.echo(`${chalk.red(`${figures.pointerSmall} ${figures.cross}`)}  ${test.message}${extra}`);
				}
			});
		}


	//-- Clear success
	} else {
		success = true;
		reportTitle(title, { success });
		++totals.success;

		terminal.echoIndent(chalk.green(`${figures.tick} ${data.message}`));
	}

	terminal.spacer(2);

	return success;
};






class Doctor {

	cli(meowCli) {
		cli.refuseArguments(meowCli);

		const { verbose:flagVerbose } = cli.validateFlags(meowCli, {
			verbose: ow.boolean
		});
		verbose = flagVerbose;


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
			general:    tester.general,
			root:       tester.root,
			bundles:    tester.bundles,
			components: tester.components,
			workflow:   tester.workflowUpdates,
			bower:      tester.bowerUpdates,
			sync:       tester.syncWorkflowToolbox
		}, (error, data) => {

			spinner.stop();

			//-- Reports
			reporter('General', data.general);
			reporter('Root strucure', data.root);
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
