'use strict';


const fakeDependencyManagerDriver = {
	install: jest.fn(() => {
		return new Promise(setTimeout);
	})
};


module.exports = fakeDependencyManagerDriver;
