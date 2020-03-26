//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Console - Commands - Stubs - Fake Project Service
//--------------------------------------------------------
'use strict';


const fakeProjectService = {
	getSourcePath:    jest.fn(() => {
		return `${fakeProjectService._projectRoot}/src`;
	}),
	getComponentPath: jest.fn((name) => {
		return `${fakeProjectService._projectRoot}/src/components/${name}`;
	}),
	defaultNamespace: '@nwayo-components'
};


module.exports = fakeProjectService;
