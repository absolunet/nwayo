'use strict';

const context = require('../context');
const paths   = require('../paths');


/**
 * Laravel Mix builder.
 *
 * @memberof nwayo.api.laravelMix
 */
class LaravelMixBuilder {

	/**
	 * LaravelMixBuilder constructor.
	 *
	 * @param {nwayo.api.laravelMix.LaravelMixApiFactory} laravelMixApiFactory - A LaravelMixApiFactory instance.
	 */
	constructor(laravelMixApiFactory) {
		this.laravelMixApiFactory = laravelMixApiFactory;
	}

	/**
	 * Build the Webpack configuration object for the bundle.
	 *
	 * @param {{bundle: string}} options - The build options.
	 * @param {string} options.bundle - The target bundle for which to generate the Webpack configuration object.
	 * @returns {object} The built Webpack configuration object.
	 */
	build({ bundle }) {
		context.setBundle(bundle);

		this.laravelMixApiFactory.make();

		// eslint-disable-next-line global-require
		require(paths.bundleWebpackFile(context.bundle));

		global.Mix.dispatch('init', global.Mix);

		const config = {
			...this._getBuilderInstance().build(),
			name: context.bundle
		};

		context.setBundle(null);

		return config;
	}

	/**
	 * Get the Webpack Config builder instance.
	 *
	 * @returns {WebpackConfig} A fresh Webpack Config builder instance.
	 * @private
	 */
	_getBuilderInstance() {
		const WebpackConfigBuilder = require('laravel-mix/src/builder/WebpackConfig'); // eslint-disable-line global-require

		return new WebpackConfigBuilder();
	}

}


module.exports = LaravelMixBuilder;
