//--------------------------------------------------------
//-- CLI bootstrap
//--------------------------------------------------------
'use strict';

// We disable global require rule to optimize the speed of the CLI for unrelated workflow stuff
/* eslint-disable global-require */

const chalk = require('chalk');
const spawn = require('cross-spawn');
const fs    = require('fs');
const util  = require('./helpers/util');

const PACKAGE  = 'package.json';
const WORKFLOW = '@absolunet/nwayo-workflow';






module.exports = async () => {

	const cliPackageConfig = util.packageConfig;

	//-- Trap `-v` or `--version`
	if (util.flag('v') || util.flag('version')) {
		util.echo(cliPackageConfig.version);
		util.exit();

	//-- Trap `--completion`
	} else if (util.flag('completion')) {
		util.echo(fs.readFileSync(`${__dirname}/completion/bash`, 'utf8'));
		util.exit();

	//-- Trap `--pronounce`
	} else if (util.flag('pronounce')) {
		util.echo('/nwajo/');
		if (process.platform === 'darwin') {
			spawn('say', ['nwaw', 'yo']);
		}
		util.exit();

	//-- Trap `outdated`
	} else if (util.cmd('outdated')) {
		await util.obnoxiousNotificator(cliPackageConfig, true);

	//-- Trap `update`
	} else if (util.cmd('update')) {
		const update = await util.checkUpdate(cliPackageConfig);

		util.echo('');

		if (update.current !== update.latest) {
			util.echo(`Update available: ${chalk.dim(update.current)} ${chalk.reset('→')} ${chalk.green(update.latest)}\n\nUpdating...\n`);

			const terminal = require('@absolunet/terminal');
			terminal.process.run('npm uninstall -g @absolunet/nwayo-cli && npm install -g --no-audit @absolunet/nwayo-cli');
		} else {
			util.echo('No update available');
		}

	//-- Trap `grow`
	} else if (util.cmd('grow')) {
		spawn('npx @absolunet/nwayo-grow-project');
		util.exit();

	//-- Trap `grow extension`
	} else if (util.cmd('grow extension')) {
		spawn('npx @absolunet/nwayo-grow-extension');
		util.exit();

	//-- Trap `docs`
	} else if (util.cmd('docs')) {
		const open = require('open');
		const URL  = 'https://documentation.absolunet.com/nwayo/';

		util.echo(`\n${chalk.underline(URL)}`);
		open(URL);
		util.exit();

	} else {

		//-- Set nwayo root
		const root = process.cwd();


		//-- Search for 'package.json'
		const projetPackagePath = `${root}/${PACKAGE}`;
		let projetPackageConfig;

		if (fs.existsSync(projetPackagePath)) {
			projetPackageConfig = require(projetPackagePath);
		} else {
			util.showUsageIfNotArguments();
			util.exit(`No ${chalk.underline(PACKAGE)} found`);
		}


		//-- Are dependencies installed ?
		const nodeModules = `${root}/node_modules`;
		if (fs.existsSync(nodeModules)) {

			//-- If uses workflow as a package
			if (projetPackageConfig.dependencies && projetPackageConfig.dependencies[WORKFLOW]) {

				const workflow = `${nodeModules}/${WORKFLOW}`;

				// If workflow package is present
				if (fs.existsSync(workflow)) {

					//-- Trap `--completion-logic`
					const completion = util.flag('completion-logic');
					if (completion) {
						util.echo(require(`${workflow}/completion`)({ completion, root }));
						util.exit();
					}

					//-- Let's do this
					await util.obnoxiousNotificator(cliPackageConfig);


					//-- Load workflow
					require(`${workflow}/cli`)({

						// nwayo-workflow < 3.5.0
						cwd:    root,
						infos:  {
							version: cliPackageConfig.version,
							path:    __dirname
						},

						// nwayo-workflow >= 3.5.0
						cliPkg:   cliPackageConfig,  // eslint-disable-line unicorn/prevent-abbreviations
						cliPath:  __dirname,
						cliUsage: util.usageData

					});

				// Duuuuude.... Install the workflow
				} else {
					util.workflowNotInstalled();
				}

			//-- No workflow found
			} else {
				util.exit(`No ${chalk.underline(WORKFLOW)} found in ${chalk.underline(PACKAGE)}`);
			}

		// Duuuuude.... Install the workflow
		} else {
			util.workflowNotInstalled();
		}
	}
};

/* eslint-enable global-require */
