//--------------------------------------------------------
//-- Nwayo Core - Services - Nwayo
//--------------------------------------------------------

import __ from '@absolunet/private-registry';


/**
 * Nwayo main service.
 *
 * @memberof nwayo.core.services
 * @hideconstructor
 */
class Nwayo {

	/**
	 * Class dependencies: <code>['app', 'nwayo.build.type', 'nwayo.builder', 'nwayo.project']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['app', 'nwayo.build.type', 'nwayo.builder', 'nwayo.project'];
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		__(this).set('hooks', {});
		__(this).set('calls', new Map());
	}

	/**
	 * Register an action on build process.
	 *
	 * @param {string} type - The build type name.
	 * @param {Function} action - The action to take during build process. Can be async.
	 * @param {number} [weight] - The weight of the registered action, the higher the latest.
	 * @returns {nwayo.core.services.Nwayo} The current Nwayo instance.
	 */
	on(type, action, weight) {
		return this.registerHook(type, this.phases.process, action, weight);
	}

	/**
	 * Register an action before build process.
	 *
	 * @param {string} type - The build type name.
	 * @param {Function} action - The action to take before build process. Can be async.
	 * @param {number} [weight] - The weight of the registered action, the higher the latest.
	 * @returns {nwayo.core.services.Nwayo} The current Nwayo instance.
	 */
	before(type, action, weight) {
		return this.registerHook(type, this.phases.preprocess, action, weight);
	}

	/**
	 * Register an action after build process.
	 *
	 * @param {string} type - The build type name.
	 * @param {Function} action - The action to take after build process. Can be async.
	 * @param {number} [weight] - The weight of the registered action, the higher the latest.
	 * @returns {nwayo.core.services.Nwayo} The current Nwayo instance.
	 */
	after(type, action, weight) {
		return this.registerHook(type, this.phases.postprocess, action, weight);
	}

	/**
	 * Register an action for a given build type, during a specific phase.
	 *
	 * @param {string} type - The build type name.
	 * @param {string} phase - The action phase, normally "preprocess", "process" or "postprocess".
	 * @param {Function} action - The action to take during the given phase. Can be async.
	 * @param {number} [weight=0] - The weight of the registered action, the higher the latest.
	 * @returns {nwayo.core.services.Nwayo} The current Nwayo instance.
	 */
	registerHook(type, phase, action, weight = 0) {
		const hooks = __(this).get('hooks');
		hooks[type] = hooks[type] || {};
		hooks[type][phase] = hooks[type][phase] || [];
		hooks[type][phase].push({ action, weight });

		return this;
	}

	/**
	 * Register a class or object to handle hook phases for specified types.
	 *
	 * @param {object|Function|string} registrableHandler - Makeable handler that specifies types and phase hook(s).
	 * @returns {nwayo.core.services.Nwayo} The current Nwayo instance.
	 */
	register(registrableHandler) {
		const handler         = this.app.make(registrableHandler);
		const { weight = {} } = handler;

		Object.values(this.phases).forEach((phase) => {
			if (handler[phase]) {
				const action = handler[phase].bind(handler);
				handler.types.forEach((type) => {
					const phaseWeight = weight[phase] || (typeof weight === 'number' ? weight : undefined);
					this.registerHook(type, phase, action, phaseWeight);
				});
			}
		});

		return this;
	}

	/**
	 * Start a build job.
	 *
	 * @param {string|Array<string>} [type] - The build type to run. If nothing is specified, all the types will run.
	 * @param {string|Array<string>} [bundle] - The bundle names to run build on. If nothing is specified, all the bundles will be used.
	 * @param {object} [options] - Build options.
	 * @returns {Promise} The async process promise.
	 */
	async build(type, bundle, options) {
		const types   = this.resolveTypes(type);
		const bundles = bundle ? Array.isArray(bundle) ? bundle : [bundle] : this.nwayoProject.getBundles();

		const bundlesData = await Promise.all(bundles.map(async (name) => {
			const bundleData = this.nwayoProject.loadBundleData(name);

			await this.runHooks(types, this.phases.bundleLoaded, async (action, stack) => {
				await action(bundleData, stack);
			});

			return bundleData;
		}));

		await this.runHooks(types, this.phases.bundlesLoaded, async (action, stack) => {
			await action(bundlesData, stack);
		});

		await this.preprocess(bundlesData, types, options);
		await this.process(bundlesData, types, options);
		await this.postprocess(bundlesData, types, options);
	}

