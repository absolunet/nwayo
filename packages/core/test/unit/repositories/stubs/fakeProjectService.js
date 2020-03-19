//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Repositories - Stubs - Fake Project Service
//--------------------------------------------------------
'use strict';

const fakeProjectService = {
	getSourcePath: jest.fn(() => {
		return `${fakeProjectService._projectRoot}/src`;
	}),
	getComponentsPath: jest.fn(() => {
		return `${fakeProjectService._projectRoot}/src/components`;
	})
};


module.exports = fakeProjectService;
