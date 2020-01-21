//--------------------------------------------------------
//-- Nwayo Core - Test - Feature - Some Feature
//--------------------------------------------------------
'use strict';

const TestCase = require('../TestCase');


class SomeFeatureTest extends TestCase {

	testSomething() {
		this.expect(true).toBe(true);
	}

}


module.exports = SomeFeatureTest;
