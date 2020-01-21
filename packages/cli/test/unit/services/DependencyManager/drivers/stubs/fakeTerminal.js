//--------------------------------------------------------
//-- nwayo - Test - Unit - Services - Dependency Manager - Drivers - Stubs - Fake Terminal
//--------------------------------------------------------
'use strict';


const fakeTerminal = {
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
