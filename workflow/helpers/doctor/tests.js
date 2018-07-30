//-------------------------------------
//-- Tests
//-------------------------------------
'use strict';

const chalk    = require('chalk');
const _        = require('lodash');
const fss      = require('@absolunet/fss');
const terminal = require('@absolunet/terminal');
const paths    = require('../paths');
const toolbox  = require('../toolbox');


//-- Parse a linefeed-separated config
const parseConf = (filename) => {
	return fss.readFile(filename, 'utf8').split(`\n`).filter(Boolean);
};






class Tests {

	// Path exists and is git tracked
	exists(pathname, tracked = true) {
		const exists = [{
			type:    'exists',
			success: fss.exists(`${paths.dir.root}/${pathname}`),
			message: `${chalk.underline(pathname)}: Must exist`
		}];

		const isTracked = Boolean(terminal.runAndGet(`cd ${paths.dir.root}; git ls-files ${pathname}`));

		return exists.concat([{
			type:    'gitTracked',
			success: exists[0].success && ((tracked && isTracked) || (!tracked && !isTracked)),
			message: `${chalk.underline(pathname)}: Must${tracked ? '' : ' not'} be tracked by git`
		}]);
	}

	// Does file exists and is identical to matrix
	isMatrix(filename) {
		const existsReport = this.exists(filename);

		return existsReport.concat([{
			type:    'isMatrix',
			success: existsReport[0].success && fss.readFile(`${paths.dir.root}/${filename}`, 'utf8') === fss.readFile(`${paths.workflow.matrix}/${filename}`, 'utf8'),
			message: `${chalk.underline(filename)}: Must be identical to matrix`
		}]);
	}

	// Does file exists and contains matrix
	hasMatrix(filename) {
		let success = false;
		const missing = [];
		const existsReport = this.exists(filename);

		if (existsReport[0].success) {
			const entries = parseConf(`${paths.dir.root}/${filename}`);

			parseConf(`${paths.workflow.matrix}/${filename}`).forEach((entry) => {
				if (!entries.includes(entry)) {
					missing.push(entry);
				}
			});

			success = missing.length === 0;
		}

		return existsReport.concat([{
			type:    'hasMatrix',
			success: success,
			message: `${chalk.underline(filename)}: Must contain matrix${missing.length !== 0 ? ` (Missing: ${missing.join(' | ')})` : ''}`
		}]);
	}

	// Is the tree identical to matrix
	isTreeMatrix(curr, type, options) {
		const differences = toolbox.compareLists(fss.scandir(`${paths.dir.root}${curr}`, type, options), fss.scandir(`${paths.workflow.matrix}${curr}`, type, options));

		return {
			success:     differences.pass,
			message:     `${chalk.underline(curr || '/')}: ${_.capitalize(type)}s list must be identical to matrix`,
			differences: differences
		};
	}

}

module.exports = new Tests();
