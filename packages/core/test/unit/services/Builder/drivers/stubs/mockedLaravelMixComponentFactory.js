//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Services - Builder - Drivers - Stubs - Mocked Laravel Mix Component Factory
//--------------------------------------------------------
'use strict';


class LaravelMixComponentFactory {

	constructor(...parameters) {
		LaravelMixComponentFactory._spies._constructor(...parameters);
		LaravelMixComponentFactory._instances.push(this);
	}

	installAll(...parameters) {
		LaravelMixComponentFactory._spies._installAll(...parameters);
	}

}

LaravelMixComponentFactory._instances = [];

LaravelMixComponentFactory._spies = {
	_constructor: jest.fn(),
	_installAll: jest.fn()
};


module.exports = LaravelMixComponentFactory;
