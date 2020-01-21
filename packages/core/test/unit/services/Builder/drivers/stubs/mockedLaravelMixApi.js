//--------------------------------------------------------
//-- Tests - Unit - Services - Builder - Drivers - Stubs - Mocked Laravel Mix API
//--------------------------------------------------------
'use strict';


class LaravelMixApi {

	constructor(...parameters) {
		LaravelMixApi._spies._constructor(...parameters);
		LaravelMixApi._instances.push(this);
		['js', 'ts', 'react', 'sass', 'less', 'stylus', 'copy', 'copyDirectory'].forEach((method) => {
			this[method] = (...p) => {
				LaravelMixApi._spies[`_${method}`](...p);

				return this;
			};
		});
	}

}

LaravelMixApi._instances = [];

LaravelMixApi._spies = {
	_constructor: jest.fn(),
	_js: jest.fn(),
	_ts: jest.fn(),
	_react: jest.fn(),
	_sass: jest.fn(),
	_less: jest.fn(),
	_stylus: jest.fn(),
	_copy: jest.fn(),
	_copyDirectory: jest.fn()
};


module.exports = LaravelMixApi;
