'use strict';

const paths = require('../paths');


/**
 * Laravel Mix API Factory.
 *
 * @memberof nwayo.api.laravelMix
 */
class LaravelMixApiFactory {

	/**
	 * LaravelMixApiFactory constructor.
	 */
	constructor() {
		this.flushableModulePaths = [
			paths.format(__dirname, 'index.js'),
			paths.format(require.resolve('laravel-mix')).replace(/(?<module>.*\/node_modules\/laravel-mix).*/u, '$<module>')
		];
	}

	/**
	 * Make a fresh Laravel Mix API instance.
	 *
	 * @returns {Api} The Laravel Mix API instance.
	 */
	make() {
		const laravelMix = this
			.flushLaravelMixModuleCache()
			.ensureGlobalOverridesAvailable()
			.getLaravelMix();

		this
			.disableManifestFile()
			.installAllComponents();

		return laravelMix;
	}

	/**
	 * Get the current Laravel Mix API instance.
	 *
	 * @returns {Api} The current Laravel Mix API instance.
	 */
	getLaravelMix() {
		return require('laravel-mix'); // eslint-disable-line global-require
	}

	/**
	 * Disable mix-manifest.json file.
	 *
	 * @returns {nwayo.api.laravelMix.LaravelMixApiFactory} The current LaravelMixApiFactory instance.
	 */
	disableManifestFile() {
		if (global.Mix) {
			global.Mix.manifest.refresh = () => {}; // eslint-disable-line no-empty-function
		}

		return this;
	}

	/**
	 * Flush Laravel Mix module cache.
	 *
	 * @returns {nwayo.api.laravelMix.LaravelMixApiFactory} The current LaravelMixApiFactory instance.
	 */
	flushLaravelMixModuleCache() {
		Object.keys(require.cache).forEach((key) => {
			const formattedKey      = paths.format(key);
			const isFlushableModule = this.flushableModulePaths.some((flushableModulePath) => {
				return formattedKey.startsWith(flushableModulePath);
			});

			if (isFlushableModule) {
				delete require.cache[key];
			}
		});

		return this;
	}

	/**
	 * Ensure that global variable overrides are made available.
	 * Since Laravel Mix defines a `tap` Array helper, without defining the `configurable` property,
	 * we must clearly indicate that the property is configurable to prevent TypeError on module reload.
	 *
	 * @returns {nwayo.api.laravelMix.LaravelMixApiFactory} The current LaravelMixApiFactory instance.
	 */
	ensureGlobalOverridesAvailable() {
		Object.defineProperty(Array.prototype, 'tap', { configurable: true }); // eslint-disable-line no-extend-native

		return this;
	}

	/**
	 * Install all Laravel Mix components.
	 *
	 * @returns {nwayo.api.laravelMix.LaravelMixApiFactory} The current LaravelMixApiFactory instance.
	 */
	installAllComponents() {
		const ComponentFactory = require('laravel-mix/src/components/ComponentFactory'); // eslint-disable-line global-require

		new ComponentFactory().installAll();

		return this;
	}

}


module.exports = LaravelMixApiFactory;
