//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Services - Builder - Drivers - Stubs - Mocked Laravel Mix Manifest
//--------------------------------------------------------
'use strict';


class LaravelMixManifest {

	constructor(...parameters) {
		LaravelMixManifest._spies._constructor(...parameters);
		LaravelMixManifest._instances.push(this);
	}

}

LaravelMixManifest._instances = [];

LaravelMixManifest._spies = {
	_constructor: jest.fn()
};


module.exports = LaravelMixManifest;
