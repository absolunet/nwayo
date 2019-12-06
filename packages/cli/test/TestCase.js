//--------------------------------------------------------
//-- Nwayo - Test - Test Case
//--------------------------------------------------------
'use strict';

const { TestCase: BaseTestCase } = require('@absolunet/ioc');


class TestCase extends BaseTestCase {

	beforeEach() {
		super.beforeEach();
		this.setException(null);
	}

	attempt(closure) {
		try {
			closure();
		} catch (error) {
			this.setException(error);
		}
	}

	async attemptAsync(closure) {
		try {
			await closure();
		} catch (error) {
			this.setException(error);
		}
	}

	setException(exception) {
		this.exception = exception;
	}

	thenShouldNotHaveThrown() {
		this.expect(this.exception).toBeFalsy();
	}

	thenShouldHaveThrown() {
		this.expect(this.exception).toBeTruthy();
	}

}


module.exports = TestCase;
