//--------------------------------------------------------
//-- Nwayo - Test - Unit - Console - Stubs - Fake Command Registrar
//--------------------------------------------------------
'use strict';


const fakeCommandRegistrar = {
	addFromFolder: jest.fn(),
	resolve: jest.fn(async () => {
		await new Promise(setTimeout);
		fakeCommandRegistrar._resolveAsyncSpy();
	}),
	_resolveAsyncSpy: jest.fn()
};


module.exports = fakeCommandRegistrar;