	/**
	 * Run build preprocess phase.
	 * This phase should be run before using the builder.
	 *
	 * @param {Array<nwayo.core.services.BundleModel>} bundles - The bundles to run preprocess phase on.
	 * @param {Array<string>} types - The build types to preprocess.
	 * @param {object} options - The build options.
	 * @returns {Promise} - The async process promise.
	 */
	async preprocess(bundles, types, options) {
		await this.runHooksForBundles(bundles, types, this.phases.preprocess, async (action, bundle, stack) => {
			await action(bundle, options, stack);
		});
	}

	/**
	 * Run build process phase.
	 * This phase should be used to add entries in the builder.
	 *
	 * @param {Array<nwayo.core.services.BundleModel>} bundles - The bundles to run preprocess phase on.
	 * @param {Array<string>} types - The build types to preprocess.
	 * @param {boolean|object<string, *>} options - The build options. If true, considered to be the watch flag.
	 * @returns {Promise} - The async process promise.
	 */
	async process(bundles, types, options) {
		/* eslint-disable no-await-in-loop */
		const config   = [];

		// Since each builder driver can be limited in concurrency while generating configuration,
		// each bundle's builder configuration is generated separately, in series.
		for (const index in bundles) {
			if (Object.prototype.hasOwnProperty.call(bundles, index)) {
				const bundle  = bundles[index];
				const builder = this.nwayoBuilder.make({ bundle });

				await this.runHooks(types, this.phases.builderCreated, async (action, stack) => {
					await action(builder, bundle, stack);
				});

				await this.runHooks(types, this.phases.process, async (action, stack) => {
					await action(builder, bundle, options, stack);
				});

				const singleConfig = builder.buildConfig(bundle);

				await this.runHooks(types, this.phases.configGenerated, async (action, stack) => {
					await action(singleConfig, bundle, options, stack);
				});

				config[index] = singleConfig;
			}
		}

		await this.runHooks(types, this.phases.beforeBuild, async (action, stack) => {
			await action(config, bundles, options, stack);
		});

		await this.runHooks(types, this.phases.afterBuild, (action, stack) => {
			this.nwayoBuilder.onAfterBuild((...parameters) => {
				action(...parameters, stack);
			});
		});

		if (options && (options === true || options.watch)) {
			await this.nwayoBuilder.watch(config, (options.watch || options) === true ? undefined : options.watch);
		} else {
			await this.nwayoBuilder.run(config);
		}
		/* eslint-enable no-await-in-loop */
	}

	/**
	 * Run build postprocess phase.
	 * This phase should be run after the builder has done the build job.
	 *
	 * @param {Array<nwayo.core.services.BundleModel>} bundles - The bundles to run preprocess phase on.
	 * @param {Array<string>} types - The build types to preprocess.
	 * @param {object} options - The build options.
	 * @returns {Promise} - The async process promise.
	 */
	async postprocess(bundles, types, options) {
		await this.runHooksForBundles(bundles, types, this.phases.postprocess, async (action, bundle, stack) => {
			await action(bundle, options, stack);
		});
	}

	/**
	 * Handle all registered hooks for given types and phase through a handler.
	 *
	 * @param {Array<string>} types - The build types.
	 * @param {string} phase - The phase to run.
	 * @param {Function} handler - The handler to manually run all actions.
	 * @returns {Promise} The async process promise.
	 */
	async runHooks(types, phase, handler) {
		await Promise.all(types.map(async (type) => {
			await Promise.all(this.getHooks(type, phase).map(async (action) => {
				const stack = this.useState(action, type, phase);
				await handler(action, stack);
			}));
		}));
	}

