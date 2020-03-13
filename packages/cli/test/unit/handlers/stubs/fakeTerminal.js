//--------------------------------------------------------
//-- nwayo - Test - Unit - Services - Legacy - Stubs - Fake Terminal
//--------------------------------------------------------
'use strict';


const fakeTerminal = {
	argv: [],
	_spawnSpy: jest.fn(),
	spawn: jest.fn(async () => {
		await new Promise((resolve) => {
			setTimeout(() => {
				fakeTerminal._spawnSpy();
				resolve();
			});
		});
	})
};


module.exports = fakeTerminal;
