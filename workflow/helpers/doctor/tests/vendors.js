//-------------------------------------
//-- Vendors tests
//-------------------------------------
'use strict';

const bower    = require('bower');
const semver   = require('semver');
const fss      = require('@absolunet/fss');
const paths    = require('../../paths');
const Reporter = require('../reporter');


const reports = new Reporter();






class VendorsTests {

	run() {
		return new Promise((resolve) => {

			if (fss.exists(paths.config.bower)) {

				const isPreVersion = (v1, v2) => {
					return ['premajor', 'preminor', 'prepatch', 'prerelease'].includes(semver.diff(v1, v2));
				};

				bower.commands.list(null, { cwd:paths.dir.root }).on('end', (deps) => {

					Object.keys(deps.dependencies).forEach((name) => {
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
							}

							// If a stable newer version was found
							if (stable) {
								reports.add({
									message: `${Reporter.theme.title(name)}:`,
									outdated: {
										current: info.pkgMeta.version,
										latest: stable
									}
								});

							// Up to date
							} else {
								reports.add({
									success: true,
									message: `${Reporter.theme.title(name)}: Cutting edge (${info.pkgMeta.version})`
								});
							}


						} else {
							reports.add({
								success: false,
								message: `${Reporter.theme.title(name)}: Not installed`
							});
						}
					});

					resolve(reports);
				});

			} else {
				reports.add({
					success: false,
					message: `No bower.json file found`
				});

				resolve(reports);
			}

		});
	}

}


module.exports = new VendorsTests();
