//--------------------------------------------------------
//-- nwayo - Test - Unit - Console - Stubs - Fake Legacy Handler
//--------------------------------------------------------
'use strict';


const fakeLegacyHandler = {
	handle: jest.fn(async () => {
		await new Promise(setTimeout);
		fakeLegacyHandler._handleAsyncSpy();
	}),
	_handleAsyncSpy: jest.fn()
};


module.exports = fakeLegacyHandler;
