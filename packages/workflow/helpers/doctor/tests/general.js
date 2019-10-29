//-------------------------------------
//-- General tests
//-------------------------------------
'use strict';

const { CLIEngine } = require('eslint');
const replaceAll    = require('replaceall');
const yamlLint      = require('yaml-lint');
const fss           = require('@absolunet/fss');
const Reporter      = require('~/classes/reporter');
const Tests         = require('~/classes/tests');
const paths         = require('~/helpers/paths');
const toolbox       = require('~/helpers/toolbox');


const reports = new Reporter();


const getPathsToCheck = (type, { extension, keepRoot = true }) => {
	let list = fss
		.scandir(paths.directory.root, type, { recursive: true, pattern: `!+(${paths.folder.cache}|${paths.folder.workflowDependencies}|${paths.folder.vendors})/**` })
		.filter((pathname) => {
			return !new RegExp(`${paths.folder.components}\\/[a-z0-9-]+\\/(${paths.folder.scripts}|${paths.folder.styles})\\/${paths.folder.nolint}`, 'u').test(pathname);
		})
	;

	if (!keepRoot) {
		list = list.filter((pathname) => {
			return (/\//u).test(pathname);
		});
	}

	if (extension) {
		list = list.filter((pathname) => {
			return pathname.endsWith(`.${extension}`);
		});
	}

	return list;
};


const kebabCase = (type) => {
	const isFile = type === 'file';

	const mismatched = [];

	getPathsToCheck(type, { keepRoot: false }).forEach((item) => {
		let name = item.split('/').pop();

		if (isFile) {
			name = name
				.replace(/^[_.]?(?<rest>.+)$/u,   '$<rest>')
				.replace(/^(?<name>.+)?(?<ext>\..+)$/u, '$<name>')
			;
		}

		if (!toolbox.isKebabCase(name)) {
			mismatched.push(item);
		}
	});

	return {
		success:     mismatched.length === 0,
		message:     `All ${isFile ? 'files' : 'directories'} must be kebab-case`,
		differences: { mismatched }
	};
};


const lintJSON = () => {
	const lints = [];

	const cli = new CLIEngine({ plugins: ['json'], extensions: ['.json'], useEslintrc: false });

	getPathsToCheck('file', { extension: 'json' }).forEach((file) => {
		const report = cli.executeOnFiles([`${paths.directory.root}/${file}`]);

		let error = false;
		if (report.errorCount > 0 || report.warningCount > 0) {
			error = replaceAll(`${paths.directory.root}/`, '', cli.getFormatter()(report.results));
		}

		lints.push({
			success:      error === false,
			message:      `${Reporter.theme.title(file)}: JSON must be valid`,
			linterOutput: error
		});


	});

	return lints;
};


const lintYAML = async () => {

	const lints = [];

	const calls = [];
	getPathsToCheck('file', { extension: 'yaml' }).forEach((file) => {
		calls.push(new Promise((resolve) => {
			let finalError = false;

			yamlLint.lintFile(`${paths.directory.root}/${file}`)
				.catch((error) => {
					finalError = error;
				})
				.finally(() => {
					lints.push({
						success:      finalError === false,
						message:      `${Reporter.theme.title(file)}: YAML must be valid`,
						linterOutput: finalError
					});

					resolve();
				})
			;
		}));
	});

	await Promise.all(calls);

	return lints;
};






class GeneralTests extends Tests {

	async run() {

		reports.add(kebabCase('dir'));
		reports.add(kebabCase('file'));
		reports.add(lintJSON());

		const lints = await lintYAML();
		reports.add(lints);

		return reports;
	}

}


module.exports = new GeneralTests();
