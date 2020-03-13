//--------------------------------------------------------
//-- nwayo core - Test - Unit - Console - Commands - Stubs - Fake Dependency Manager Driver
//--------------------------------------------------------
'use strict';


const fakeDependencyManagerDriver = {
	installSpy: jest.fn(),
	install:    jest.fn(() => {
		return new Promise((resolve) => {
			setTimeout(() => {
				fakeDependencyManagerDriver.installSpy();
				resolve();
			});
		});
	})
};


module.exports = fakeDependencyManagerDriver;
