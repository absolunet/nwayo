//--------------------------------------------------------
//-- Nwayo - Test - Unit - Services - Legacy - Stubs - Fake File Manager
//--------------------------------------------------------
'use strict';


const fakeFileManager = {
	_fakeFiles: {},
	exists: jest.fn((path) => {
		return Boolean(fakeFileManager._fakeFiles[path]);
	}),
	load: jest.fn((path) => {
		const file = fakeFileManager._fakeFiles[path];

		if (typeof file === 'undefined') {
			throw new TypeError('File not found');
		}

		return file;
	})
};


module.exports = fakeFileManager;
