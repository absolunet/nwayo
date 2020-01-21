//--------------------------------------------------------
//-- Tests - Unit - Fake Build Type Repository
//--------------------------------------------------------
'use strict';


const fakeBuildTypeRepository = {
	add: jest.fn(() => {
		return fakeBuildTypeRepository;
	})
};


module.exports = fakeBuildTypeRepository;
