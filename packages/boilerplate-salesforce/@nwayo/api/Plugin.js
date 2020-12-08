'use strict';

const context  = require('./context');


/**
 * Base plugin.
 *
 * @memberof nwayo.api
 * @abstract
 */
class Plugin {

	/**
	 * Plugin dependencies.
	 * Dependencies should be modules that can be required.
	 * If one or more dependencies are exposing a Plugin by default,
	 * it will be registered in the current NwayoApi instance during
	 * the register process, right before the boot phase.
	 *
	 * @type {Array<string>}
	 */
	get dependencies() {
		return [];
	}

	/**
	 * Type, or types, that the plugin is responding to.
	 *
	 * @type {string|Array<string>|null}
	 * @abstract
	 */
	get type() {
		return null;
	}

	/**
	 * Get types that the plugin is responding to.
	 *
	 * @returns {Array<string>} The types that the plugin is responding to.
	 */
	getBuildTypes() {
		return (Array.isArray(this.type) ? this.type : [this.type]).filter(Boolean);
	}

	/**
	 * Register the plugin.
	 */
	register() {
		this.dependencies.forEach((dependency) => {
			const dependencyExportedValue = require(dependency); // eslint-disable-line global-require

			if (dependencyExportedValue && dependencyExportedValue.prototype instanceof Plugin) {
				this.nwayoApi.plugin(dependencyExportedValue);
			}
		});
	}

	/**
	 * Boot the plugin.
	 *
	 * @abstract
	 */
	boot() {
		//
	}

	/**
	 * Create a method in the current NwayoApi instance.
	 *
	 * @example
	 * this.createMethod('methodName', this._handleMethodName.bind(this));
	 *
	 * @example
	 * // Here is an example to replicate for every additional methods provided by the plugin.
	 * // This is mostly for IDE auto-completion and documentation.
	 * // (WATCH OUT FOR THE CLOSING COMMENT, IT CONTAINS A ZERO WIDTH NON-JOINER CHARACTER)
	 * /**
	 *  * Method description. Should be as explicit as possible.
	 *  *
	 *  * @function methodName
	 *  * @param {string} foo - The first argument.
	 *  * @param {object} [bar={}] - The second argument, which is optional and has a default value.
	 *  * @returns {nwayo.api.NwayoApi} The current NwayoApi instance.
	 *  * @memberof nwayo.api.NwayoApi
	 *  * @instance
	 *  *‌/
	 *
	 * @example
	 * // Here is an example to replicate for every internal method handler.
	 * // Internal handlers should be kept private and start with an underscore (<code>_handleMethodName() {}</code>).
	 * // This is mostly for internal plugin documentation, but for maintenance as well.
	 * // (WATCH OUT FOR THE CLOSING COMMENT, IT CONTAINS A ZERO WIDTH NON-JOINER CHARACTER)
	 * /**
	 *  * Handle "methodName" method.
	 *  *
	 *  * @see nwayo.api.NwayoApi#methodName
	 *  *
	 *  * @param {string} foo - The first argument
	 *  * @param {object} [bar={}] - The second argument, which is optional and has a default value.
	 *  * @private
	 *  *‌/
	 * _handleMethodName(foo, bar={}) {}
	 *
	 * @param {string} name - The method name.
	 * @param {Function} handler - The method handler.
	 * @returns {nwayo.api.Plugin} The current Plugin instance.
	 * @protected
	 */
	createMethod(name, handler) {
		this.nwayoApi[name] = (...parameters) => {
			const shouldBeHandled = context.buildTypes.some((buildType) => {
				return this.getBuildTypes().includes(buildType);
			});

			if (shouldBeHandled) {
				handler(...parameters);
			}

			return this.nwayoApi;
		};

		return this;
	}

	/**
	 * The current NwayoApi instance.
	 *
	 * @type {nwayo.api.NwayoApi|undefined}
	 */
	get nwayoApi() {
		return this._nwayoApi;
	}

	/**
	 * Set the current NwayoApi instance.
	 *
	 * @param {nwayo.api.NwayoApi} nwayoApi - The NwayoApi instance.
	 * @returns {nwayo.api.Plugin} The current Plugin instance.
	 */
	setNwayoApi(nwayoApi) {
		this._nwayoApi = nwayoApi;

		return this;
	}

}


module.exports = Plugin;
