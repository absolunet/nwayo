//-------------------------------------
//-- Tester
//-------------------------------------
'use strict';

const bower          = require('bower');
const chalk          = require('chalk');
const findUp         = require('find-up');
const lastestVersion = require('latest-version');
const _              = require('lodash');
const semver         = require('semver');
const fss            = require('@absolunet/fss');
const env            = require('../env');
const paths          = require('../paths');
const toolbox        = require('../toolbox');
const test           = require('./tests');
const Reporter       = require('./reporter');






/*

lint files (json / yaml / editorconfig)

*/

class Tester {

	//-- Check if config files exists and are valid
	baseStrucure(cb) {
		const reports = new Reporter();
		let lastTest;

		// Directories
		reports.add(test.isTreeMatrix('/', 'dir',  { pattern:'!+(.git)' }));
		reports.add(test.exists('.nwayo-cache', false));
		reports.add(test.exists('bower_components'));
		reports.add(test.exists('bundles'));
		reports.add(test.exists('components'));
		reports.add(test.exists('misc'));
		reports.add(test.exists('node_modules', false));


		// Files
		reports.add(test.isTreeMatrix('/', 'file', { pattern:'!+(SAMPLE.*.html|nwayo.yaml)' }));

		// .editorconfig
		reports.add(test.isMatrix('.editorconfig'));

		// .eslintignore
		reports.add(test.isMatrix('.eslintignore'));

		// .eslintrc.yaml
		lastTest = reports.add(test.exists('.eslintrc.yaml'));
		if (lastTest.exists) {
			const config = toolbox.readYAML(`${paths.dir.root}/.eslintrc.yaml`);
			reports.add({
				success: config.extends && config.extends === '@absolunet/nwayo',
				message: `${chalk.underline('.eslintrc.yaml')}: Must extend '@absolunet/nwayo'`
			});
		}

		// .gitattributes
		reports.add(test.hasMatrix('.gitattributes'));

		// .gitignore
		reports.add(test.hasMatrix('.gitignore'));

		// .stylelintignore
		reports.add(test.isMatrix('.stylelintignore'));

		// .stylelintrc.yaml
		lastTest = reports.add(test.exists('.stylelintrc.yaml'));
		if (lastTest.exists) {
			const config = toolbox.readYAML(`${paths.dir.root}/.stylelintrc.yaml`);
			reports.add({
				success: config.extends && config.extends === '@absolunet/stylelint-config-nwayo',
				message: `${chalk.underline('.stylelintrc.yaml')}: Must extend '@absolunet/stylelint-config-nwayo'`
			});
		}

		// bower.json
		let bowerName;
		lastTest = reports.add(test.exists('bower.json'));
		if (lastTest.exists) {
			const config = require(`${paths.dir.root}/bower.json`);  // eslint-disable-line global-require
			const differences = toolbox.compareLists(Object.keys(config), ['name', 'private', 'devDependencies', '___nwayo-recommended___']);
			reports.add({
				success:     differences.pass,
				message:     `${chalk.underline('bower.json')}: Must only contain certain attributes`,
				differences: differences
			});

			bowerName = config.name;
			reports.add([
				{
					success: config.name,
					message: `${chalk.underline('bower.json')}: Name must be defined`
				},
				{
					success: config.name === _.kebabCase(config.name),
					message: `${chalk.underline('bower.json')}: Name must be kebab-case`
				},
				{
					success: config.name !== 'PROJECT_NAME',
					message: `${chalk.underline('bower.json')}: Name must not stay 'PROJECT_NAME'`
				}
			]);

			reports.add({
				success: config.private === true,
				message: `${chalk.underline('bower.json')}: Private must be set to true`
			});

			Object.keys(config.devDependencies).forEach((name) => {
				reports.add({
					success: semver.valid(config.devDependencies[name]) || config.devDependencies[name] === 'master',
					message: `${chalk.underline('bower.json')}: devDependencies '${name}' must have a fixed SemVer`
				});
			});
		}

		// konstan.yaml
		reports.add(test.exists('konstan.yaml'));

		// lodash.yaml
		reports.add(test.exists('lodash.yaml'));

		// modernizr.yaml
		reports.add(test.exists('modernizr.yaml'));

		// nwayo.yaml
		const nwayoConf = findUp.sync('nwayo.yaml', { cwd:paths.dir.root });
		reports.add({
			success: nwayoConf,
			message: `${chalk.underline('nwayo.yaml')}: Must exist in parent directories${nwayoConf ? ` (Found: ${nwayoConf})` : ''}`
		});

		// package.json
		lastTest = reports.add(test.exists('package.json'));
		if (lastTest.exists) {
			const config = require(`${paths.dir.root}/package.json`);  // eslint-disable-line global-require

			const attributesDifferences = toolbox.compareLists(Object.keys(config), ['name', 'license', 'private', 'dependencies']);
			reports.add({
				success:     attributesDifferences.pass,
				message:     `${chalk.underline('package.json')}: Must only contain certain attributes`,
				differences: attributesDifferences
			});

			reports.add([
				{
					success: config.name,
					message: `${chalk.underline('package.json')}: Name must be defined`
				},
				{
					success: config.name === _.kebabCase(config.name),
					message: `${chalk.underline('package.json')}: Name must be kebab-case`
				},
				{
					success: config.name !== 'PROJECT_NAME',
					message: `${chalk.underline('package.json')}: Name must not stay 'PROJECT_NAME'`
				},
				{
					success: config.name === bowerName,
					message: `${chalk.underline('package.json')}: Name must be identical to 'bower.json' name`
				}
			]);

			reports.add({
				success: config.license === 'UNLICENSED',
				message: `${chalk.underline('package.json')}: License must be 'UNLICENSED'`
			});

			reports.add({
				success: config.private === true,
				message: `${chalk.underline('package.json')}: Private must be set to true`
			});

			const packagesDifferences = toolbox.compareLists(Object.keys(config.dependencies), ['@absolunet/nwayo-workflow']);
			reports.add({
				success:     packagesDifferences.pass,
				message:     `${chalk.underline('package.json')}: Must only contain certain dependencies`,
				differences: packagesDifferences
			});

			Object.keys(config.dependencies).forEach((name) => {
				reports.add({
					success: semver.valid(config.dependencies[name]),
					message: `${chalk.underline('package.json')}: Dependencies '${name}' must have a fixed SemVer`
				});
			});
		}

		// package-lock.json
		reports.add(test.exists('package-lock.json'));

		cb(null, { report:reports.list });
	}


