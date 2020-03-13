//--------------------------------------------------------
//-- nwayo - Test - Unit - Console - Stubs - Fake Context Service
//--------------------------------------------------------
'use strict';


const fakeContextService = {
	projectIsLegacy: jest.fn(() => {
		return Boolean(fakeContextService._projectIsLegacy);
	})
};


module.exports = fakeContextService;
