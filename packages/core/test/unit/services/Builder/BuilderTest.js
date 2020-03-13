//--------------------------------------------------------
//-- Node IoC - Test - Unit - Services - Builder
//--------------------------------------------------------
'use strict';

const TestCase           = require('../../../TestCase');
const Builder            = require('../../../../dist/node/services/Builder');
const Driver             = require('../../../../dist/node/services/Builder/drivers/Driver');
const fakeDriver         = require('./stubs/fakeDriver');
const fakeProjectService = require('./stubs/fakeProjectService');


class BuilderTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenFakeProjectService();
		this.givenBuilder();
	}

	testHasLaravelMixDriver() {
		this.whenCheckingIfHasDriver('laravel-mix');
		this.thenResultShouldBe(true);
	}

	testHasValidDefaultDriver() {
		this.whenGettingDefaultDriver();
		this.thenResultShouldBeInstanceOf(Driver);
	}

	testCanUseDriverDirectly() {
		this.givenFakeDriverAsDefault();
		this.givenFakeDefaultDriverInConfig();
		this.whenCallingDriverMethodOnBuilder();
		this.thenDriverMethodShouldHaveBeenCalled();
	}

	testCanMakeNewBuilderInstanceFromInstance() {
		this.whenMakingBuilder();
		this.thenShouldHaveReceivedNewBuilder();
		this.thenResultShouldNotHaveFakeDriver();
	}

	givenFakeDefaultDriverInConfig() {
		this.make('config').set('nwayo.core.driver', 'fake');
	}

	givenFakeDriver() {
		this.builder.addDriver('fake', fakeDriver);
	}

	givenFakeDriverAsDefault() {
		this.givenFakeDriver();
		this.builder.setDefaultDriver('fake');
	}

	givenFakeProjectService() {
		this.app.singleton('nwayo.project', fakeProjectService);
	}

	givenBuilder() {
		this.builder = this.make(Builder);
	}

	whenCheckingIfHasDriver(name) {
		this.attempt(() => {
			this.setResult(this.builder.hasDriver(name));
		});
	}

	whenGettingDefaultDriver() {
		this.attempt(() => {
			this.setResult(this.builder.driver());
		});
	}

	whenCallingDriverMethodOnBuilder() {
		this.attempt(() => {
			this.setResult(this.builder.buildConfig());
		});
	}

	whenMakingBuilder() {
		this.attempt(() => {
			this.setResult(this.builder.make({ bundle: {} }));
		});
	}

	thenDriverMethodShouldHaveBeenCalled() {
		this.thenShouldNotHaveThrown();
		this.expect(fakeDriver.buildConfig).toHaveBeenCalledTimes(1);
		this.thenResultShouldBe(fakeDriver.buildConfig.mock.results[0].value);
	}

	thenShouldHaveReceivedNewBuilder() {
		this.thenResultShouldBeInstanceOf(Builder);
		this.expect(this.result).not.toBe(this.builder);
		this.expect(this.result).toHaveProperty('bundle', {});
	}

	thenResultShouldNotHaveFakeDriver() {
		this.thenShouldNotHaveThrown();
		this.expect(this.result.hasDriver('fake')).toBe(false);
	}

}


module.exports = BuilderTest;