	//-- Check if bundles are valid
	bundles(cb) {
		const reports = new Reporter();

		// No files on root
		reports.add({
			success: fss.scandir(`${paths.dir.bundles}`, 'file').length === 0,
			message: `Root folder must not contain any file`
		});

		// Bundles
		const bundles = fss.scandir(`${paths.dir.bundles}`, 'dir');
		bundles.forEach((bundle) => {

			// Name
			reports.add({
				success: bundle === _.kebabCase(bundle),
				message: `${chalk.underline(bundle)}: Name must be kebab-case`
			});

			// No dir
			reports.add({
				success: fss.scandir(`${paths.dir.bundles}/${bundle}`, 'dir').length === 0,
				message: `${chalk.underline(bundle)}: Folder must not contain any directories`
			});

			// Files
			const files = fss.scandir(`${paths.dir.bundles}/${bundle}`, 'file', { pattern:`+(_*|${bundle}).yaml` });
			const differences = toolbox.compareLists(fss.scandir(`${paths.dir.bundles}/${bundle}`, 'file'), files);

			reports.add({
				success:     differences.pass,
				message:     `${chalk.underline(bundle)}: Folder must contain only valid filenames`,
				differences: differences
			});

			files.forEach((file) => {

				// Sub
				if (file.startsWith('_')) {
					const name = file.replace(/^_?(.*)\.yaml$/, '$1');

					reports.add({
						success: name === _.kebabCase(name),
						message: `${chalk.underline(`${bundle}/${file}`)}: Name must be kebab-case`
					});

				// Main
				} else {

					//

				}

			});

		});

		cb(null, { report:reports.list });
	}


	//-- Check if the workflow needs an update
	workflowUpdates(cb) {
		const current = env.workflowPkg.version;

		lastestVersion(env.pkgName).then((latest) => {
			if (semver.gt(latest, current)) {
				return cb(null, {
					outdated: [{
						current: current,
						latest:  latest,
						name:    env.pkgName
					}]
				});
			}

			return cb(null, { message:`Latest version is ${latest}` });
		});
	}


	//-- Check if bower packages need an update
	bowerUpdates(cb) {
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
	}


	//-- Check if nwayo workflow and toolbox are at the same version
	syncWorkflowToolbox(cb) {
		if (fss.exists(paths.config.bower)) {
			const bowerConfig     = require(paths.config.bower);  // eslint-disable-line global-require
			const workflowVersion = env.workflowPkg.version;
			const toolboxVersion  = bowerConfig.devDependencies['nwayo-toolbox'];

			if (workflowVersion !== toolboxVersion) {
				return cb(null, { error:`Workflow ${workflowVersion} / Toolbox ${toolboxVersion} not in sync` });
			}

			return cb(null, { message:`Workflow / Toolbox are at ${workflowVersion}` });
		}

		return cb(null, { error:'No bower.json file found' });
	}

}


module.exports = new Tester();
