//-------------------------------------
//-- Root tests
//-------------------------------------
'use strict';

const findUp   = require('find-up');
const semver   = require('semver');
const fss      = require('@absolunet/fss');
const Reporter = require('~/classes/reporter');
const Tests    = require('~/classes/tests');
const env      = require('~/helpers/env');
const paths    = require('~/helpers/paths');
const toolbox  = require('~/helpers/toolbox');
const assert   = require('~/helpers/doctor/assertions');


const reports = new Reporter();


const bowerJson = () => {
	let bowerName;
	const FILE = 'bower.json';
	const tests = reports.add(assert.exists(FILE));

	if (tests.exists) {
		const config = fss.readJson(`${paths.dir.root}/${FILE}`);
		const differences = toolbox.compareLists(Object.keys(config), ['name', 'private', 'devDependencies', `___${env.id}-recommended___`]);
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
		const config = fss.readJson(`${paths.dir.root}/${FILE}`);

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

		const packagesDifferences = toolbox.compareLists(Object.keys(config.dependencies), [env.pkgName]);
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
		const config = fss.readYaml(`${paths.dir.root}/${FILE}`);
		reports.add({
			success: config.extends && config.extends === `@absolunet/${env.id}`,
			message: `${Reporter.theme.title(FILE)}: Must extend '@absolunet/${env.id}'`
		});
	}
};


const stylelintrcYaml = () => {
	const FILE = '.stylelintrc.yaml';
	const tests = reports.add(assert.exists(FILE));

	if (tests.exists) {
		const config = fss.readYaml(`${paths.dir.root}/${FILE}`);
		reports.add({
			success: config.extends && config.extends === `@absolunet/stylelint-config-${env.id}`,
			message: `${Reporter.theme.title(FILE)}: Must extend '@absolunet/stylelint-config-${env.id}'`
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






class RootTests extends Tests {

	// eslint-disable-next-line require-await
	async run() {

		//-- Directories
		reports.add(assert.isTreeMatrix('/', 'dir',  { pattern:'!+(.git|.nwayo-cache|node_modules)' }));
		reports.add(assert.exists(paths.folder.vendors));
		reports.add(assert.exists(paths.folder.bundles));
		reports.add(assert.exists(paths.folder.components));
		reports.add(assert.exists(paths.folder.misc));
		reports.add(assert.exists(paths.folder.workflowDependencies, { tracked:false }));


		//-- Files
		reports.add(assert.isTreeMatrix('/', 'file', { pattern:`!+(${paths.filename.mainConfig}|.gitignore)` }));

		// .editorconfig
		reports.add(assert.isMatrix('.editorconfig'));

		// .eslintignore
		reports.add(assert.isMatrix('.eslintignore'));

		// .eslintrc.yaml
		eslintrcYaml();

		// .gitattributes
		reports.add(assert.hasMatrix('.gitattributes'));

		// .gitignore
		reports.add(assert.exists('.gitignore'));

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


		return reports;
	}

}


module.exports = new RootTests();
