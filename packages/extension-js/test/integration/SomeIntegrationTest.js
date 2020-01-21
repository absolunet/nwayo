//--------------------------------------------------------
//-- Nwayo Extension - JS - Test - Integration - Some Integration
//--------------------------------------------------------
'use strict';

const TestCase = require('../TestCase');


class SomeIntegrationTest extends TestCase {

	testSomething() {
		this.expect(true).toBe(true);
	}

}


module.exports = SomeIntegrationTest;
