//--------------------------------------------------------
//-- Nwayo Core - Services - Builder - Drivers - Laravel Mix Driver
//--------------------------------------------------------

import AbstractWebpackDriver from './AbstractWebpackDriver';


/**
 * Driver that uses Laravel Mix to leverage Webpack.
 *
 * @memberof nwayo.core.services.Builder.drivers
 * @augments nwayo.core.services.Builder.drivers.AbstractWebpackDriver
 * @hideconstructor
 */
class LaravelMixDriver extends AbstractWebpackDriver {

	/**
	 * Class dependencies: <code>['app', 'config']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app', 'config']);
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		if (super.init) {
			super.init();
		}

		this.setEngine(this.getLaravelMix());
	}

	/**
	 * If the method already exists in Laravel Mix, forward toe call with the appropriate parameters.
	 *
	 * @inheritdoc
	 */
	addEntry(type, ...parameters) {
		if (this.isFunction(this.engine[type])) {
			if (type === 'copy') {
				return this.copy(...parameters);
			}

			const [{ source, destination }] = parameters;

			this.engine[type](source, destination);

			return this;
		}

		return super.addEntry(type, ...parameters);
	}

	/**
	 * Handle JavaScript entry.
	 *
	 * @param {...*} parameters - The sent parameters.
	 * @returns {nwayo.core.services.Builder.drivers.LaravelMixDriver} The current driver instance.
	 */
	javascript(...parameters) {
		return this.addEntry('js', ...parameters);
	}

	/**
	 * Handle TypeScript entry.
	 *
	 * @param {...*} parameters - The sent parameters.
	 * @returns {nwayo.core.services.Builder.drivers.LaravelMixDriver} The current driver instance.
	 */
	typescript(...parameters) {
		return this.addEntry('ts', ...parameters);
	}

	/**
	 * Handle SCSS entry.
	 *
	 * @param {...*} parameters - The sent parameters.
	 * @returns {nwayo.core.services.Builder.drivers.LaravelMixDriver} The current driver instance.
	 */
	scss(...parameters) {
		return this.addEntry('sass', ...parameters);
	}

	/**
	 * Handle copy entry.
	 *
	 * @param {{ source: string, destination: string }} entry - The sent entry data.
	 * @returns {nwayo.core.services.Builder.drivers.LaravelMixDriver} The current driver instance.
	 */
	copy(entry) {
		const { source, destination } = entry;
		const action = (/\.[^\\/]+$/u).test(source) ? 'copy' : 'copyDirectory';

		this.engine[action](source, destination);

		return this;
	}

	/**
	 * @inheritdoc
	 */
	buildConfig() {
		this.Mix.dispatch('init', this.Mix);

		const config = new this.WebpackConfig().build();

		config.plugins.forEach((plugin) => {
			if (plugin.options && plugin.options.title === 'Laravel Mix' && plugin.options.contentImage) {
				Object.assign(plugin.options, {
					title:        this.config.get('app.name'),
					contentImage: this.app.formatPath(__dirname, '..', '..', '..', 'resources', 'static', 'images', 'nwayo.png')
				});
			}
		});

		return config;
	}

	/**
	 * Get a fresh Laravel Mix API instance.
	 *
	 * @returns {Api} The fresh Laravel Mix API instance.
	 */
	getLaravelMix() {
		const laravelMixPath = this.app.formatPath(require.resolve('laravel-mix'))
			.replace(/(?<module>.*\/node_modules\/laravel-mix).*/u, '$<module>');

		// Flushing all cached files from Laravel Mix folder.
		Object.keys(require.cache).forEach((key) => {
			if (this.app.formatPath(key).startsWith(laravelMixPath)) {
				delete require.cache[key];
			}
		});

		// Since Laravel Mix defines a `tap` Array helper, without defining the `configurable` property,
		// we must clearly indicate that the property is configurable to prevent TypeError on module reload.
		Object.defineProperty(Array.prototype, 'tap', { configurable: true }); // eslint-disable-line no-extend-native

		const { laravelMix } = this;
		// eslint-enable global-require

		new this.ComponentFactory().installAll();

		// This prevents to create the mix-manifest.json file.
		this.Manifest.prototype.refresh = () => {}; // eslint-disable-line no-empty-function

		this.Mix = global.Mix;

		return laravelMix;
	}

	/**
	 * Laravel Mix API.
	 *
	 * @type {Api}
	 */
	get laravelMix() {
		return require('laravel-mix'); // eslint-disable-line global-require
	}

	/**
	 * Webpack config class.
	 *
	 * @type {WebpackConfig}
	 */
	get WebpackConfig() {
		return require('laravel-mix/src/builder/WebpackConfig'); // eslint-disable-line global-require
	}

	/**
	 * Laravel Mix component factory class.
	 *
	 * @type {ComponentFactory}
	 */
	get ComponentFactory() {
		return require('laravel-mix/src/components/ComponentFactory'); // eslint-disable-line global-require
	}

	/**
	 * Laravel Mix manifest class.
	 *
	 * @type {Manifest}
	 */
	get Manifest() {
		return require('laravel-mix/src/Manifest'); // eslint-disable-line global-require
	}

}


export default LaravelMixDriver;
