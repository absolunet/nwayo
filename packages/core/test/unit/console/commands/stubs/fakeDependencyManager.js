//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Console - Commands - Stubs - Fake Dependency Manager
//--------------------------------------------------------
'use strict';

const fakeDependencyManagerDriver = require('./fakeDependencyManagerDriver');


const fakeDependencyManager = {
	inFolder: jest.fn(() => {
		return fakeDependencyManagerDriver;
	})
};


module.exports = fakeDependencyManager;
