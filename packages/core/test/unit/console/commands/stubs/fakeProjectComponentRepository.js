//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Console - Commands - Stubs - Fake Project Component Repository
//--------------------------------------------------------
'use strict';


const fakeProjectComponentRepository = {
	_components: {},
	all: jest.fn(async () => {
		await new Promise(setTimeout);

		return { ...fakeProjectComponentRepository._components };
	})
};


module.exports = fakeProjectComponentRepository;
