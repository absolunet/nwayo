'use strict';

const sass               = require('sass');
const Plugin             = require('../../Plugin');
const sassOptionsFactory = require('./sass');

/**
 * Add a SASS or SASS (.s[ac]ss) file to be compiled.
 *
 * @function sass
 * @param {string} file - The file path from the current folder.
 * @param {string} [destination=file] - The destination file path from the destination folder.
 * @returns {nwayo.api.NwayoApi} The current NwayoApi instance.
 * @memberof nwayo.api.NwayoApi
 * @instance
 */


/**
 * Add a LESS (.less) file to be compiled.
 *
 * @function less
 * @param {string} file - The file path from the current folder.
 * @param {string} [destination=file] - The destination file path from the destination folder.
 * @returns {nwayo.api.NwayoApi} The current NwayoApi instance.
 * @memberof nwayo.api.NwayoApi
 * @instance
 */


/**
 * Styles plugin.
 *
 * @memberof nwayo.api.plugins
 * @augments nwayo.api.Plugin
 */
class StylesPlugin extends Plugin {

	/**
	 * @inheritdoc
	 */
	get dependencies() {
		return ['laravel-mix-stylelint'];
	}

	/**
	 * @inheritdoc
	 */
	get type() {
		return 'styles';
	}

	/**
	 * @inheritdoc
	 */
	boot() {
		this.createMethod('sass', this._handleSass.bind(this));
		this.createMethod('less', this._handleLess.bind(this));
		this._addAutoprefixer();
	}

	/**
	 * Handle "sass" method.
	 *
	 * @see nwayo.api.NwayoApi#sass
	 *
	 * @param {string} file - The file path from the current folder.
	 * @param {string} [destination=file] - The destination file path from the destination folder.
	 * @param {...object|Array} [parameters] - The Laravel Mix extra parameters.
	 * @private
	 */
	_handleSass(file, destination = file, compilerOptions = {}, ...parameters) {
		this.nwayoApi.withLaravelMix((laravelMix) => {
			const fileFromRoot = this.nwayoApi.pathFromBundle(file);

			laravelMix.sass(
				fileFromRoot,
				destination.replace(/\.s[ac]ss$/u, '.css'),
				{
					...compilerOptions,
					sassOptions: {
						...(compilerOptions.sassOptions || {}),
						...sassOptionsFactory({ nwayoApi: this.nwayoApi, file: fileFromRoot, sass })
					}
				},
				...parameters
			);
		});
	}

	/**
	 * Handle "less" method.
	 *
	 * @see nwayo.api.NwayoApi#less
	 *
	 * @param {string} file - The file path from the current folder.
	 * @param {string} [destination=file] - The destination file path from the destination folder.
	 * @param {...object|Array} [parameters] - The Laravel Mix extra parameters.
	 * @private
	 */
	_handleLess(file, destination = file, ...parameters) {
		this.nwayoApi.withLaravelMix((laravelMix) => {
			laravelMix.less(
				this.nwayoApi.pathFromBundle(file),
				...parameters
			);
		});
	}

	/**
	 * Add autoprefixer configuration.
	 *
	 * @private
	 */
	_addAutoprefixer() {
		this.nwayoApi.withLaravelMix((laravelMix) => {
			laravelMix.config.autoprefixer.options = {
				env: {
					BROWSERSLIST_CONFIG: this.nwayoApi.get('.browserslist')
				}
			};
		});
	}

}


module.exports = StylesPlugin;
