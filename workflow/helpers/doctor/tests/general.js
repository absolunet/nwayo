//-------------------------------------
//-- General tests
//-------------------------------------
'use strict';

const fss      = require('@absolunet/fss');
const paths    = require('../../paths');
const toolbox  = require('../../toolbox');
const Reporter = require('../reporter');


const reports = new Reporter();


const kebabCase = (type) => {
	const isFile = type === 'file';

	const list = fss
		.scandir(paths.dir.root, type, { recursive:true, pattern:`!+(${paths.folder.cache}|${paths.folder.vendors}|${paths.folder.workflowDependencies})/**` })
		.filter((pathname) => {
			return (/\//).test(pathname) && !new RegExp(`${paths.folder.components}\\/[a-z0-9-]+\\/(${paths.folder.scripts}|${paths.folder.styles})\\/${paths.folder.nolint}`).test(pathname);
		})
	;

	const mismatched = [];

	list.forEach((item) => {
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






class GeneralTests {

	run() {

		reports.add(kebabCase('dir'));
		reports.add(kebabCase('file'));

		return reports;
	}

}


module.exports = new GeneralTests();
