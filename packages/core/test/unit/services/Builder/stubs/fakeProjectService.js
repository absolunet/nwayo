//--------------------------------------------------------
//-- Tests - Unit - Services - Builder - Drivers - Stubs - Fake Project Service
//--------------------------------------------------------
'use strict';


const fakeProjectService = {
	_bundles: {},
	getBundles: jest.fn(() => {
		return Object.keys(fakeProjectService._bundles);
	}),
	loadBundleData: jest.fn((bundle) => {
		return fakeProjectService._bundles[bundle];
	})
};


module.exports = fakeProjectService;
