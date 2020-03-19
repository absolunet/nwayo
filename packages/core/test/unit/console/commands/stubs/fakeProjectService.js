//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Console - Commands - Stubs - Fake Project Service
//--------------------------------------------------------
'use strict';


const fakeProjectService = {
	getSourcePath: jest.fn(() => {
		return `${fakeProjectService._projectRoot}/src`;
	})
};


module.exports = fakeProjectService;
