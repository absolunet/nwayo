'use strict';

const functionsFactory = require('./functions');


const factory = (...parameters) => {
	return {
		functions: functionsFactory(...parameters)
	};
};


module.exports = factory;
