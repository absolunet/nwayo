//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Repositories - Stubs - Fake Dependency Manager Driver
//--------------------------------------------------------
'use strict';

const fakeAsyncFileSystem = require('./fakeAsyncFileSystem');


const fakeDependencyManagerDriver = {
	loadPackageJson: jest.fn(() => {
		return fakeAsyncFileSystem.readJson(`${fakeDependencyManagerDriver._folder}/package.json`);
	})
};


module.exports = fakeDependencyManagerDriver;
