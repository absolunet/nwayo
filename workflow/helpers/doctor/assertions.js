//-------------------------------------
//-- Assertions
//-------------------------------------
'use strict';

const _        = require('lodash');
const fss      = require('@absolunet/fss');
const terminal = require('@absolunet/terminal');
const paths    = require('../paths');
const toolbox  = require('../toolbox');
const Reporter = require('./reporter');


//-- Parse a linefeed-separated config
const parseConf = (filename) => {
	return fss.readFile(filename, 'utf8').split(`\n`).filter(Boolean);
};






class Assertions {

	// If tracked by git
	gitTracked(pathname, { root = '', tracked = true } = {}) {
		const isTracked = Boolean(terminal.runAndGet(`cd ${paths.dir.root}/${root}; git ls-files ${pathname}`));

		return [{
			type:    'gitTracked',
			success: (tracked && isTracked) || (!tracked && !isTracked),
			message: `${Reporter.theme.title(pathname)}: Must${tracked ? '' : ' not'} be tracked by git`
		}];
	}


	// Path exists and if tracked by git
	exists(pathname, { root = '', tracked = true } = {}) {
		const exists = [{
			type:    'exists',
			success: fss.exists(`${paths.dir.root}/${root}/${pathname}`),
			message: `${Reporter.theme.title(pathname)}: Must exist`
		}];

		if (exists[0].success) {
			return exists.concat(this.gitTracked(pathname, { root, tracked }));
		}

		return exists;
	}


	// No dir on root
	hasNoDirs(pathname, { root = '' } = {}) {
		return {
			success: fss.scandir(`${paths.dir.root}/${root}/${pathname}`, 'dir').length === 0,
			message: `${Reporter.theme.title(pathname)}: Root folder must not contain any directory`
		};
	}


	// No files on root
	hasNoFiles(pathname, { root = '' } = {}) {
		return {
			success: fss.scandir(`${paths.dir.root}/${root}/${pathname}`, 'file').length === 0,
			message: `${Reporter.theme.title(pathname)}: Root folder must not contain any file`
		};
	}


	// Is the tree completely tracked
	areFilesGitTracked(files, pathname, { root = '' }) {
		const rawFiles     = files.map((file) => { return `${pathname}/${file}`; });
		const trackedFiles = terminal.runAndRead(`cd ${paths.dir.root}/${root}; git ls-files ${pathname}`).split('\n');
		const differences  = toolbox.compareLists(trackedFiles, rawFiles);

		return {
			success:     differences.missing.length === 0,
			message:     `${Reporter.theme.title(pathname)}: All files must be tracked by git`,
			differences: { missing:differences.missing }
		};
	}


	// Does file exists and is identical to matrix
	isMatrix(filename) {
		const exists = this.exists(filename);

		if (exists[0].success) {
			return exists.concat([{
				type:    'isMatrix',
				success: fss.readFile(`${paths.dir.root}/${filename}`, 'utf8') === fss.readFile(`${paths.workflow.matrix}/${filename}`, 'utf8'),
				message: `${Reporter.theme.title(filename)}: Must be identical to matrix`
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
				message:     `${Reporter.theme.title(filename)}: Must contain matrix`,
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
			message:     `${Reporter.theme.title(curr)}: ${_.capitalize(type)}s list must be identical to matrix`,
			differences: differences
		};
	}

}

module.exports = new Assertions();
