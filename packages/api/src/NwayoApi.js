import { factory }  from './laravelMix';
import paths        from './paths';
import * as plugins from './plugins';


/**
 * Nwayo API Factory.
 *
 * @memberof nwayo.api
 */
class NwayoApi {

	/**
	 * Make an API instance.
	 *
	 * @returns {nwayo.api.NwayoApi} The new NwayoApi instance.
	 */
	static make() {
		const instance = new this(factory.getLaravelMix());

		const { CorePlugin, ScriptsPlugin, StylesPlugin, AssetsPlugin } = plugins;

		[CorePlugin, ScriptsPlugin, StylesPlugin, AssetsPlugin].forEach((Plugin) => {
			instance.plugin(new Plugin());
		});

		return instance;
	}

	/**
	 * API constructor.
	 *
	 * @param {Api} laravelMix - The Laravel Mix API instance.
	 */
	constructor(laravelMix) {
		this._laravelMix = laravelMix;
		this._plugins    = [];
	}

	/**
	 * Add a plugin to NwayoApi.
	 *
	 * @param {string|Function|Plugin} plugin - The plugin to add. Can be a file or a module, a plugin class or a plugin instance.
	 * @returns {nwayo.api.NwayoApi} The current NwayoApi instance.
	 */
	plugin(plugin) {
		// eslint-disable-next-line global-require
		const pluginReference = typeof plugin === 'string' ? require(plugin) : plugin;

		return this._bootPlugin(this._instantiatePlugin(pluginReference));
	}

	/**
	 * Interact with Laravel Mix.
	 *
	 * @example
	 * nwayo
	 * 	.withLaravelMix((laravelMix) => {
	 *  	laravelMix.stylus('foo/bar.styl', 'foo/bar.css');
	 * 	})
	 * 	.js('foo/bar.js');
	 *
	 * @param {Function} callback - The process to be executed with Laravel Mix API instance.
	 * @returns {nwayo.api.NwayoApi} The current NwayoApi instance.
	 */
	withLaravelMix(callback) {
		callback(this._laravelMix);

		return this;
	}

	/**
	 * Generate a path from the bundle path.
	 *
	 * @param {string} pathSegment - The relative path segment.
	 * @returns {string} The formatted path from the bundle folder.
	 */
	pathFromBundle(pathSegment) {
		return paths.bundle(pathSegment);
	}

	/**
	 * Get a Plugin instance from either a Plugin class reference, or an already instantiated instance.
	 *
	 * @param {Function|nwayo.api.Plugin} Plugin - The Plugin class or instance.
	 * @returns {nwayo.api.Plugin} The Plugin instance.
	 * @private
	 */
	_instantiatePlugin(Plugin) {
		if (Plugin.prototype && Plugin.prototype.constructor) {
			return new Plugin();
		}

		return Plugin;
	}

	/**
	 * Boot a Plugin instance.
	 *
	 * @param {nwayo.api.Plugin} plugin - The Plugin instance.
	 * @returns {nwayo.api.NwayoApi} The current NwayoAPi instance.
	 * @private
	 */
	_bootPlugin(plugin) {
		const pluginAlreadyRegistered = this._plugins.some((registeredPlugin) => {
			return registeredPlugin instanceof plugin.constructor;
		});

		if (pluginAlreadyRegistered) {
			throw new TypeError(`Given plugin [${plugin.constructor.name}] already registered.`);
		}

		this._plugins.push(plugin);

		plugin.setNwayoApi(this);
		plugin.register();
		plugin.boot();

		return this;
	}

}


export default NwayoApi;
