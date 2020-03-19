//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Console - Commands - Stubs - Fake Command Registrar
//--------------------------------------------------------
'use strict';


const fakeCommandRegistrar = {
	_resolveAsyncSpy: jest.fn(),
	resolve: jest.fn(async () => {
		await new Promise(setTimeout);
		fakeCommandRegistrar._resolveAsyncSpy();
	})
};


module.exports = fakeCommandRegistrar;
