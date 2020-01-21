//--------------------------------------------------------
//-- Nwayo Extension - SCSS - Test - Unit - Some Unit
//--------------------------------------------------------
'use strict';

const TestCase = require('../TestCase');


class SomeUnitTest extends TestCase {

	testSomething() {
		this.expect(true).toBe(true);
	}

}


module.exports = SomeUnitTest;
