//--------------------------------------------------------
//-- Nwayo - Test - Unit - Services - Dependency Manager - Drivers - Stubs - Fake Terminal
//--------------------------------------------------------
'use strict';


const fakeTerminal = {
	_spawnSpy: jest.fn(),
	spawn: jest.fn(async () => {
		await new Promise(setTimeout);
		fakeTerminal._spawnSpy();
	})
};


module.exports = fakeTerminal;
