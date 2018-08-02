//-------------------------------------
//-- Bundles tests
//-------------------------------------
'use strict';

const _        = require('lodash');
const fss      = require('@absolunet/fss');
const paths    = require('../../paths');
const toolbox  = require('../../toolbox');
const assert   = require('../assertions');
const Reporter = require('../reporter');


const reports = new Reporter();
const root    = 'bundles';


const bundleFile = (bundle, file) => {

	const config = toolbox.readYAML(`${paths.dir.bundles}/${bundle}/${file}`);
	reports.add({
		success: config,
		message: `${Reporter.theme.title(`${bundle}/${file}`)}: Must not be empty`
	});

	//-- Sub
	if (file.startsWith('_')) {
		const name = file.replace(/^_?(.*)\.yaml$/, '$1');

		reports.add({
			success: name === _.kebabCase(name),
			message: `${Reporter.theme.title(`${bundle}/${file}`)}: Name must be kebab-case`
		});

		if (config) {
			const keyDifferences = toolbox.compareLists(toolbox.flattenKeys(config, { depth:1 }), ['scripts', 'scripts.collections', 'styles', 'styles.collections']);
			reports.add({
				success:     keyDifferences.superfluous.length === 0,
				message:     `${Reporter.theme.title(`${bundle}/${file}`)}: Subbundle must only contain collections`,
				differences: { superfluous:keyDifferences.superfluous }
			});

			['scripts', 'styles'].forEach((type) => {
				if (config[type]) {
					Object.keys(config[type].collections).forEach((key) => {
						reports.add({
							success: key === _.kebabCase(key),
							message: `${Reporter.theme.title(`${bundle}/${file} > ${type}:${key}`)}: Collection name must be kebab-case`
						});
					});
				}
			});
		}

	//-- Main
	} else if (config) {
		const mandatoryKeys = ['output', 'output.konstan', 'output.build', 'output.url', 'scripts', 'scripts.options', 'scripts.options.minify', 'scripts.options.babel', 'styles', 'styles.options', 'styles.options.minify', 'styles.options.sourcemaps', 'styles.options.autoprefixer'];
		const allowedKeys   = mandatoryKeys.concat('assets', 'assets.components', 'scripts.allowBabel');
		const configKeys    = toolbox.flattenKeys(config, { depth:3 });

		const mandatoryDifferences = toolbox.compareLists(configKeys, mandatoryKeys);
		const allowedDifferences   = toolbox.compareLists(configKeys, allowedKeys);

		reports.add({
			success:     mandatoryDifferences.missing.length === 0 && allowedDifferences.superfluous.length === 0,
			message:     `${Reporter.theme.title(`${bundle}/${file}`)}: Main bundle must contain only certain keys`,
			differences: { missing:mandatoryDifferences.missing, superfluous:allowedDifferences.superfluous }
		});
	}
};


const bundleDir = (bundle) => {

	// Name
	reports.add({
		success: bundle === _.kebabCase(bundle),
		message: `${Reporter.theme.title(bundle)}: Name must be kebab-case`
	});

	// No dir
	reports.add(assert.hasNoDirs(bundle, { root }));

	// Files
	const files = fss.scandir(`${paths.dir.bundles}/${bundle}`, 'file', { pattern:`+(_*|${bundle}).yaml` });
	const differences = toolbox.compareLists(fss.scandir(`${paths.dir.bundles}/${bundle}`, 'file'), files);

	reports.add({
		success:     differences.pass,
		message:     `${Reporter.theme.title(bundle)}: Folder must contain only valid filenames`,
		differences: differences
	});

	reports.add(assert.exists(`${bundle}/${bundle}.yaml`, { root }));

	reports.add(assert.areFilesGitTracked(files, bundle, { root }));

	files.forEach((file) => {
		bundleFile(bundle, file);
	});
};






class BundlesTests {

	run() {

		// No files on root
		reports.add(assert.hasNoFiles('/', { root }));

		// Bundles
		const bundles = fss.scandir(`${paths.dir.bundles}`, 'dir');
		bundles.forEach((bundle) => {
			bundleDir(bundle);
		});

		return reports;
	}

}


module.exports = new BundlesTests();
