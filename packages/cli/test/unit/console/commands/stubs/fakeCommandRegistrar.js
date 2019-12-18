//--------------------------------------------------------
//-- nwayo - Test - Unit - Console - Commands - Stubs - Fake Command Registrar
//--------------------------------------------------------
'use strict';


const fakeCommandRegistrar = {
	_resolveAsyncSpy: jest.fn(),
	resolve: jest.fn(() => {
		return new Promise((resolve) => {
			setTimeout(() => {
				fakeCommandRegistrar._resolveAsyncSpy();
				resolve();
			});
		});
	})
};


module.exports = fakeCommandRegistrar;
