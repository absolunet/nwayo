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

	// Theme
	get theme() {
		return {
			title:   chalk.cyan,
			comment: chalk.blue
		};
	}


	// If tracked by git
	gitTracked(pathname, { root = '', tracked = true } = {}) {
		const isTracked = Boolean(terminal.runAndGet(`cd ${paths.dir.root}/${root}; git ls-files ${pathname}`));

		return [{
			type:    'gitTracked',
			success: (tracked && isTracked) || (!tracked && !isTracked),
			message: `${this.theme.title(pathname)}: Must${tracked ? '' : ' not'} be tracked by git`
		}];
	}


	// Path exists and if tracked by git
	exists(pathname, { root = '', tracked = true } = {}) {
		const exists = [{
			type:    'exists',
			success: fss.exists(`${paths.dir.root}/${root}/${pathname}`),
			message: `${this.theme.title(pathname)}: Must exist`
		}];

		if (exists[0].success) {
			return exists.concat(this.gitTracked(pathname, { root, tracked }));
		}

		return exists;
	}



	// Does file exists and is identical to matrix
	isMatrix(filename) {
		const exists = this.exists(filename);

		if (exists[0].success) {
			return exists.concat([{
				type:    'isMatrix',
				success: fss.readFile(`${paths.dir.root}/${filename}`, 'utf8') === fss.readFile(`${paths.workflow.matrix}/${filename}`, 'utf8'),
				message: `${this.theme.title(filename)}: Must be identical to matrix`
			}]);
		}

		return exists;
	}


	// Does file exists and contains matrix
	hasMatrix(filename) {
		const exists = this.exists(filename);

		if (exists[0].success) {
			const entries = parseConf(`${paths.dir.root}/${filename}`);
			const missing = [];

			parseConf(`${paths.workflow.matrix}/${filename}`).forEach((entry) => {
				if (!entries.includes(entry)) {
					missing.push(entry);
				}
			});

			return exists.concat([{
				type:        'hasMatrix',
				success:     missing.length === 0,
				message:     `${this.theme.title(filename)}: Must contain matrix`,
				differences: { missing }
			}]);
		}

		return exists;
	}


	// Is the tree identical to matrix
	isTreeMatrix(curr, type, options) {
		const differences = toolbox.compareLists(fss.scandir(`${paths.dir.root}${curr}`, type, options), fss.scandir(`${paths.workflow.matrix}${curr}`, type, options));

		return {
			success:     differences.pass,
			message:     `${this.theme.title(curr)}: ${_.capitalize(type)}s list must be identical to matrix`,
			differences: differences
		};
	}

}

module.exports = new Tests();
