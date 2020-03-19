//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Services - Nwayo
//--------------------------------------------------------
'use strict';

const __                      = require('@absolunet/private-registry');
const TestCase                = require('../../TestCase');
const fakeBuilder             = require('./stubs/fakeBuilder');
const fakeBuildTypeRepository = require('./stubs/fakeBuildTypeRepository');
const fakeProjectService      = require('./stubs/fakeProjectService');
const Nwayo                   = require('../../../dist/node/services/Nwayo');


class NwayoTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenFakeBuildTypeRepository();
		this.givenFakeBuilder();
		this.givenFakeProjectService();
		this.givenBuildTypes({ SCRIPTS: 'scripts', STYLES: 'styles', ASSETS: 'assets' });
		this.givenNwayo();
		this.givenEmptyFunctionalHook();
		this.givenEmptyRegisteredHook();
		this.givenEmptyHandler();
		this.givenEmptyRegisteredHandler();
		this.givenEmptyBundles();
		this.givenBuildArguments();
	}

	testCanRegisterProcessHook() {
		this.givenFunctionalHook();
		this.whenCallingOnFor('scripts');
		this.thenShouldHaveRegisteredFunctionalHook('scripts', 'process');
	}

	testCanRegisterPreprocessHook() {
		this.givenFunctionalHook();
		this.whenCallingBeforeFor('scripts');
		this.thenShouldHaveRegisteredFunctionalHook('scripts', 'preprocess');
	}

	testCanRegisterPostProcessHook() {
		this.givenFunctionalHook();
		this.whenCallingAfterFor('scripts');
		this.thenShouldHaveRegisteredFunctionalHook('scripts', 'postprocess');
	}

	testCanRegisterNamedHook() {
		this.givenFunctionalHook();
		this.whenRegisteringHookFor('scripts', 'foo');
		this.thenShouldHaveRegisteredFunctionalHook('scripts', 'foo');
	}

	testCanRegisterHandler() {
		this.givenHandler(['scripts', 'styles'], ['preprocess', 'process', 'postprocess']);
		this.whenRegisteringHandler();
		this.thenShouldHaveRegisteredHandlerHook('scripts', 'preprocess');
		this.thenShouldHaveRegisteredHandlerHook('scripts', 'process');
		this.thenShouldHaveRegisteredHandlerHook('scripts', 'postprocess');
		this.thenShouldHaveRegisteredHandlerHook('styles',  'preprocess');
		this.thenShouldHaveRegisteredHandlerHook('styles',  'process');
		this.thenShouldHaveRegisteredHandlerHook('styles',  'postprocess');
	}

	testCanRegisterProcessHookBeforeAnotherHook() {
		this.givenRegisteredProcessHookFor('scripts');
		this.givenFunctionalHook();
		this.whenCallingOnWithNegativeWeightFor('scripts');
		this.thenShouldHaveRegisteredFunctionalHookAtBeginning('scripts', 'process');
	}

	testCanRegisterPreProcessHookBeforeAnotherHook() {
		this.givenRegisteredPreProcessHookFor('scripts');
		this.givenFunctionalHook();
		this.whenCallingBeforeWithNegativeWeightFor('scripts');
		this.thenShouldHaveRegisteredFunctionalHookAtBeginning('scripts', 'preprocess');
	}

	testCanRegisterPostProcessHookBeforeAnotherHook() {
		this.givenRegisteredPostProcessHookFor('scripts');
		this.givenFunctionalHook();
		this.whenCallingAfterWithNegativeWeightFor('scripts');
		this.thenShouldHaveRegisteredFunctionalHookAtBeginning('scripts', 'postprocess');
	}

	testCanRegisterNamedHookBeforeAnotherHook() {
		this.givenRegisteredHookFor('scripts', 'foo');
		this.givenFunctionalHook();
		this.whenRegisteringHookWithNegativeWeightFor('scripts', 'foo');
		this.thenShouldHaveRegisteredFunctionalHookAtBeginning('scripts', 'foo');
	}

	testCanRegisterHandlerBeforeAnotherHandler() {
		this.givenRegisteredHandler(['scripts'], ['process']);
		this.givenHandlerWithNegativeWeights(['scripts'], ['process']);
		this.whenRegisteringHandler();
		this.thenShouldHaveRegisteredHandlerHookAtBeginning('scripts', 'process');
	}

	testCanRegisterHandlerHookBeforeAnotherHook() {
		this.givenRegisteredProcessHookFor('scripts');
		this.givenHandlerWithNegativeWeights(['scripts'], ['process']);
		this.whenRegisteringHandler();
		this.thenShouldHaveRegisteredHandlerHookAtBeginning('scripts', 'process');
	}

	testCanGetHooksForGivenBuildType() {
		this.givenRegisteredProcessHookFor('scripts');
		this.whenGettingHooksForType('scripts');
		this.thenShouldHaveReceivedOneProcessHook();
	}

	testCanGetHooksForGivenBuildTypeAndPhase() {
		this.givenRegisteredProcessHookFor('scripts');
		this.whenGettingHooksForTypeAndPhase('scripts', 'process');
		this.thenShouldHaveReceivedOneHook();
	}

	testCanCheckIfHookExistsForGivenBuildType() {
		this.givenRegisteredProcessHookFor('scripts');
		this.whenCheckingIfHookExistsForType('scripts');
		this.thenResultShouldBe(true);
	}

	testCanCheckIfHookDoesNotExistForGivenBuildType() {
		this.whenCheckingIfHookExistsForType('scripts');
		this.thenResultShouldBe(false);
	}

	testCanCheckIfHookExistsForGivenBuildTypeAndPhase() {
		this.givenRegisteredProcessHookFor('scripts');
		this.whenCheckingIfHookExistsForTypeAndPhase('scripts', 'process');
		this.thenResultShouldBe(true);
	}

	testCanCheckIfHookDoesNotExistForGivenBuildTypeAndPhase() {
		this.givenRegisteredPreProcessHookFor('scripts');
		this.whenCheckingIfHookExistsForTypeAndPhase('scripts', 'process');
		this.thenResultShouldBe(false);
	}

	testCanGetAllExistingPhases() {
		this.whenGettingPhases();
		this.thenShouldHaveReceivedAllPhases();
	}

	async testCanBuildAllForAllBundles() {
		const { bundles, types } = this.getTypesAndBundles();
		const bundlesAndTypesCalls = [
			{ bundle: bundles[0], type: types[0] },
			{ bundle: bundles[0], type: types[1] },
			{ bundle: bundles[0], type: types[2] },
			{ bundle: bundles[1], type: types[0] },
			{ bundle: bundles[1], type: types[1] },
			{ bundle: bundles[1], type: types[2] },
			{ bundle: bundles[2], type: types[0] },
			{ bundle: bundles[2], type: types[1] },
			{ bundle: bundles[2], type: types[2] }
		];
		const typesCalls = [
			{ type: types[0] },
			{ type: types[1] },
			{ type: types[2] }
		];
		this.givenRegisteredHandlerWithAllHooks(types);

		bundles.forEach((bundle) => {
			this.givenBundle(bundle);
		});

		this.givenBuildArguments();

		await this.whenBuilding();

		this.thenShouldHaveCalledAllHooks(bundlesAndTypesCalls, typesCalls);
	}

	async testCanBuildAllForSpecificBundle() {
		const { bundles, types } = this.getTypesAndBundles();
		const bundlesAndTypesCalls = [
			{ bundle: bundles[0], type: types[0] },
			{ bundle: bundles[0], type: types[1] },
			{ bundle: bundles[0], type: types[2] }
		];
		const typesCalls = [
			{ type: types[0] },
			{ type: types[1] },
			{ type: types[2] }
		];
		this.givenRegisteredHandlerWithAllHooks(types);

		bundles.forEach((bundle) => {
			this.givenBundle(bundle);
		});

		this.givenBuildArguments(undefined, bundles[0]);
		await this.whenBuilding();

		this.thenShouldHaveCalledAllHooks(bundlesAndTypesCalls, typesCalls);
	}

	async testCanBuildAllForMultipleBundles() {
		const { bundles, types } = this.getTypesAndBundles();
		const bundlesAndTypesCalls = [
			{ bundle: bundles[0], type: types[0] },
			{ bundle: bundles[0], type: types[1] },
			{ bundle: bundles[0], type: types[2] },
			{ bundle: bundles[1], type: types[0] },
			{ bundle: bundles[1], type: types[1] },
			{ bundle: bundles[1], type: types[2] }
		];
		const typesCalls = [
			{ type: types[0] },
			{ type: types[1] },
			{ type: types[2] }
		];
		this.givenRegisteredHandlerWithAllHooks(types);

		bundles.forEach((bundle) => {
			this.givenBundle(bundle);
		});

		this.givenBuildArguments(undefined, bundles.slice(0, 2));
		await this.whenBuilding();

		this.thenShouldHaveCalledAllHooks(bundlesAndTypesCalls, typesCalls);
	}

	async testCanBuildSingleTypeForAllBundles() {
		const { bundles, types } = this.getTypesAndBundles();
		const bundlesAndTypesCalls = [
			{ bundle: bundles[0], type: types[0] },
			{ bundle: bundles[1], type: types[0] },
			{ bundle: bundles[2], type: types[0] }
		];
		const typesCalls = [
			{ type: types[0] }
		];
		this.givenRegisteredHandlerWithAllHooks(types);

		bundles.forEach((bundle) => {
			this.givenBundle(bundle);
		});

		this.givenBuildArguments(types[0]);
		await this.whenBuilding();

		this.thenShouldHaveCalledAllHooks(bundlesAndTypesCalls, typesCalls);
	}

	async testCanBuildSingleTypeForSpecificBundle() {
		const { bundles, types } = this.getTypesAndBundles();
		const bundlesAndTypesCalls = [
			{ bundle: bundles[0], type: types[0] }
		];
		const typesCalls = [
			{ type: types[0] }
		];
		this.givenRegisteredHandlerWithAllHooks(types);

		bundles.forEach((bundle) => {
			this.givenBundle(bundle);
		});

		this.givenBuildArguments(types[0], bundles[0]);
		await this.whenBuilding();

		this.thenShouldHaveCalledAllHooks(bundlesAndTypesCalls, typesCalls);
	}

	async testCanBuildSingleTypeForMultipleBundles() {
		const { bundles, types } = this.getTypesAndBundles();
		const bundlesAndTypesCalls = [
			{ bundle: bundles[0], type: types[0] },
			{ bundle: bundles[1], type: types[0] }
		];
		const typesCalls = [
			{ type: types[0] }
		];
		this.givenRegisteredHandlerWithAllHooks(types);

		bundles.forEach((bundle) => {
			this.givenBundle(bundle);
		});

		this.givenBuildArguments(types[0], bundles.slice(0, 2));
		await this.whenBuilding();

		this.thenShouldHaveCalledAllHooks(bundlesAndTypesCalls, typesCalls);
	}

	async testCanBuildMultipleTypesForAllBundles() {
		const { bundles, types } = this.getTypesAndBundles();
		const bundlesAndTypesCalls = [
			{ bundle: bundles[0], type: types[0] },
			{ bundle: bundles[0], type: types[1] },
			{ bundle: bundles[1], type: types[0] },
			{ bundle: bundles[1], type: types[1] },
			{ bundle: bundles[2], type: types[0] },
			{ bundle: bundles[2], type: types[1] }
		];
		const typesCalls = [
			{ type: types[0] },
			{ type: types[1] }
		];
		this.givenRegisteredHandlerWithAllHooks(types);

		bundles.forEach((bundle) => {
			this.givenBundle(bundle);
		});

		this.givenBuildArguments(types.slice(0, 2));
		await this.whenBuilding();

		this.thenShouldHaveCalledAllHooks(bundlesAndTypesCalls, typesCalls);
	}

	async testCanBuildMultipleTypesForSpecificBundle() {
		const { bundles, types } = this.getTypesAndBundles();
		const bundlesAndTypesCalls = [
			{ bundle: bundles[0], type: types[0] },
			{ bundle: bundles[0], type: types[1] }
		];
		const typesCalls = [
			{ type: types[0] },
			{ type: types[1] }
		];
		this.givenRegisteredHandlerWithAllHooks(types);

		bundles.forEach((bundle) => {
			this.givenBundle(bundle);
		});

		this.givenBuildArguments(types.slice(0, 2), bundles[0]);
		await this.whenBuilding();

		this.thenShouldHaveCalledAllHooks(bundlesAndTypesCalls, typesCalls);
	}

	async testCanBuildMultipleTypesForMultipleBundles() {
		const { bundles, types } = this.getTypesAndBundles();
		const bundlesAndTypesCalls = [
			{ bundle: bundles[0], type: types[0] },
			{ bundle: bundles[0], type: types[1] },
			{ bundle: bundles[1], type: types[0] },
			{ bundle: bundles[1], type: types[1] }
		];
		const typesCalls = [
			{ type: types[0] },
			{ type: types[1] }
		];
		this.givenRegisteredHandlerWithAllHooks(types);

		bundles.forEach((bundle) => {
			this.givenBundle(bundle);
		});

		this.givenBuildArguments(types.slice(0, 2), bundles.slice(0, 2));
		await this.whenBuilding();

		this.thenShouldHaveCalledAllHooks(bundlesAndTypesCalls, typesCalls);
	}

	async testCahRegisterSameFunctionalHookInstanceForTwoPhasesWithProperState() {
		this.givenFunctionalHook();
		this.givenBundle('foo');
		this.givenBundle('bar');

		this.whenRegisteringHookFor('scripts', 'preprocess');
		this.whenRegisteringHookFor('styles', 'preprocess');
		this.whenRegisteringHookFor('scripts', 'process');
		this.whenRegisteringHookFor('assets', 'process');
		this.whenRegisteringHookFor('styles', 'postprocess');
		await this.whenBuilding();

		this.thenFunctionalHookShouldHaveBeenCalledWithAppropriateState(
			['scripts', 'styles', 'scripts', 'styles'],
			['scripts', 'assets', 'scripts', 'assets'],
			['styles', 'styles']
		);
	}

	async testCanWatchBuildFromOptionsAsFlagParameter() {
		this.givenBundle('foo');
		this.givenBuildArguments('scripts', 'foo', { watch: true });
		await this.whenBuilding();
		this.thenShouldNotHaveBuild();
		this.thenShouldHaveWatchedWithOptions(undefined);
	}

	async testDoesNotWatchIfFlagParameterIsFalse() {
		this.givenBundle('foo');
		this.givenBuildArguments('scripts', 'foo', { watch: false });
		await this.whenBuilding();
		this.thenShouldHaveBuild();
		this.thenShouldNotHaveWatched();
	}

	async testCanWatchBuildFromOptionsAsObjectParameter() {
		this.givenBundle('foo');
		this.givenBuildArguments('scripts', 'foo', { watch: { key: 'value' } });
		await this.whenBuilding();
		this.thenShouldNotHaveBuild();
		this.thenShouldHaveWatchedWithOptions({ key: 'value' });
	}

	async testCanWatchBuildFromOptionsAsBoolean() {
		this.givenBundle('foo');
		this.givenBuildArguments('scripts', 'foo', true);
		await this.whenBuilding();
		this.thenShouldNotHaveBuild();
		this.thenShouldHaveWatchedWithOptions(undefined);
	}

	async testDoesNotWatchBuildFromOptionsAsBooleanIsFalse() {
		this.givenBundle('foo');
		this.givenBuildArguments('scripts', 'foo', false);
		await this.whenBuilding();
		this.thenShouldHaveBuild();
		this.thenShouldNotHaveWatched();
	}


	//-- Given
	//--------------------------------------------------------

	givenFakeBuildTypeRepository() {
		this.app.singleton('nwayo.build.type', fakeBuildTypeRepository);
	}

	givenFakeBuilder() {
		this.app.singleton('nwayo.builder', fakeBuilder);
		fakeBuilder._afterBuild = [];
	}

	givenFakeProjectService() {
		this.app.singleton('nwayo.project', fakeProjectService);
	}

	givenBuildTypes(types) {
		fakeBuildTypeRepository._types = types;
	}

	givenNwayo() {
		this.nwayo = this.make(Nwayo);
	}

	givenEmptyFunctionalHook() {
		this.functionalHook = undefined;
	}

	givenEmptyRegisteredHook() {
		this.registeredHook = undefined;
	}

	givenEmptyHandler() {
		this.handler = undefined;
	}

	givenEmptyRegisteredHandler() {
		this.registeredHandler = undefined;
	}

	givenFunctionalHook() {
		this.functionalHook = jest.fn();
	}

	givenHandler(types, hooks, parameters = {}) {
		this.handler = {
			types,
			...Object.fromEntries(hooks.map((hook) => {
				const mockedFunction = jest.fn();
				mockedFunction.bind = () => {
					return mockedFunction;
				};

				return [hook, mockedFunction];
			})),
			...parameters
		};
	}

	givenRegisteredProcessHookFor(type) {
		this.givenRegisteredHookFor(type, 'process');
	}

	givenRegisteredPreProcessHookFor(type) {
		this.givenRegisteredHookFor(type, 'preprocess');
	}

	givenRegisteredPostProcessHookFor(type) {
		this.givenRegisteredHookFor(type, 'postprocess');
	}

	givenRegisteredHookFor(type, phase) {
		this.registeredHook = jest.fn();
		this.nwayo.registerHook(type, phase, this.registeredHook);
	}

	givenRegisteredHandler(types, hooks) {
		this.registeredHandler = {
			types,
			...Object.fromEntries(hooks.map((hook) => {
				return [hook, jest.fn()];
			}))
		};
		this.nwayo.register(this.registeredHandler);
	}

	givenHandlerWithNegativeWeights(types, hooks) {
		this.givenHandler(types, hooks, { weight: -1 });
	}

	givenRegisteredHandlerWithAllHooks(types) {
		this.givenRegisteredHandler(types, this.getAllExpectedHooks());
	}

	givenEmptyBundles() {
		fakeProjectService._bundles = {};
	}

	givenBundle(name) {
		fakeProjectService._bundles[name] = {
			config: {
				bundle: {
					name,
					description: name,
					outputPath: '../../../../dist',
					publicPath: '/dist'
				}
			},
			outputPath: '/path/to/dist',
			bundlePath: `/path/to/nwayo/src/bundles/${name}`,
			bundleName: name,
			files: []
		};
	}

	givenBuildArguments(...parameters) {
		this.buildArguments = parameters;
	}


	//-- When
	//--------------------------------------------------------

	whenCallingOnFor(type, ...parameters) {
		this.attempt(() => {
			this.nwayo.on(type, this.functionalHook, ...parameters);
		});
	}

	whenCallingBeforeFor(type, ...parameters) {
		this.attempt(() => {
			this.nwayo.before(type, this.functionalHook, ...parameters);
		});
	}

	whenCallingAfterFor(type, ...parameters) {
		this.attempt(() => {
			this.nwayo.after(type, this.functionalHook, ...parameters);
		});
	}

	whenRegisteringHookFor(type, name, ...parameters) {
		this.attempt(() => {
			this.nwayo.registerHook(type, name, this.functionalHook, ...parameters);
		});
	}

	whenRegisteringHandler() {
		this.attempt(() => {
			this.nwayo.register(this.handler);
		});
	}

	whenCallingOnWithNegativeWeightFor(type) {
		this.whenCallingOnFor(type, -1);
	}

	whenCallingBeforeWithNegativeWeightFor(type) {
		this.whenCallingBeforeFor(type, -1);
	}

	whenCallingAfterWithNegativeWeightFor(type) {
		this.whenCallingAfterFor(type, -1);
	}

	whenRegisteringHookWithNegativeWeightFor(type, phase) {
		this.whenRegisteringHookFor(type, phase, -1);
	}

	whenGettingHooksForType(type) {
		this.attempt(() => {
			this.setResult(this.nwayo.getHooks(type));
		});
	}

	whenGettingHooksForTypeAndPhase(type, phase) {
		this.attempt(() => {
			this.setResult(this.nwayo.getHooks(type, phase));
		});
	}

	whenCheckingIfHookExistsForType(type) {
		this.attempt(() => {
			this.setResult(this.nwayo.hasHook(type));
		});
	}

	whenCheckingIfHookExistsForTypeAndPhase(type, phase) {
		this.attempt(() => {
			this.setResult(this.nwayo.hasHook(type, phase));
		});
	}

	whenGettingPhases() {
		this.attempt(() => {
			this.setResult(this.nwayo.phases);
		});
	}

	async whenBuilding() {
		await this.attemptAsync(async () => {
			await this.nwayo.build(...this.buildArguments);
		});
	}


	//-- Then
	//--------------------------------------------------------

	thenShouldHaveRegisteredHook(type, phase) {
		this.thenShouldNotHaveThrown();
		const hooks = __(this.nwayo).get('hooks');
		this.expect(hooks).toHaveProperty(type);
		this.expect(hooks[type]).toHaveProperty(phase);
		this.expect(Array.isArray(hooks[type][phase])).toBe(true);
		this.expect(hooks[type][phase].length).toBeGreaterThan(0);
	}

	thenShouldHaveRegisteredFunctionalHook(type, phase) {
		this.thenShouldHaveRegisteredHook(type, phase);
		this.expect(this.nwayo.getHooks(type, phase)[0]).toBe(this.functionalHook);
	}

	thenShouldHaveRegisteredHandlerHook(type, phase) {
		this.thenShouldHaveRegisteredHook(type, phase);
		this.expect(this.nwayo.getHooks(type, phase)[0]).toBe(this.handler[phase]);
	}

	thenShouldHaveRegisteredFunctionalHookAtBeginning(type, phase) {
		this.thenShouldHaveRegisteredHook(type, phase);
		this.expect(this.nwayo.getHooks(type, phase).length).toBeGreaterThan(1);
		this.expect(this.nwayo.getHooks(type, phase)[0]).toBe(this.functionalHook);
	}

	thenShouldHaveRegisteredHandlerHookAtBeginning(type, phase) {
		this.thenShouldHaveRegisteredHook(type, phase);
		this.expect(this.nwayo.getHooks(type, phase).length).toBeGreaterThan(1);
		this.expect(this.nwayo.getHooks(type, phase)[0]).toBe(this.handler[phase]);
	}

	thenShouldHaveReceivedOneProcessHook() {
		this.thenResultShouldEqual({
			process: [
				this.registeredHook
			]
		});
	}

	thenShouldHaveReceivedOneHook() {
		this.thenResultShouldEqual([
			this.registeredHook
		]);
	}

	thenShouldHaveReceivedAllPhases() {
		this.thenResultShouldEqual(Object.fromEntries(this.getAllExpectedHooks().map((hook) => {
			return [hook, hook];
		})));
	}

	thenShouldHaveCalledAllHooks(bundlesAndTypesCalls, typesCalls) {
		this.thenShouldHaveCalledBundleLoaded(bundlesAndTypesCalls);
		this.thenShouldHaveCalledBundlesLoaded(typesCalls);
		this.thenShouldHaveCalledPreProcess(bundlesAndTypesCalls);
		this.thenShouldHaveCalledProcess(bundlesAndTypesCalls);
		this.thenShouldHaveCalledConfigGenerated(bundlesAndTypesCalls);
		this.thenShouldHaveCalledBeforeBuild(typesCalls);
		this.thenShouldHaveCalledAfterBuild(typesCalls);
		this.thenShouldHaveCalledPostProcess(bundlesAndTypesCalls);
	}

	thenShouldHaveCalledHook(phase, callsData) {
		this.thenShouldNotHaveThrown();
		this.expect(this.registeredHandler[phase]).toHaveBeenCalledTimes(callsData.length);
		callsData.reduce((calls, { type }, index) => {
			const call = this.registeredHandler[phase].mock.calls[index];
			this.expect(call[call.length - 1]).toStrictEqual({ type, calls, phase });

			return { ...calls, [type]: (calls[type] || 0) + 1 };
		}, {});
	}

	thenShouldHaveCalledHookWithBundle(name, callsData, bundleArgumentIndex) {
		this.thenShouldHaveCalledHook(name, callsData);
		callsData.forEach(({ bundle }, index) => {
			const call = this.registeredHandler[name].mock.calls[index];
			this.expect(call[bundleArgumentIndex]).toBeTruthy();
			this.expect(call[bundleArgumentIndex].bundleName).toBe(bundle);
		});
	}

	thenShouldHaveCalledBundleLoaded(calls) {
		this.thenShouldHaveCalledHookWithBundle('bundleLoaded', calls, 0);
	}

	thenShouldHaveCalledBundlesLoaded(calls) {
		this.thenShouldHaveCalledHook('bundlesLoaded', calls);
	}

	thenShouldHaveCalledPreProcess(calls) {
		this.thenShouldHaveCalledHookWithBundle('preprocess', calls, 0);
	}

	thenShouldHaveCalledProcess(calls) {
		this.thenShouldHaveCalledHookWithBundle('process', calls, 1);
	}

	thenShouldHaveCalledConfigGenerated(calls) {
		this.thenShouldHaveCalledHookWithBundle('configGenerated', calls, 1);
	}

	thenShouldHaveCalledBeforeBuild(calls) {
		this.thenShouldHaveCalledHookWithBundle('beforeBuild', calls, 1);
	}

	thenShouldHaveCalledAfterBuild(calls) {
		this.thenShouldHaveCalledHook('afterBuild', calls);
	}

	thenShouldHaveCalledPostProcess(calls) {
		this.thenShouldHaveCalledHookWithBundle('postprocess', calls, 0);
	}

	thenFunctionalHookShouldHaveBeenCalledWithAppropriateState(...stateCalls) {
		this.thenShouldNotHaveThrown();
		this.expect(this.functionalHook).toHaveBeenCalledTimes(stateCalls.reduce((total, calls) => {
			return total + calls.length;
		}, 0));
		let count = 0;
		stateCalls.forEach((calls) => {
			calls.reduce((state, type) => {
				const call = this.functionalHook.mock.calls[count++];

				this.expect(call[call.length - 1]).toHaveProperty('type', type);
				this.expect(call[call.length - 1]).toHaveProperty('calls', { ...state });

				return { ...state, [type]: (state[type] || 0) + 1 };
			}, {});
		});
	}

	thenShouldHaveBuild() {
		this.thenShouldNotHaveThrown();
		this.expect(fakeBuilder.run).toHaveBeenCalledWith([{ _isMockedConfig: true }]);
	}

	thenShouldNotHaveBuild() {
		this.thenShouldNotHaveThrown();
		this.expect(fakeBuilder.run).not.toHaveBeenCalled();
	}

	thenShouldHaveWatchedWithOptions(options) {
		this.thenShouldNotHaveThrown();
		this.expect(fakeBuilder.watch).toHaveBeenCalledWith([{ _isMockedConfig: true }], options);
	}

	thenShouldNotHaveWatched() {
		this.thenShouldNotHaveThrown();
		this.expect(fakeBuilder.watch).not.toHaveBeenCalled();
	}


	//-- Helpers
	//--------------------------------------------------------

	getAllExpectedHooks() {
		return [
			'bundleLoaded',
			'bundlesLoaded',
			'preprocess',
			'builderCreated',
			'process',
			'configGenerated',
			'beforeBuild',
			'afterBuild',
			'postprocess'
		];
	}

	getTypesAndBundles() {
		return {
			types:   ['scripts', 'styles', 'assets'],
			bundles: ['foo', 'bar', 'baz']
		};
	}

}


module.exports = NwayoTest;
