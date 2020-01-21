//--------------------------------------------------------
//-- Tests - Unit - Services - Builder - Drivers - Stubs - Mocked Laravel Mix Webpack Config
//--------------------------------------------------------
'use strict';


class LaravelMixWebpackConfig {

	constructor(...parameters) {
		LaravelMixWebpackConfig._spies._constructor(...parameters);
		LaravelMixWebpackConfig._instances.push(this);
	}

}

LaravelMixWebpackConfig._instances = [];

LaravelMixWebpackConfig._spies = {
	_constructor: jest.fn()
};


module.exports = LaravelMixWebpackConfig;
