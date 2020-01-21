//--------------------------------------------------------
//-- Node IoC - Test - Unit - Console - Commands - Build Command Test Case
//--------------------------------------------------------
'use strict';

const { NotImplementedError } = require('@absolunet/ioc');
const TestCase                = require('../../../../TestCase');
const BuildTypeRepository     = require('../../../../../dist/node/repositories/BuildTypeRepository');
const fakeNwayo               = require('./stubs/fakeNwayo');
const fakeTerminal            = require('./stubs/fakeTerminal');


class BuildCommandTestCase extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenFakeNwayo();
		this.givenBuildTypeRepository();
		this.givenFakeBuildTypes();
		this.givenCommandRunner();
		this.givenEmptyArgv();
		this.givenFakeTerminal();
		this.givenCommand();
	}

	testHasProperName() {
		this.whenGettingName();
		this.thenResultShouldBe(this.getExpectedName());
	}

	testHasProperDescription() {
		this.whenGettingDescription();
		this.thenResultShouldBe(this.getExpectedDescription());
	}

	testHasProperPolicies() {
		this.whenGettingPolicies();
		this.thenResultShouldEqual(this.getExpectedPolicies());
	}

	async testCanBuildForAllBundlesByDefault() {
		await this.whenRunningCommand();
		this.thenNwayoShouldHaveBuilt(this.getBuildType(), null, ...this.getExpectedNwayoBuildExtraArguments());
	}

	async testCanBuildForSpecificBundleIfProvided() {
		this.givenBundleOption('foo');
		await this.whenRunningCommand();
		this.thenNwayoShouldHaveBuilt(this.getBuildType(), ['foo'], ...this.getExpectedNwayoBuildExtraArguments());
	}

	async testCanBuildForMultipleBundlesIfProvided() {
		this.givenBundleOption('foo,bar');
		await this.whenRunningCommand();
		this.thenNwayoShouldHaveBuilt(this.getBuildType(), ['foo', 'bar'], ...this.getExpectedNwayoBuildExtraArguments());
	}


	//-- Given
	//--------------------------------------------------------

	givenFakeNwayo() {
		this.app.singleton('nwayo', fakeNwayo);
	}

	givenBuildTypeRepository() {
		this.app.singleton('nwayo.build.type', BuildTypeRepository);
	}

	givenFakeBuildTypes() {
		Object.entries(this.getBuildTypes()).forEach(([key, value]) => {
			this.make('nwayo.build.type').add(key, value);
		});
	}

	givenEmptyArgv() {
		this.argv = {};
	}

	givenCommandRunner() {
		this.commandRunner = this.make('command.runner');
	}

	givenFakeTerminal() {
		this.app.singleton('terminal', fakeTerminal);
	}

	givenCommand() {
		this.command = this.make(this.getCommandClass(), {
			app:      this.app,
			terminal: this.app.make('terminal')
		});
	}

	givenBundleOption(name) {
		this.argv.bundle = name;
	}


	//-- When
	//--------------------------------------------------------

	async whenRunningCommand() {
		await this.attemptAsync(async () => {
			await this.commandRunner.unsafeRun(this.command, this.argv);
		});
	}

	whenGettingName() {
		this.attempt(() => {
			this.setResult(this.command.name);
		});
	}

	whenGettingDescription() {
		this.attempt(() => {
			this.setResult(this.command.description);
		});
	}

	whenGettingPolicies() {
		this.attempt(() => {
			this.setResult(this.command.policies);
		});
	}


	//-- Then
	//--------------------------------------------------------

	thenNwayoShouldHaveBuilt(...parameters) {
		this.thenShouldNotHaveThrown();
		this.expect(fakeNwayo.build).toHaveBeenCalledTimes(1);
		this.expect(fakeNwayo.build).toHaveBeenCalledWith(...parameters);
		this.expect(fakeNwayo._buildAsyncSpy).toHaveBeenCalledTimes(1);
	}


	//-- Helpers
	//--------------------------------------------------------

	/**
	 * @returns {ioc.console.Command}
	 * @abstract
	 */
	getCommandClass() {
		throw new NotImplementedError(this, 'getCommandClass', 'Command');
	}

	/**
	 * @returns {string}
	 * @abstract
	 */
	getType() {
		throw new NotImplementedError(this, 'type', 'string');
	}

	/**
	 * @returns {Array<*>}
	 * @abstract
	 */
	getExpectedNwayoBuildExtraArguments() {
		throw new NotImplementedError(this, 'getExpectedNwayoExtraArguments', 'Array<any>');
	}

	getExpectedName() {
		return `build:${this.getType()}`;
	}

	getExpectedDescription() {
		return `Build ${this.getType()}.`;
	}

	getExpectedPolicies() {
		return [`nwayo.build:${this.getType()}`];
	}

	getBuildType() {
		return this.getType();
	}

	getBuildTypes() {
		return {
			SCRIPTS: 'scripts',
			STYLES:  'styles',
			ASSETS:  'assets'
		};
	}

}


module.exports = BuildCommandTestCase;
