//--------------------------------------------------------
//-- Tests - Unit - Services - Builder - Drivers - Stubs - Mocked Laravel Mix
//--------------------------------------------------------
'use strict';


class LaravelMix {

	constructor(...parameters) {
		LaravelMix._spies._constructor(...parameters);
		LaravelMix._instances.push(this);
	}

}

LaravelMix._instances = [];

LaravelMix._spies = {
	_constructor: jest.fn()
};


module.exports = LaravelMix;
