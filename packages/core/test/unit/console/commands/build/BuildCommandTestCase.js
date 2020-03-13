//--------------------------------------------------------
//-- Node IoC - Test - Unit - Console - Commands - Build Command Test Case
//--------------------------------------------------------
'use strict';

const { NotImplementedError } = require('@absolunet/ioc');
const TestCase                = require('../../../../TestCase');
const BuildTypeRepository     = require('../../../../../dist/node/repositories/BuildTypeRepository');
const fakeBuilder             = require('./stubs/fakeBuilder');
const fakeDateHelperFactory   = require('./stubs/fakeDateHelperFactory');
const fakeNwayo               = require('./stubs/fakeNwayo');
const fakeTerminal            = require('./stubs/fakeTerminal');
const fakeGauge               = require('./stubs/fakeGauge');
const fakeTranslator          = require('./stubs/fakeTranslator');


class BuildCommandTestCase extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenFakeDateHelper();
		this.givenFakeNwayo();
		this.givenFakeBuilder();
		this.givenBuildTypeRepository();
		this.givenFakeBuildTypes();
		this.givenCommandRunner();
		this.givenEmptyArgv();
		this.givenFakeTerminal();
		this.givenFakeTranslator();
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
		this.thenShouldHavePrintedOnHooks();
	}

	async testCanBuildForSpecificBundleIfProvided() {
		this.givenBundleOption('foo');
		await this.whenRunningCommand();
		this.thenNwayoShouldHaveBuilt(this.getBuildType(), ['foo'], ...this.getExpectedNwayoBuildExtraArguments());
		this.thenShouldHavePrintedOnHooks();
	}

	async testCanBuildForMultipleBundlesIfProvided() {
		this.givenBundleOption('foo,bar');
		await this.whenRunningCommand();
		this.thenNwayoShouldHaveBuilt(this.getBuildType(), ['foo', 'bar'], ...this.getExpectedNwayoBuildExtraArguments());
		this.thenShouldHavePrintedOnHooks();
	}


	//-- Given
	//--------------------------------------------------------

	givenFakeDateHelper() {
		this.app.singleton('helper.date', fakeDateHelperFactory(this.app));
	}

	givenFakeNwayo() {
		this.app.singleton('nwayo', fakeNwayo);
	}

	givenFakeBuilder() {
		this.app.singleton('nwayo.builder', fakeBuilder);
		fakeBuilder._hooks = {};
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

	givenFakeTranslator() {
		this.app.singleton('translator', fakeTranslator);
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

	thenShouldHavePrintedOnHooks() {
		this.expect(fakeTerminal.echo).toHaveBeenCalledTimes(4);
		this.expect(fakeTerminal.startProgress).toHaveBeenCalledTimes(1);
		this.expect(fakeGauge.show).toHaveBeenCalledTimes(5);
		this.expect(fakeGauge.show).toHaveBeenNthCalledWith(1, '', 0);
		this.expect(fakeGauge.show).toHaveBeenNthCalledWith(2, '25%', 0.25);
		this.expect(fakeGauge.show).toHaveBeenNthCalledWith(3, '50%', 0.5);
		this.expect(fakeGauge.show).toHaveBeenNthCalledWith(4, '75%', 0.75);
		this.expect(fakeGauge.show).toHaveBeenNthCalledWith(5, '100%', 1);
		this.expect(fakeGauge.pulse).toHaveBeenCalledTimes(4); // 200ms / 50ms
		this.expect(fakeGauge.disable).toHaveBeenCalledTimes(1);
		const [showOrder]    = [...fakeGauge.show.mock.invocationCallOrder].reverse();
		const [pulseOrder]   = [...fakeGauge.pulse.mock.invocationCallOrder].reverse();
		const [disableOrder] = fakeGauge.disable.mock.invocationCallOrder;
		this.expect(disableOrder).toBeGreaterThan(showOrder);
		this.expect(disableOrder).toBeGreaterThan(pulseOrder);
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
		return `Translated: commands.build-${this.getType()}.description`;
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
