//-------------------------------------
//-- Bundles tests
//-------------------------------------
'use strict';

const fss      = require('@absolunet/fss');
const Reporter = require('~/classes/reporter');
const Tests    = require('~/classes/tests');
const paths    = require('~/helpers/paths');
const toolbox  = require('~/helpers/toolbox');
const assert   = require('~/helpers/doctor/assertions');


const reports = new Reporter();
const root    = paths.folder.bundles;


const bundleFile = (bundle, file) => {

	const config = fss.readYaml(`${paths.dir.bundles}/${bundle}/${file}`);
	reports.add({
		success: config,
		message: `${Reporter.theme.title(`${bundle}/${file}`)}: Must not be empty`
	});

	//-- Sub
	if (file.startsWith('_') && config) {
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
						success: toolbox.isKebabCase(key),
						message: `${Reporter.theme.title(`${bundle}/${file} > ${type}:${key}`)}: Collection name must be kebab-case`
					});
				});
			}
		});

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

	// No dir
	reports.add(assert.hasNoDirs(bundle, { root }));

	// Files
	const files = fss.scandir(`${paths.dir.bundles}/${bundle}`, 'file', { pattern:`+(_*|${bundle}).${paths.ext.bundles}` });
	const differences = toolbox.compareLists(fss.scandir(`${paths.dir.bundles}/${bundle}`, 'file'), files);

	reports.add({
		success:     differences.pass,
		message:     `${Reporter.theme.title(bundle)}: Folder must contain only valid filenames`,
		differences: differences
	});

	reports.add(assert.exists(`${bundle}/${bundle}.${paths.ext.bundles}`, { root }));

	reports.add(assert.areFilesGitTracked(files, bundle, { root }));

	files.forEach((file) => {
		bundleFile(bundle, file);
	});
};






class BundlesTests extends Tests {

	run() {
		return new Promise((resolve) => {

			// No files on root
			reports.add(assert.hasNoFiles('/', { root }));

			// Bundles
			const bundles = fss.scandir(`${paths.dir.bundles}`, 'dir');
			bundles.forEach((bundle) => {
				bundleDir(bundle);
			});

			resolve(reports);

		});
	}

}


module.exports = new BundlesTests();
