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
	_saveMultipleLocalSpy: jest.fn(),
	saveMultipleLocal: jest.fn(async () => {
		await new Promise(setTimeout);
		fakeDependencyManagerDriver._saveMultipleLocalSpy();
	}),
	_clearLocalSpy: jest.fn(),
	clearLocal: jest.fn(async () => {
		await new Promise(setTimeout);
		fakeDependencyManagerDriver._clearLocalSpy();
	})
};


module.exports = fakeDependencyManagerDriver;
