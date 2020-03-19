//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Repositories - Stubs - Fake Dependency Manager
//--------------------------------------------------------
'use strict';

const fakeDependencyManagerDriver = require('./fakeDependencyManagerDriver');


const fakeDependencyManager = {
	inFolder: jest.fn((folder) => {
		fakeDependencyManagerDriver._folder = folder;

		return fakeDependencyManagerDriver;
	})
};


module.exports = fakeDependencyManager;
