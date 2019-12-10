//--------------------------------------------------------
//-- nwayo - Test - Unit - Console - Commands - Stubs - Fake Dependency Manager Driver
//--------------------------------------------------------
'use strict';


const fakeDependencyManagerDriver = {
	install: jest.fn(() => {
		return new Promise(setTimeout);
	})
};


module.exports = fakeDependencyManagerDriver;
