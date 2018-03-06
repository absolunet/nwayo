//--------------------------------------------------------
//-- Doctor
//--------------------------------------------------------
'use strict';

const async          = require('async');
const bower          = require('bower');
const chalk          = require('chalk');
const lastestVersion = require('latest-version');
const semver         = require('semver');
const cli            = require('@absolunet/cli');
const fss            = require('@absolunet/fss');
const terminal       = require('@absolunet/terminal');
const env            = require('../helpers/env');
const paths          = require('../helpers/paths');


const analyzeWorkflow = (cb) => {
	const current = env.workflowPkg.version;

	lastestVersion(env.pkgName).then((latest) => {
		const outdated = [];

		if (semver.gt(latest, current)) {
			outdated.push({
				current: current,
				latest:  latest,
				name:    env.pkgName
			});
		}

		cb(null, { outdated });
	});
};


const analyzeBower = (cb) => {
	if (fss.exists(paths.config.bower)) {

		const isPreVersion = (v1, v2) => {
			return ['premajor', 'preminor', 'prepatch', 'prerelease'].includes(semver.diff(v1, v2));
		};

		const data = {
			outdated: []
		};

		return bower.commands.list(null, { cwd:paths.dir.root }).on('end', (deps) => {

			for (const name in deps.dependencies) {
				if (Object.prototype.hasOwnProperty.call(deps.dependencies, name)) {

					const info = deps.dependencies[name];

					let stable = false;

					if (info.pkgMeta) {

						// If there is an update
						if (info.update && info.pkgMeta.version !== info.update.latest) {

							// If the update is pre-version
							if (isPreVersion(info.update.latest, info.pkgMeta.version)) {

								// Search all versions
								for (const version of info.versions) {

									// If not a pre-version
									if (!isPreVersion(version, info.pkgMeta.version)) {

										// If newer than current version
										if (semver.gt(version, info.pkgMeta.version)) {
											stable = version;

										// Stop looping since in desc order
										} else {
											break;
										}
									}
								}

							// If update is a stable version
							} else {
								stable = info.update.latest;
							}

							// If a stable newer version was found
							if (stable) {
								data.outdated.push({
									name: name,
									current: info.pkgMeta.version,
									latest: stable
								});
							}
						}

					} else {
						data.outdated.push({
							name: name,
							message: 'Not installed'
						});
					}
				}
			}

			return cb(null, data);
		});

	}

	return cb(null, { error:'No bower.json file found' });
};


const compareWorflowToolbox = (cb) => {
	if (fss.exists(paths.config.bower)) {
		const bowerConfig     = require(paths.config.bower);  // eslint-disable-line global-require
		const workflowVersion = env.workflowPkg.version;
		const toolboxVersion  = bowerConfig.devDependencies['nwayo-toolbox'];

		if (workflowVersion !== toolboxVersion) {
			return cb(null, { error:`Workflow ${workflowVersion} / Toolbox ${toolboxVersion} not in sync` });
		}

		return cb(null, { outdated:[] });
	}

	return cb(null, { error:'No bower.json file found' });
};


const report = (title, data) => {
	let reward = false;
	terminal.echoIndent(`${chalk.cyan(title)} diagnosis`);

	if (data.error) {
		terminal.failure(data.error);

	} else if (data.outdated.length) {
		terminal.failure('You are a dull blade   ಠ_ಠ');

		data.outdated.forEach((item) => {
			const msg = item.message ? `${chalk.red(item.message)}` : `${chalk.dim(item.current)} → ${chalk.green(item.latest)}`;
			terminal.echo(`    [${item.name}] : ${msg}`);
		});

		terminal.spacer();

	} else {
		terminal.success('You are cutting edge   (^_^)');
		reward = true;
	}

	terminal.spacer();

	return reward;
};


const colorize = (reward) => {
	const color = {
		pink:  chalk.hex('#ff69b4'),
		green: chalk.hex('#198c19')
	};

	return reward
		.replace(/_.--._/g, `_${color.pink('.--.')}_`)
		.replace(/`--'/g, color.pink('`--\''))
		.replace(/\(\)/g, color.pink('()'))
		.replace(/.==./g, color.green('.==.'))
	;
};






module.exports = class {

	static cli(meowCli) {
		cli.refuseFlagsAndArguments(meowCli);

		terminal.spacer();
		const spinner = terminal.startSpinner(`Diagnosing ${chalk.cyan(env.pkg.name)}...`);

		async.parallel({
			workflow: analyzeWorkflow,
			bower:    analyzeBower,
			compare:  compareWorflowToolbox
		}, (error, data) => {

			spinner.stop();

			const workflowReward = report('Workflow', data.workflow);
			const bowerReward    = report('Bower', data.bower);
			const compareReward  = report('Synchronization', data.compare);

			// Reward
			if (workflowReward && bowerReward && compareReward) {
				const reward = fss.readFile(`${paths.workflow.ressources}/doctor-reward`, 'utf8');
				terminal.echo(colorize(reward));
				terminal.spacer();
			}
		});
	}

};
