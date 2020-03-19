//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Console - Commands - Project - Stubs - Fake Project Component Repository
//--------------------------------------------------------
'use strict';


const fakeProjectComponentRepository = {
	_components: {
		foo: 'components/foo',
		bar: 'components/bar'
	},
	_allSpy: jest.fn(),
	all:     jest.fn(async () => {
		await new Promise(setTimeout);
		fakeProjectComponentRepository._allSpy();

		return fakeProjectComponentRepository._components
	})
};


module.exports = fakeProjectComponentRepository;
