'use strict';

const fs     = require('@absolunet/fss');
const Plugin = require('../Plugin');


/**
 * Specify the destination folder, from the nwayo root folder, or as an absolute path.
 *
 * @function destination
 * @param {string} destination - The destination folder, either an absolute path, or a relative path from the nwayo root folder.
 * @returns {nwayo.api.NwayoApi} The current NwayoApi instance.
 * @memberof nwayo.api.NwayoApi
 * @instance
 */

/**
 * Specify the public URL to use inside the compiled assets when using internal references.
 *
 * @function url
 * @param {string} url - The public URL.
 * @returns {nwayo.api.NwayoApi} The current NwayoApi instance.
 * @memberof nwayo.api.NwayoApi
 * @instance
 */

/**
 * Add additional Webpack configuration.
 * The given configuration will be smartly merged through the webpack-merge package.
 * This is intended for advanced usage and should be considered as a last resort for most use cases.
 *
 * @function webpackConfig
 * @param {*} config - The additional Webpack configuration.
 * @returns {nwayo.api.NwayoApi} The current NwayoApi instance.
 * @memberof nwayo.api.NwayoApi
 * @instance
 */


/**
 * Execute a process after the build has completed.
 *
 * @function then
 * @param {Function} callback - The process to be executed at the end of the build process.
 * @returns {nwayo.api.NwayoApi} The current NwayoApi instance.
 * @memberof nwayo.api.NwayoApi
 * @instance
 */


/**
 * Core plugin.
 *
 * @memberof nwayo.api.plugins
 * @augments nwayo.api.Plugin
 */
class CorePlugin extends Plugin {

	/**
	 * @inheritdoc
	 */
	get type() {
		return ['scripts', 'styles', 'assets'];
	}

	/**
	 * @inheritdoc
	 */
	boot() {
		this.createMethod('destination', this._handleDestination.bind(this));
		this.createMethod('url', this._handleUrl.bind(this));
		this.createMethod('webpackConfig', this._handleWebpackConfig.bind(this));
		this.createMethod('then', this._handleThen.bind(this));
		this._preventPathInfo();
		this._definePaths();
	}

	/**
	 * Handle "destination" method.
	 *
	 * @see nwayo.api.NwayoApi#destination
	 *
	 * @param {string} destination - The destination folder.
	 * @private
	 */
	_handleDestination(destination) {
		this.nwayoApi.withLaravelMix((laravelMix) => {
			laravelMix.setPublicPath(this.nwayoApi.pathFromRoot(destination));
		});
	}

	/**
	 * Handle "url" method.
	 *
	 * @see nwayo.api.NwayoApi#url
	 *
	 * @param {string} url - The public URL.
	 * @private
	 */
	_handleUrl(url) {
		this.nwayoApi.withLaravelMix((laravelMix) => {
			laravelMix.setResourceRoot(url);
		});
	}

	/**
	 * Handle "webpackConfig" method.
	 *
	 * @see nwayo.api.NwayoApi#webpackConfig
	 *
	 * @param {object} config - The additional Webpack configuration.
	 * @private
	 */
	_handleWebpackConfig(config) {
		this.nwayoApi.withLaravelMix((laravelMix) => {
			laravelMix.webpackConfig(config);
		});
	}

	/**
	 * Handle "then" method.
	 *
	 * @see nwayo.api.NwayoApi#then
	 *
	 * @param {Function} callback - The process to be executed at the end of the build process.
	 * @private
	 */
	_handleThen(callback) {
		this.nwayoApi.withLaravelMix((laravelMix) => {
			laravelMix.then(callback);
		});
	}

	/**
	 * Prevent path info to show up in compiled assets.
	 *
	 * @private
	 */
	_preventPathInfo() {
		this.nwayoApi.webpackConfig({
			output: {
				pathinfo: false
			}
		});
	}

	/**
	 * Define paths to be used by other plugins.
	 *
	 * @private
	 */
	_definePaths() {
		const browsersListPath = this.nwayoApi.absolutePath(this.nwayoApi.pathFromBundle('.browserslistrc'));
		if (fs.exists(browsersListPath)) {
			this.nwayoApi.set('.browserslistrc', browsersListPath);
		}
	}

}


module.exports = CorePlugin;
