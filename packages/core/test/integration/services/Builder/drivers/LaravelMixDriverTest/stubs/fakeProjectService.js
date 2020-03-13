//--------------------------------------------------------
//-- Node IoC - Test - Integration - Services - Builder - Drivers - Laravel Mix Driver - Stubs - Fake Project Service
//--------------------------------------------------------
'use strict';


const fakeProjectService = {
	getRootPath: jest.fn(() => {
		return '/path/to/root';
	})
};


module.exports = fakeProjectService;
