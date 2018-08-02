//-------------------------------------
//-- Base tests
//-------------------------------------
'use strict';

const findUp   = require('find-up');
const _        = require('lodash');
const semver   = require('semver');
const paths    = require('../../paths');
const toolbox  = require('../../toolbox');
const assert   = require('../assertions');
const Reporter = require('../reporter');


const reports = new Reporter();


const bowerJson = () => {
	let bowerName;
	const tests = reports.add(assert.exists('bower.json'));

	if (tests.exists) {
		const config = require(`${paths.dir.root}/bower.json`);  // eslint-disable-line global-require
		const differences = toolbox.compareLists(Object.keys(config), ['name', 'private', 'devDependencies', '___nwayo-recommended___']);
		reports.add({
			success:     differences.pass,
			message:     `${Reporter.theme.title('bower.json')}: Must only contain certain attributes`,
			differences: differences
		});

		bowerName = config.name;
		reports.add([
			{
				success: config.name,
				message: `${Reporter.theme.title('bower.json')}: Name must be defined`
			},
			{
				success: config.name === _.kebabCase(config.name),
				message: `${Reporter.theme.title('bower.json')}: Name must be kebab-case`
			},
			{
				success: config.name !== 'PROJECT_NAME',
				message: `${Reporter.theme.title('bower.json')}: Name must not stay 'PROJECT_NAME'`
			}
		]);

		reports.add({
			success: config.private === true,
			message: `${Reporter.theme.title('bower.json')}: Private must be set to true`
		});

		Object.keys(config.devDependencies).forEach((name) => {
			reports.add({
				success: semver.valid(config.devDependencies[name]) || config.devDependencies[name] === 'master',
				message: `${Reporter.theme.title('bower.json')}: devDependencies '${name}' must have a fixed SemVer`
			});
		});
	}

	return bowerName;
};


const packageJson = (bowerName) => {
	const tests = reports.add(assert.exists('package.json'));

	if (tests.exists) {
		const config = require(`${paths.dir.root}/package.json`);  // eslint-disable-line global-require

		const attributesDifferences = toolbox.compareLists(Object.keys(config), ['name', 'license', 'private', 'dependencies']);
		reports.add({
			success:     attributesDifferences.pass,
			message:     `${Reporter.theme.title('package.json')}: Must only contain certain attributes`,
			differences: attributesDifferences
		});

		reports.add([
			{
				success: config.name,
				message: `${Reporter.theme.title('package.json')}: Name must be defined`
			},
			{
				success: config.name === _.kebabCase(config.name),
				message: `${Reporter.theme.title('package.json')}: Name must be kebab-case`
			},
			{
				success: config.name !== 'PROJECT_NAME',
				message: `${Reporter.theme.title('package.json')}: Name must not stay 'PROJECT_NAME'`
			},
			{
				success: config.name === bowerName,
				message: `${Reporter.theme.title('package.json')}: Name must be identical to 'bower.json' name`
			}
		]);

		reports.add({
			success: config.license === 'UNLICENSED',
			message: `${Reporter.theme.title('package.json')}: License must be 'UNLICENSED'`
		});

		reports.add({
			success: config.private === true,
			message: `${Reporter.theme.title('package.json')}: Private must be set to true`
		});

		const packagesDifferences = toolbox.compareLists(Object.keys(config.dependencies), ['@absolunet/nwayo-workflow']);
		reports.add({
			success:     packagesDifferences.pass,
			message:     `${Reporter.theme.title('package.json')}: Must only contain certain dependencies`,
			differences: packagesDifferences
		});

		Object.keys(config.dependencies).forEach((name) => {
			reports.add({
				success: semver.valid(config.dependencies[name]),
				message: `${Reporter.theme.title('package.json')}: Dependencies '${name}' must have a fixed SemVer`
			});
		});
	}
};


const eslintrcYaml = () => {
	const tests = reports.add(assert.exists('.eslintrc.yaml'));

	if (tests.exists) {
		const config = toolbox.readYAML(`${paths.dir.root}/.eslintrc.yaml`);
		reports.add({
			success: config.extends && config.extends === '@absolunet/nwayo',
			message: `${Reporter.theme.title('.eslintrc.yaml')}: Must extend '@absolunet/nwayo'`
		});
	}
};


const stylelintrcYaml = () => {
	const tests = reports.add(assert.exists('.stylelintrc.yaml'));

	if (tests.exists) {
		const config = toolbox.readYAML(`${paths.dir.root}/.stylelintrc.yaml`);
		reports.add({
			success: config.extends && config.extends === '@absolunet/stylelint-config-nwayo',
			message: `${Reporter.theme.title('.stylelintrc.yaml')}: Must extend '@absolunet/stylelint-config-nwayo'`
		});
	}
};


const nwayoYaml = () => {
	const nwayoConf = findUp.sync('nwayo.yaml', { cwd:paths.dir.root });

	reports.add({
		success: nwayoConf,
		message: `${Reporter.theme.title('nwayo.yaml')}: Must exist in parent directories${nwayoConf ? Reporter.theme.comment(` (Found: ${nwayoConf})`) : ''}`
	});
};






class BaseTests {

	run() {

		//-- Directories
		reports.add(assert.isTreeMatrix('/', 'dir',  { pattern:'!+(.git)' }));
		reports.add(assert.exists('.nwayo-cache', { tracked:false }));
		reports.add(assert.exists('bower_components'));
		reports.add(assert.exists('bundles'));
		reports.add(assert.exists('components'));
		reports.add(assert.exists('misc'));
		reports.add(assert.exists('node_modules', { tracked:false }));


		//-- Files
		reports.add(assert.isTreeMatrix('/', 'file', { pattern:'!+(SAMPLE.*.html|nwayo.yaml)' }));

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
		reports.add(assert.exists('konstan.yaml'));

		// lodash.yaml
		reports.add(assert.exists('lodash.yaml'));

		// modernizr.yaml
		reports.add(assert.exists('modernizr.yaml'));

		// nwayo.yaml
		nwayoYaml();

		// package.json
		packageJson(bowerName);

		// package-lock.json
		reports.add(assert.exists('package-lock.json'));

		return reports;
	}

}


module.exports = new BaseTests();
