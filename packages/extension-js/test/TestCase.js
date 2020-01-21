//--------------------------------------------------------
//-- Nwayo Extension - JS - Test - Test Case
//--------------------------------------------------------
'use strict';

const { TestCase: BaseTestCase } = require('@absolunet/ioc');


class TestCase extends BaseTestCase {

	beforeEach() {
		super.beforeEach();
		jest.clearAllMocks();
		this.setException(undefined);
		this.setResult(undefined);
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

	setResult(result) {
		this.result = result;
	}

	thenResultShouldBe(expected) {
		this.thenShouldNotHaveThrown();
		this.expect(this.result).toBe(expected);
	}

	thenResultShouldEqual(expected) {
		this.thenShouldNotHaveThrown();
		this.expect(this.result).toStrictEqual(expected);
	}

	thenResultShouldBeInstanceOf(expected) {
		this.thenShouldNotHaveThrown();
		this.expect(this.result).toBeInstanceOf(expected);
	}

	thenResultShouldHaveProperty(property, value) {
		this.thenShouldNotHaveThrown();
		this.expect(this.result).toHaveProperty(property, value);
	}

	thenShouldNotHaveThrown() {
		this.expect(this.exception).toBeFalsy();
	}

	thenShouldHaveThrown() {
		this.expect(this.exception).toBeTruthy();
	}

}


module.exports = TestCase;
