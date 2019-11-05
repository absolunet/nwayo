//-------------------------------------
//-- Doctor
//-------------------------------------
'use strict';

const async       = require('async');
const bower       = require('bower');
const chalk       = require('chalk');
const { Spinner } = require('cli-spinner');
const david       = require('david');
const fs          = require('fs');
const semver      = require('semver');
const helper      = require('../helpers/cli');

let context = null;



//-- node
const analyzeNode = (callback) => {
	const data = {
		outdated: []
	};

	return async.parallel({
		development: (callback2) => {
			david.getUpdatedDependencies(context.packageConfig, { dev: true }, (er, deps) => {  // eslint-disable-line unicorn/prevent-abbreviations
				callback2(null, deps);
			});
		},
		production: (callback2) => {
			david.getUpdatedDependencies(context.packageConfig, { dev: false }, (er, deps) => {  // eslint-disable-line unicorn/prevent-abbreviations
				callback2(null, deps);
			});
		}
	}, (error, results) => {

		Object.entries(results).forEach(([, deps]) => {
			Object.entries(deps).forEach(([name, version]) => {
				if (version.required !== version.stable) {
					data.outdated.push({
						name,
						current: version.required,
						latest: version.stable
					});
				}
			});
		});

		callback(null, data);
	});
};



//-- bower
const analyzeBower = (callback) => {

	if (fs.existsSync(`${context.cwd}/bower.json`)) {

		const isPreVersion = (v1, v2) => {
			return ['premajor', 'preminor', 'prepatch', 'prerelease'].includes(semver.diff(v1, v2));
		};

		const data = {
			outdated: []
		};

		return bower.commands.list(null, { cwd: context.cwd }).on('end', (deps) => {

			for (const name in deps.dependencies) {
				if (Object.prototype.hasOwnProperty.call(deps.dependencies, name)) {

					const info = deps.dependencies[name];

					let stable = false;

					if (info.pkgMeta) {

						// if there is an update
						if (info.update && info.pkgMeta.version !== info.update.latest) {

							// if the update is pre-version
							if (isPreVersion(info.update.latest, info.pkgMeta.version)) {

								// search all versions
								for (const version of info.versions) {

									// if not a pre-version
									if (!isPreVersion(version, info.pkgMeta.version)) {

										// if newer than current version
										if (semver.gt(version, info.pkgMeta.version)) {
											stable = version;

										// stop looping since in desc order
										} else {
											break;
										}
									}
								}

							// if update is a stable version
							} else {
								stable = info.update.latest;
							}

							// if a stable newer version was found
							if (stable) {
								data.outdated.push({
									name,
									current: info.pkgMeta.version,
									latest: stable
								});
							}
						}

					} else {
						data.outdated.push({
							name,
							message: 'Not installed'
						});
					}
				}
			}

			return callback(null, data);
		});

	}

	return callback(null, { error: 'No bower.json file found' });
};



//-- report
const report = (title, data) => {
	let reward = false;
	helper.echo(`  ${chalk.yellow(title)} diagnosis`);

	if (data.error) {
		helper.echo(chalk.red(`    ${data.error}`));

	} else if (data.outdated.length !== 0) {
		helper.echo(chalk.red('    You are a dull blade   ಠ_ಠ\n'));

		data.outdated.forEach((item) => {
			const message = item.message ? `${chalk.red(item.message)}` : `${chalk.red(item.current)} ➝  ${chalk.green(item.latest)}`;
			helper.echo(`    [${item.name}] : ${message}`);
		});

	} else {
		helper.echo(chalk.green('    You are cutting edge   (^_^)'));
		reward = true;
	}

	helper.echo('\n');

	return reward;
};



//-- PUBLIC
module.exports = {

	//-- Run
	run: (contextParameter) => {
		context = contextParameter;

		helper.echo('');
		const spin = new Spinner(`Diagnosing ${chalk.cyan(context.packageConfig.name)}... %s`);
		spin.start();

		return async.parallel({
			node:  analyzeNode,
			bower: analyzeBower
		}, (error, data) => {

			spin.stop();
			helper.echo('\n');

			const nodeReward  = report('Node', data.node);
			const bowerReward = report('Bower', data.bower);

			// reward
			if (nodeReward && bowerReward) {
				helper.echo(fs.readFileSync(`${__dirname}/../text/reward.txt`, 'utf8'));
				helper.echo('');
			}
		});
	}
};
