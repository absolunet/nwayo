import Plugin from '../Plugin';


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
	}

	/**
	 * Handle "sass" method.
	 *
	 * @see nwayo.api.NwayoApi#sass
	 *
	 * @param {string} file - The file path from the current folder.
	 * @param {string} [destination=file] - The destination file path from the destination folder.
	 * @private
	 */
	_handleSass(file, destination = file) {
		this.nwayoApi.withLaravelMix((laravelMix) => {
			laravelMix.sass(this.nwayoApi.pathFromBundle(file), destination.replace(/\.s[ac]ss$/u, 'css'));
		});
	}

	/**
	 * Handle "less" method.
	 *
	 * @see nwayo.api.NwayoApi#less
	 *
	 * @param {string} file - The file path from the current folder.
	 * @param {string} [destination=file] - The destination file path from the destination folder.
	 * @private
	 */
	_handleLess(file, destination = file) {
		this.nwayoApi.withLaravelMix((laravelMix) => {
			laravelMix.less(this.nwayoApi.pathFromBundle(file), destination.replace(/\.less$/u, 'less'));
		});
	}

}


export default StylesPlugin;
