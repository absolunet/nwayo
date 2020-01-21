//--------------------------------------------------------
//-- nwayo - Test - Unit - Services - Legacy - Stubs - Fake File Manager
//--------------------------------------------------------
'use strict';


const fakeFileManager = {
	_fakePackageJson: {
		name: '@absolunet/nwayo-cli',
		bin: {
			nwayo: 'bin/nwayo'
		}
	},
	load: jest.fn((path) => {
		const file = fakeFileManager._fakePackageJson;

		if (path.endsWith(`${file.name}/package.json`)) {
			return file;
		}

		return '';
	})
};


module.exports = fakeFileManager;
