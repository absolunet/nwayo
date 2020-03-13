//--------------------------------------------------------
//-- nwayo - Test - Unit - Console - Stubs - Fake Context Service
//--------------------------------------------------------
'use strict';


const fakeContextService = {
	loadTranslations: jest.fn(async () => {
		await new Promise(setTimeout);
		fakeContextService._loadTranslationsAsyncSpy();
	}),
	_loadTranslationsAsyncSpy: jest.fn()
};


module.exports = fakeContextService;