	/**
	 * Run a specific build phase.
	 *
	 * @param {Array<nwayo.core.services.BundleModel>} bundles - The bundles to run build phase on.
	 * @param {Array<string>} types - The build types to run.
	 * @param {string} phase - The phase to run.
	 * @param {Function} handler - Callback to be run on each bundle, for each type.
	 * @returns {Promise} The async process promise.
	 */
	async runHooksForBundles(bundles, types, phase, handler) {
		await Promise.all(bundles.map(async (bundle) => {
			await this.runHooks(types, phase, async (action, stack) => {
				await handler(action, bundle, stack);
			});
		}));
	}

	/**
	 * Get all hooks for a given type and phase.
	 *
	 * @param {string} type - The build type.
	 * @param {string} [phase] - The build phase.
	 * @returns {Array<Function>|object<string, Array<Function>>} The retrieved actions, ordered by weight.
	 */
	getHooks(type, phase) {
		this.prepareHooks();

		if (!this.hasHook(type, phase)) {
			return [];
		}

		const hooks = __(this).get('hooks')[type];

		if (!phase) {
			return Object.fromEntries(Object.entries(hooks).map(([key, typeHooks]) => {
				return [key, typeHooks.map(({ action }) => {
					return action;
				})];
			}));
		}

		return hooks[phase].map(({ action }) => {
			return action;
		});
	}

	/**
	 * Check if a hook exists for given phase and type.
	 *
	 * @param {string} type - The build type.
	 * @param {string} [phase] - The build phase.
	 * @returns {boolean} Indicates that a hook was registered for the given build phase and build type.
	 */
	hasHook(type, phase) {
		const hooks = __(this).get('hooks');

		const typeHasHooks = Object.prototype.hasOwnProperty.call(hooks, type);

		if (!phase) {
			return typeHasHooks;
		}

		return typeHasHooks && Object.prototype.hasOwnProperty.call(hooks[type], phase);
	}

	/**
	 * Prepare hooks for immediate usage.
	 *
	 * @returns {nwayo.core.services.Nwayo} The current Nwayo instance.
	 */
	prepareHooks() {
		Object.values(__(this).get('hooks')).forEach((hooks) => {
			Object.values(hooks).forEach((phaseHooks) => {
				phaseHooks.sort(({ weight: a }, { weight: b }) => {
					return a - b;
				});
			});
		});

		return this;
	}

	/**
	 * Get all registered types.
	 *
	 * @returns {Array<string>} The registered types.
	 */
	getRegisteredTypes() {
		return Object.values(this.nwayoBuildType.all());
	}

	/**
	 * Resolve types from either single type or a list of types.
	 *
	 * @param {string|Array<string>} type - The build type name(s).
	 * @returns {Array<string>} The resolved build types name.
	 */
	resolveTypes(type) {
		const types = (Array.isArray(type) ? type : [type]).filter(Boolean);

		if (types.length === 0 || types.includes(this.nwayoBuildType.ALL)) {
			return this.getRegisteredTypes();
		}

		return types;
	}

	/**
	 * Use call stack meta data for a call.
	 * It returns a <code>done</code> callback that increments the stack once the call has been made.
	 *
	 * @param {Function} action - The action to get stack from.
	 * @param {string} type - The build type name.
	 * @param {string} phase - The current hook phase name.
	 * @returns {object<string, number>} The current call stack.
	 */
	useState(action, type, phase) {
		const callsMap   = __(this).get('calls');
		const phaseCalls = callsMap.get(action) || {};
		const calls      = { ...phaseCalls[phase] || {} };
		const state      = { type, calls, phase };

		callsMap.set(action, {
			...phaseCalls,
			[phase]: {
				...calls,
				[type]: (calls[type] || 0) + 1
			}
		});

		return state;
	}

	/**
	 * Available phases.
	 *
	 * @type {object<string, string>}
	 */
	get phases() {
		return {
			bundleLoaded: 'bundleLoaded',
			bundlesLoaded: 'bundlesLoaded',
			preprocess: 'preprocess',
			builderCreated: 'builderCreated',
			process: 'process',
			configGenerated: 'configGenerated',
			beforeBuild: 'beforeBuild',
			afterBuild: 'afterBuild',
			postprocess: 'postprocess'
		};
	}

}


export default Nwayo;
