//-------------------------------------
//-- Vendors tests
//-------------------------------------
'use strict';

const bower  = require('bower');
const semver = require('semver');
const fss    = require('@absolunet/fss');
const paths  = require('../../paths');






class VendorsTests {

	run() {

		return new Promise((resolve) => {

			if (fss.exists(paths.config.bower)) {

				const isPreVersion = (v1, v2) => {
					return ['premajor', 'preminor', 'prepatch', 'prerelease'].includes(semver.diff(v1, v2));
				};

				const data = {
					outdated: []
				};

				bower.commands.list(null, { cwd:paths.dir.root }).on('end', (deps) => {

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

					resolve(data);
				});

			}

			resolve({ error:'No bower.json file found' });
		});
	}

}


module.exports = new VendorsTests();
