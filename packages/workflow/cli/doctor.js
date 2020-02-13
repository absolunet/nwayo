//--------------------------------------------------------
//-- Doctor
//--------------------------------------------------------
'use strict';

const chalk        = require('chalk');
const figures      = require('figures');
const cli          = require('@absolunet/cli');
const { terminal } = require('@absolunet/terminal');
const Task         = require('../classes/task');
const env          = require('../helpers/env');
const { ow }       = cli;


const totals = {
	success: 0,
	failure: 0
};

let verbose = false;


const reporter = (title, reports) => {
	let success;

	const titleColor = reports.summary.success ? chalk.green : chalk.red;
	terminal.echo(`${chalk.cyan(title)} diagnosis  ${titleColor(`${reports.summary.success ? '(^_^)' : 'ಠ_ಠ'} ${reports.summary.nb ? ` [${reports.summary.nb.success}/${reports.summary.nb.total}]` : ''}`)}\n`);

	totals.success += reports.summary.nb.success;
	totals.failure += reports.summary.nb.failure;

	if (reports.summary.success && !verbose) {
		terminal.echoIndent(chalk.green(`${figures.tick}  ${reports.summary.nb.total === 1 ? reports.last.message : 'All tests passed'}`));
	} else {

		reports.list.forEach((test) => {
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

				if (test.linterOutput) {
					extra += `\n${test.linterOutput}`;
				}

				terminal.echo(`${chalk.red(`${figures.pointerSmall} ${figures.cross}`)}  ${test.message}${extra}`);
			}
		});
	}

	terminal.spacer(2);

	return success;
};






class DoctorTask extends Task {

	constructor() {
		super();
		this.filename = __filename;
	}

	async cli(meowCli) {
		cli.refuseArguments(meowCli);

		const { verbose: flagVerbose } = cli.validateFlags(meowCli, {
			verbose: ow.boolean
		});
		verbose = flagVerbose;


		terminal
			.spacer()
			.startSpinner(`Diagnosing ${chalk.cyan(env.packageConfig.name)}...`)
		;

		//-- Load here to speed up spinner first display
		/* eslint-disable global-require */
		const pluralize = require('pluralize');
		const fss       = require('@absolunet/fss');
		const paths     = require('../helpers/paths');
		const tester    = require('../helpers/doctor/tester');
		/* eslint-enable global-require */


		const [general, root, bundles, components, workflow, vendors, sync] = await Promise.all([
			tester.general(),
			tester.root(),
			tester.bundles(),
			tester.components(),
			tester.workflowUpdates(),
			tester.vendorsUpdates(),
			tester.syncWorkflowToolbox()
		]);

		terminal.stopSpinner();

		//-- Reports
		reporter('General', general);
		reporter('Root strucure', root);
		reporter('Bundles', bundles);
		reporter('Components', components);
		reporter('Workflow', workflow);
		reporter('Vendors', vendors);
		reporter('Sync between workflow and toolbox', sync);


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

			terminal
				.echo(reward
					.replace(/_.--._/ug, `_${pink('.--.')}_`)
					.replace(/`--'/ug, pink('`--\''))
					.replace(/\(\)/ug, pink('()'))
					.replace(/.==./ug, green('.==.')))
				.spacer()
			;
		}
	}

}


module.exports = new DoctorTask();
