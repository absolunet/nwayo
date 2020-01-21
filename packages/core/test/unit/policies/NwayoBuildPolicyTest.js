//--------------------------------------------------------
//-- Node IoC - Test - Unit - Nwayo Build Policy
//--------------------------------------------------------
'use strict';

const TestCase                = require('../../TestCase');
const Nwayo                   = require('../../../dist/node/services/Nwayo');
const NwayoBuildPolicy        = require('../../../dist/node/policies/NwayoBuildPolicy');
const fakeBuildTypeRepository = require('./stubs/fakeBuildTypeRepository');
const fakeBuilder             = require('./stubs/fakeBuilder');
const fakeProjectService      = require('./stubs/fakeProjectService');


class NwayoBuildPolicyTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenNwayo();
		this.givenFakeBuildTypeRepository();
		this.givenFakeBuilder();
		this.givenFakeProjectService();
		this.givenNwayoBuildPolicy();
		this.givenEmptyTypes();
	}

	testFailsIfGivenTypeHasNoHook() {
		this.givenType('scripts');
		this.whenCheckingIfPolicyPasses();
		this.thenResultShouldBe(false);
	}

	testPassesIfGivenTypeHasPreProcessHookOnly() {
		this.givenHook('scripts', 'preprocess');
		this.givenType('scripts');
		this.whenCheckingIfPolicyPasses();
		this.thenResultShouldBe(true);
	}

	testPassesIfGivenTypeHasProcessHookOnly() {
		this.givenHook('scripts', 'process');
		this.givenType('scripts');
		this.whenCheckingIfPolicyPasses();
		this.thenResultShouldBe(true);
	}

	testPassesIfGivenTypeHasPostProcessHookOnly() {
		this.givenHook('scripts', 'postprocess');
		this.givenType('scripts');
		this.whenCheckingIfPolicyPasses();
		this.thenResultShouldBe(true);
	}

	testFailsIfGivenTypeHasBundleLoadedHookOnly() {
		this.givenHook('scripts', 'bundlesLoaded');
		this.givenType('scripts');
		this.whenCheckingIfPolicyPasses();
		this.thenResultShouldBe(false);
	}

	testFailsIfGivenTypeHasBundlesLoadedHookOnly() {
		this.givenHook('scripts', 'bundlesLoaded');
		this.givenType('scripts');
		this.whenCheckingIfPolicyPasses();
		this.thenResultShouldBe(false);
	}

	testFailsIfGivenTypeHasBuilderCreatedHookOnly() {
		this.givenHook('scripts', 'builderCreated');
		this.givenType('scripts');
		this.whenCheckingIfPolicyPasses();
		this.thenResultShouldBe(false);
	}

	testFailsIfGivenTypeHasConfigGeneratedHookOnly() {
		this.givenHook('scripts', 'configGenerated');
		this.givenType('scripts');
		this.whenCheckingIfPolicyPasses();
		this.thenResultShouldBe(false);
	}

	testFailsIfGivenTypeHasBeforeBuildHookOnly() {
		this.givenHook('scripts', 'beforeBuild');
		this.givenType('scripts');
		this.whenCheckingIfPolicyPasses();
		this.thenResultShouldBe(false);
	}

	testFailsIfGivenTypeHasAfterBuildHookOnly() {
		this.givenHook('scripts', 'afterBuild');
		this.givenType('scripts');
		this.whenCheckingIfPolicyPasses();
		this.thenResultShouldBe(false);
	}

	testPassesIfGivenTypeHasPreProcessAndOtherHook() {
		this.givenHook('scripts', 'preprocess');
		this.givenHook('scripts', 'other');
		this.givenType('scripts');
		this.whenCheckingIfPolicyPasses();
		this.thenResultShouldBe(true);
	}

	testPassesIfGivenTypeHasProcessAndOtherHook() {
		this.givenHook('scripts', 'process');
		this.givenHook('scripts', 'other');
		this.givenType('scripts');
		this.whenCheckingIfPolicyPasses();
		this.thenResultShouldBe(true);
	}

	testPassesIfGivenTypeHasPostProcessAndOtherHook() {
		this.givenHook('scripts', 'postprocess');
		this.givenHook('scripts', 'other');
		this.givenType('scripts');
		this.whenCheckingIfPolicyPasses();
		this.thenResultShouldBe(true);
	}

	testPassesIfGivenTypesHavePreProcessHookOnly() {
		this.givenHook('scripts', 'preprocess');
		this.givenHook('styles',  'preprocess');
		this.givenTypes('scripts', 'styles');
		this.whenCheckingIfPolicyPasses();
		this.thenResultShouldBe(true);
	}

	testPassesIfGivenTypesHaveProcessHookOnly() {
		this.givenHook('scripts', 'process');
		this.givenHook('styles',  'process');
		this.givenTypes('scripts', 'styles');
		this.whenCheckingIfPolicyPasses();
		this.thenResultShouldBe(true);
	}

	testPassesIfGivenTypesHavePostProcessHookOnly() {
		this.givenHook('scripts', 'postprocess');
		this.givenHook('styles',  'postprocess');
		this.givenTypes('scripts', 'styles');
		this.whenCheckingIfPolicyPasses();
		this.thenResultShouldBe(true);
	}

	testPassesIfOneTypeHasPreProcessHookOnlyAndOtherHasProcessHookOnly() {
		this.givenHook('scripts', 'preprocess');
		this.givenHook('styles',  'process');
		this.givenTypes('scripts', 'styles');
		this.whenCheckingIfPolicyPasses();
		this.thenResultShouldBe(true);
	}

	testPassesIfOneTypeHasPreProcessHookOnlyAndOtherHasPostProcessHookOnly() {
		this.givenHook('scripts', 'preprocess');
		this.givenHook('styles',  'postprocess');
		this.givenTypes('scripts', 'styles');
		this.whenCheckingIfPolicyPasses();
		this.thenResultShouldBe(true);
	}

	testPassesIfOneTypeHasProcessHookOnlyAndOtherHasPostProcessHookOnly() {
		this.givenHook('scripts', 'process');
		this.givenHook('styles',  'postprocess');
		this.givenTypes('scripts', 'styles');
		this.whenCheckingIfPolicyPasses();
		this.thenResultShouldBe(true);
	}

	testFailsIfOneOfGivenTypesHasOtherHookOnly() {
		this.givenHook('scripts', 'preprocess');
		this.givenHook('styles',  'other');
		this.givenTypes('scripts', 'styles');
		this.whenCheckingIfPolicyPasses();
		this.thenResultShouldBe(false);
	}


	//-- Given
	//--------------------------------------------------------

	givenNwayo() {
		this.app.singleton('nwayo', Nwayo);
	}

	givenFakeBuildTypeRepository() {
		this.app.singleton('nwayo.build.type', fakeBuildTypeRepository);
	}

	givenFakeBuilder() {
		this.app.singleton('nwayo.builder', fakeBuilder);
	}

	givenFakeProjectService() {
		this.app.singleton('nwayo.project', fakeProjectService);
	}

	givenNwayoBuildPolicy() {
		this.policy = this.make(NwayoBuildPolicy);
		this.make('gate').policy(this.policy.name, this.policy.passes.bind(this.policy));
	}

	givenType(type) {
		this.givenTypes(type);
	}

	givenTypes(...types) {
		this.types = types;
	}

	givenEmptyTypes() {
		this.types = [];
	}

	givenHook(type, phase) {
		this.make('nwayo').registerHook(type, phase, jest.fn());
	}


	//-- When
	//--------------------------------------------------------

	whenCheckingIfPolicyPasses() {
		this.attempt(() => {
			this.setResult(this.make('gate').can(`${this.policy.name}:${this.types.join(',')}`));
		});
	}

}


module.exports = NwayoBuildPolicyTest;
