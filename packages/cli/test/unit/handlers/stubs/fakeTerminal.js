//--------------------------------------------------------
//-- Nwayo - Test - Unit - Services - Legacy - Stubs - Fake Terminal
//--------------------------------------------------------
'use strict';


const fakeTerminal = {
	argv: [],
	_spawnSpy: jest.fn(),
	spawn: jest.fn(async () => {
		await new Promise(setTimeout);
		fakeTerminal._spawnSpy();
	})
};


module.exports = fakeTerminal;
