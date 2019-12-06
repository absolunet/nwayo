'use strict';


const fakeProjectService = {
	getRootPath: jest.fn(() => {
		return fakeProjectService.__projectRootPath;
	}),
	__projectRootPath: ''
};


module.exports = fakeProjectService;
