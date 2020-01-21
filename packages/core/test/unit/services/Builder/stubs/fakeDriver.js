//--------------------------------------------------------
//-- Tests - Unit - Services - Builder - Stubs - Fake Driver
//--------------------------------------------------------
'use strict';


const fakeDriver = {
	buildConfig: jest.fn(() => {
		return { _isMockedConfig: true };
	})
};


module.exports = fakeDriver;
