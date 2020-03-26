//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Console - Commands - Stubs - Fake Dependency Manager Driver
//--------------------------------------------------------
'use strict';


const fakeDependencyManagerDriver = {
	_installSpy: jest.fn(),
	install: jest.fn(async () => {
		await new Promise(setTimeout);
		fakeDependencyManagerDriver._installSpy();
	}),
	_saveSpy: jest.fn(),
	save: jest.fn(async () => {
		await new Promise(setTimeout);
		fakeDependencyManagerDriver._saveSpy();
	}),
	_saveMultipleLocalSpy: jest.fn(),
	saveMultipleLocal: jest.fn(async () => {
		await new Promise(setTimeout);
		fakeDependencyManagerDriver._saveMultipleLocalSpy();
	}),
	_clearLocalSpy: jest.fn(),
	clearLocal: jest.fn(async () => {
		await new Promise(setTimeout);
		fakeDependencyManagerDriver._clearLocalSpy();
	}),
	_versions: {},
	getAvailableVersions: jest.fn(async (packageName) => {
		await new Promise(setTimeout);

		return fakeDependencyManagerDriver._versions[packageName];
	})
};


module.exports = fakeDependencyManagerDriver;
