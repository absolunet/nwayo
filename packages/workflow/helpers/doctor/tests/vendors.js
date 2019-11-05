//-------------------------------------
//-- Vendors tests
//-------------------------------------
'use strict';

const npmCheck = require('npm-check');
const semver   = require('semver');
const fss      = require('@absolunet/fss');
const Reporter = require('~/classes/reporter');
const Tests    = require('~/classes/tests');
const env      = require('~/helpers/env');
const paths    = require('~/helpers/paths');
const toolbox  = require('~/helpers/toolbox');
const assert   = require('~/helpers/doctor/assertions');


const reports = new Reporter();






class VendorsTests extends Tests {

	async run() {
		const FILE  = `${paths.folder.vendors}/package.json`;
		const tests = reports.add(assert.exists(FILE));

		if (tests.exists) {

			// Validate package.json
			const config      = fss.readJson(paths.config.vendors);
			const differences = toolbox.compareLists(Object.keys(config), ['name', 'license', 'private', 'dependencies', `___${env.id}-recommended___`]);
			reports.add({
				success:     differences.pass,
				message:     `${Reporter.theme.title(FILE)}: Must only contain certain attributes`,
				differences
			});

			reports.add([
				{
					success: config.name,
					message: `${Reporter.theme.title(FILE)}: Name must be defined`
				},
				{
					success: toolbox.isKebabCase(config.name),
					message: `${Reporter.theme.title(FILE)}: Name must be kebab-case`
				},
				{
					success: config.name !== 'PROJECT_NAME',
					message: `${Reporter.theme.title(FILE)}: Name must not stay 'PROJECT_NAME'`
				}
			]);

			reports.add({
				success: config.license === 'UNLICENSED',
				message: `${Reporter.theme.title(FILE)}: License must be 'UNLICENSED'`
			});

			reports.add({
				success: config.private === true,
				message: `${Reporter.theme.title(FILE)}: Private must be set to true`
			});


			// Dependencies
			const currentState = await npmCheck({
				cwd: paths.directory.vendors
			});

			for (const { moduleName: name, isInstalled, packageJson: wanted, installed, latest } of currentState.get('packages')) {

				const isFixedVersion = semver.valid(wanted);
				reports.add({
					success: isFixedVersion,
					message: `${Reporter.theme.title(name)}: Must have a fixed SemVer (${wanted})`
				});

				if (isFixedVersion) {
					reports.add({
						success: isInstalled,
						message: `${Reporter.theme.title(name)}: Must be installed`
					});

					reports.add({
						success: installed === wanted,
						message: `${Reporter.theme.title(name)}: Installed version (${installed}) must be identical to wanted version (${wanted})`
					});

					if (wanted !== latest) {
						reports.add({
							message: `${Reporter.theme.title(name)}:`,
							outdated: {
								current: wanted,
								latest
							}
						});
					} else {
						reports.add({
							success: true,
							message: `${Reporter.theme.title(name)}: Cutting edge (${wanted})`
						});
					}
				}

			}
		} else {
			reports.add({
				success: false,
				message: `No package.json file found`
			});
		}

		return reports;
	}

}


module.exports = new VendorsTests();
