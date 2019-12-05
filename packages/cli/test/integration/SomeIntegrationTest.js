//--------------------------------------------------------
//-- Nwayo - Test - Integration - SomeIntegrationTest
//--------------------------------------------------------
'use strict';

const TestCase = require('../TestCase');


class SomeIntegrationTest extends TestCase {

	testSomething() {
		this.expect(true).toBe(true);
	}

}


module.exports = SomeIntegrationTest;
