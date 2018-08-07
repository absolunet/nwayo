//-------------------------------------
//-- General tests
//-------------------------------------
'use strict';

const async         = require('async');
const { CLIEngine } = require('eslint');
const replaceAll    = require('replaceall');
const yamlLint      = require('yaml-lint');
const fss           = require('@absolunet/fss');
const paths         = require('../../paths');
const toolbox       = require('../../toolbox');
const Reporter      = require('../reporter');


const reports = new Reporter();


const getPathsToCheck = (type, { extension, keepRoot = true }) => {
	let list = fss
		.scandir(paths.dir.root, type, { recursive:true, pattern:`!+(${paths.folder.cache}|${paths.folder.vendors}|${paths.folder.workflowDependencies})/**` })
		.filter((pathname) => {
			return !new RegExp(`${paths.folder.components}\\/[a-z0-9-]+\\/(${paths.folder.scripts}|${paths.folder.styles})\\/${paths.folder.nolint}`).test(pathname);
		})
	;

	if (!keepRoot) {
		list = list.filter((pathname) => {
			return (/\//).test(pathname);
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

	getPathsToCheck(type, { keepRoot:false }).forEach((item) => {
		let name = item.split('/').pop();

		if (isFile) {
			name = name
				.replace(/^[_.]?(.+)$/,   '$1')
				.replace(/^(.+)?(\..+)$/, '$1')  // eslint-disable-line unicorn/no-unsafe-regex
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

	const cli = new CLIEngine({ plugins:['json'], extensions:['.json'], useEslintrc:false });

	getPathsToCheck('file', { extension:'json' }).forEach((file) => {
		const report = cli.executeOnFiles([`${paths.dir.root}/${file}`]);

		let error = false;
		if (report.errorCount > 0 || report.warningCount > 0) {
			error = replaceAll(`${paths.dir.root}/`, '', cli.getFormatter()(report.results));
		}

		lints.push({
			success:      error === false,
			message:      `${Reporter.theme.title(file)}: JSON must be valid`,
			linterOutput: error
		});


	});

	return lints;
};


const lintYAML = () => {
	return new Promise((resolve) => {

		const lints = [];

		const calls = [];
		getPathsToCheck('file', { extension:'yaml' }).forEach((file) => {
			calls.push((cb) => {
				let error = false;

				yamlLint.lintFile(`${paths.dir.root}/${file}`)
					.catch((error2) => {
						error = error2;
					})
					.finally(() => {
						lints.push({
							success:      error === false,
							message:      `${Reporter.theme.title(file)}: YAML must be valid`,
							linterOutput: error
						});

						cb();
					})
				;
			});
		});

		async.parallel(calls, () => {
			resolve(lints);
		});

	});
};






class GeneralTests {

	run() {
		return new Promise((resolve) => {

			reports.add(kebabCase('dir'));
			reports.add(kebabCase('file'));
			reports.add(lintJSON());

			lintYAML().then((lints) => {
				reports.add(lints);
				resolve(reports);
			});

		});
	}

}


module.exports = new GeneralTests();
