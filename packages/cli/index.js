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

const CONFIG   = 'nwayo.yaml';
const PACKAGE  = 'package.json';
const WORKFLOW = '@absolunet/nwayo-workflow';






module.exports = () => {

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
		util.obnoxiousNotificator(cliPackageConfig, true);

	//-- Trap `update`
	} else if (util.cmd('update')) {
		util.checkUpdate(cliPackageConfig, (error, update) => {
			if (!error) {
				const { terminal } = require('@absolunet/terminal');

				terminal.spacer();

				if (update.current !== update.latest) {
					util.echo(`Update available: ${chalk.dim(update.current)} ${chalk.reset('→')} ${chalk.green(update.latest)}\n\nUpdating...`);
				} else {
					util.echo('No update available\n\nReinstalling...');
				}

				terminal.spacer();
				terminal.run('npm uninstall -g @absolunet/nwayo-cli && npm install -g --no-audit @absolunet/nwayo-cli');

			} else {
				util.exit(error);
			}
		});

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
		const URL  = 'https://absolunet.github.io/nwayo/';

		util.echo(`\n${chalk.underline(URL)}`);
		open(URL);
		util.exit();

	} else {

		const findUp = require('find-up');
		const yaml   = require('js-yaml');
		const path   = require('path');

		//-- Set nwayo root
		const configFilepath = findUp.sync(CONFIG, { cwd: process.cwd() });
		let config;
		let root = process.cwd();

		if (configFilepath) {
			config = yaml.safeLoad(fs.readFileSync(configFilepath, 'utf8'));

			if (config && config.root) {
				root = path.normalize(`${path.dirname(configFilepath)}/${config.root}`);
			} else {
				util.showUsageIfNotArguments();
				util.exit(`No root defined in ${chalk.underline(CONFIG)}`);
			}
		}


		//-- Search for 'package.json'
		const projetPackagePath = `${root}/${PACKAGE}`;
		let projetPackageConfig;

		if (fs.existsSync(projetPackagePath)) {
			projetPackageConfig = require(projetPackagePath);
		} else if (config) {
			util.showUsageIfNotArguments();
			util.exit(`No ${chalk.underline(PACKAGE)} found under root defined in ${chalk.underline(CONFIG)}`);
		} else {
			util.showUsageIfNotArguments();
			util.exit(`No ${chalk.underline(CONFIG)} or ${chalk.underline(PACKAGE)} found`);
		}


		//-- Trap `nwayo install workflow`
		const nodeModules = `${root}/node_modules`;
		const npmInstall = () => {
			const fss          = require('@absolunet/fss');
			const { terminal } = require('@absolunet/terminal');

			fss.remove(nodeModules);
			fss.remove(`${root}/package-lock.json`);

			terminal.run(`cd ${root} && npm install --no-audit`);
			util.exit();
		};

		const npmCI = () => {
			const { terminal } = require('@absolunet/terminal');
			try {
				terminal.run(`cd ${root} && npm ci`);
				util.exit();
			} catch (error) {
				terminal.errorBox(`
					The package-lock.json file is outdated
					Please run ${chalk.underline('nwayo install workflow --force')} to update it
				`);
				util.exit();
			}
		};

		const installWorkflow = util.cmd('install workflow', 'force');
		const lockFile        = fs.existsSync(`${root}/package-lock.json`);
		if (installWorkflow) {
			if (installWorkflow === true) {
				if (lockFile) {
					npmCI();
				} else {
					npmInstall();
				}
			} else if (installWorkflow.flag === true) {
				npmInstall();
			}
		}


		//-- Are dependencies installed ?
		if (fs.existsSync(nodeModules)) {

			//-- If uses workflow as a package
			if (projetPackageConfig.dependencies && projetPackageConfig.dependencies[WORKFLOW]) {

				const workflow = `${nodeModules}/${WORKFLOW}`;

				// If workflow package is present
				if (fs.existsSync(workflow)) {

					//-- Trap `--completion-logic`
					const completion = util.flag('completion-logic');
					if (completion) {

						const completionLogic = `${workflow}/completion`;
						if (fs.existsSync(completionLogic)) {
							util.echo(require(completionLogic)({ completion, root }));
						} else {
							util.echo(require(`./legacy/completion`)({ completion, root }));
						}
						util.exit();
					}

					//-- Let's do this
					util.obnoxiousNotificator(cliPackageConfig);


					//-- Trap `nwayo install vendors` (for nwayo-workflow < 3.5.0)
					if (util.cmd('install vendors') === true) {
						if (!fs.existsSync(`${workflow}/cli/install.js`)) {
							util.bootLegacyMode({ root });
							util.exit();
						}
					}


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

			//-- Ricochet to legacy
			} else {

				//-- Trap `--completion-logic`
				const completion = util.flag('completion-logic');
				if (completion) {
					util.echo(require(`./legacy/completion`)({ completion, root }));
					util.exit();
				}

				//-- Let's do this
				util.obnoxiousNotificator(cliPackageConfig);
				util.bootLegacyMode({ root });
			}

		// Duuuuude.... Install the workflow
		} else {
			util.workflowNotInstalled();
		}
	}
};

/* eslint-enable global-require */
