//-------------------------------------
//-- Root tests
//-------------------------------------
'use strict';

const findUp   = require('find-up');
const semver   = require('semver');
const paths    = require('../../paths');
const toolbox  = require('../../toolbox');
const assert   = require('../assertions');
const Reporter = require('../reporter');


const reports = new Reporter();


const bowerJson = () => {
	let bowerName;
	const FILE = 'bower.json';
	const tests = reports.add(assert.exists(FILE));

	if (tests.exists) {
		const config = require(`${paths.dir.root}/${FILE}`);  // eslint-disable-line global-require
		const differences = toolbox.compareLists(Object.keys(config), ['name', 'private', 'devDependencies', '___nwayo-recommended___']);
		reports.add({
			success:     differences.pass,
			message:     `${Reporter.theme.title(FILE)}: Must only contain certain attributes`,
			differences: differences
		});

		bowerName = config.name;
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
			success: config.private === true,
			message: `${Reporter.theme.title(FILE)}: Private must be set to true`
		});

		Object.keys(config.devDependencies).forEach((name) => {
			reports.add({
				success: semver.valid(config.devDependencies[name]) || config.devDependencies[name] === 'master',
				message: `${Reporter.theme.title(FILE)}: devDependencies '${name}' must have a fixed SemVer`
			});
		});
	}

	return bowerName;
};


const packageJson = (bowerName) => {
	const FILE = 'package.json';
	const tests = reports.add(assert.exists(FILE));

	if (tests.exists) {
		const config = require(`${paths.dir.root}/${FILE}`);  // eslint-disable-line global-require

		const attributesDifferences = toolbox.compareLists(Object.keys(config), ['name', 'license', 'private', 'dependencies']);
		reports.add({
			success:     attributesDifferences.pass,
			message:     `${Reporter.theme.title(FILE)}: Must only contain certain attributes`,
			differences: attributesDifferences
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
			},
			{
				success: config.name === bowerName,
				message: `${Reporter.theme.title(FILE)}: Name must be identical to 'bower.json' name`
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

		const packagesDifferences = toolbox.compareLists(Object.keys(config.dependencies), ['@absolunet/nwayo-workflow']);
		reports.add({
			success:     packagesDifferences.pass,
			message:     `${Reporter.theme.title(FILE)}: Must only contain certain dependencies`,
			differences: packagesDifferences
		});

		Object.keys(config.dependencies).forEach((name) => {
			reports.add({
				success: semver.valid(config.dependencies[name]),
				message: `${Reporter.theme.title(FILE)}: Dependencies '${name}' must have a fixed SemVer`
			});
		});
	}
};


const eslintrcYaml = () => {
	const FILE = '.eslintrc.yaml';
	const tests = reports.add(assert.exists(FILE));

	if (tests.exists) {
		const config = toolbox.readYAML(`${paths.dir.root}/${FILE}`);
		reports.add({
			success: config.extends && config.extends === '@absolunet/nwayo',
			message: `${Reporter.theme.title(FILE)}: Must extend '@absolunet/nwayo'`
		});
	}
};


const stylelintrcYaml = () => {
	const FILE = '.stylelintrc.yaml';
	const tests = reports.add(assert.exists(FILE));

	if (tests.exists) {
		const config = toolbox.readYAML(`${paths.dir.root}/${FILE}`);
		reports.add({
			success: config.extends && config.extends === '@absolunet/stylelint-config-nwayo',
			message: `${Reporter.theme.title(FILE)}: Must extend '@absolunet/stylelint-config-nwayo'`
		});
	}
};


const nwayoYaml = () => {
	const FILE = paths.filename.mainConfig;
	const nwayoConf = findUp.sync(FILE, { cwd:paths.dir.root });

	reports.add({
		success: nwayoConf,
		message: `${Reporter.theme.title(FILE)}: Must exist in parent directories${nwayoConf ? Reporter.theme.comment(` (Found: ${nwayoConf})`) : ''}`
	});
};






class RootTests {

	run() {
		return new Promise((resolve) => {

			//-- Directories
			reports.add(assert.isTreeMatrix('/', 'dir',  { pattern:'!+(.git)' }));
			reports.add(assert.exists(paths.folder.cache, { tracked:false }));
			reports.add(assert.exists(paths.folder.vendors));
			reports.add(assert.exists(paths.folder.bundles));
			reports.add(assert.exists(paths.folder.components));
			reports.add(assert.exists(paths.folder.misc));
			reports.add(assert.exists(paths.folder.workflowDependencies, { tracked:false }));


			//-- Files
			reports.add(assert.isTreeMatrix('/', 'file', { pattern:`!+(SAMPLE.*.html|${paths.filename.mainConfig})` }));

			// .editorconfig
			reports.add(assert.isMatrix('.editorconfig'));

			// .eslintignore
			reports.add(assert.isMatrix('.eslintignore'));

			// .eslintrc.yaml
			eslintrcYaml();

			// .gitattributes
			reports.add(assert.hasMatrix('.gitattributes'));

			// .gitignore
			reports.add(assert.hasMatrix('.gitignore'));

			// .stylelintignore
			reports.add(assert.isMatrix('.stylelintignore'));

			// .stylelintrc.yaml
			stylelintrcYaml();

			// bower.json
			const bowerName = bowerJson();

			// konstan.yaml
			reports.add(assert.exists(`${paths.filename.konstan}.yaml`));

			// lodash.yaml
			reports.add(assert.exists(`${paths.filename.lodash}.yaml`));

			// modernizr.yaml
			reports.add(assert.exists(`${paths.filename.modernizr}.yaml`));

			// nwayo.yaml
			nwayoYaml();

			// package.json
			packageJson(bowerName);

			// package-lock.json
			reports.add(assert.exists('package-lock.json'));

			resolve(reports);

		});
	}

}


module.exports = new RootTests();
