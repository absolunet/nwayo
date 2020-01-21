//--------------------------------------------------------
//-- Tests - Unit - Console - Commands - Build - Stubs - Fake Nwayo
//--------------------------------------------------------
'use strict';


const fakeNwayo = {
	_buildAsyncSpy: jest.fn(),
	build: jest.fn(() => {
		return new Promise((resolve) => {
			setTimeout(() => {
				fakeNwayo._buildAsyncSpy();
				resolve();
			});
		});
	})
};


module.exports = fakeNwayo;
