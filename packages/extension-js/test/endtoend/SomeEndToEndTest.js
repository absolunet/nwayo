//--------------------------------------------------------
//-- Nwayo Extension - JS - Test - End to end - Some End To End
//--------------------------------------------------------
'use strict';

const TestCase = require('../TestCase');


class SomeEndToEndTest extends TestCase {

	testSomething() {
		this.expect(true).toBe(true);
	}

}


module.exports = SomeEndToEndTest;
