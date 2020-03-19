//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Services - Stubs - Fake Build Type Repository
//--------------------------------------------------------
'use strict';


const fakeBuildTypeRepository = {
	_types: {},
	add: jest.fn((key, value) => {
		fakeBuildTypeRepository[key] = value;
	}),
	all: jest.fn(() => {
		return { ...fakeBuildTypeRepository._types };
	}),
	get: jest.fn((key) => {
		return fakeBuildTypeRepository._types[key];
	}),
	has: jest.fn((key) => {
		return Boolean(fakeBuildTypeRepository._types[key]);
	})
};


module.exports = fakeBuildTypeRepository;
