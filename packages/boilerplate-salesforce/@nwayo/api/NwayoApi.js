'use strict';

const path        = require('path');
const context     = require('./context');
const { factory } = require('./laravelMix');
const paths       = require('./paths');
const plugins     = require('./plugins');


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
		this._variables  = {};
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
	 * Get a variable by name.
	 *
	 * @param {string} key - The variable name.
	 * @returns {*} The variable value, or undefined if it does not exist.
	 */
	get(key) {
		return this._variables[key];
	}

	/**
	 * Set a variable.
	 *
	 * @param {string} key - The variable name.
	 * @param {*} value - The variable value.
	 * @returns {nwayo.api.NwayoApi} The current NwayoApi instance.
	 */
	set(key, value) {
		this._variables[key] = value;

		return this;
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
	 * Format path for all OS.
	 *
	 * @param {...string} pathSegments - The path segments to format.
	 * @returns {string} The formatted path.
	 */
	formatPath(...pathSegments) {
		return paths.format(...pathSegments);
	}

	/**
	 * Get the directory name of a given path segment.
	 *
	 * @param {string} pathSegment - The path segment.
	 * @returns {string} The directory path.
	 */
	dirname(pathSegment) {
		return paths.dirname(pathSegment);
	}

	/**
	 * Get the absolute path fot the given segment.
	 * The segments can be absolute, or from the nwayo root folder.
	 *
	 * @param {...string} pathSegments - The relative or absolute path segments.
	 * @returns {string} The absolute path from the nwayo root folder.
	 */
	absolutePath(...pathSegments) {
		return this.formatPath(paths.root, this.pathFromRoot(...pathSegments));
	}

	/**
	 * Get the formatted relative path from one location to the other.
	 *
	 * @param {string} from - The starting path.
	 * @param {string} to - The destination path.
	 * @returns {string} The relative path.
	 */
	relativePath(from, to) {
		return paths.relative(from, to);
	}

	/**
	 * Generate a path from the nwayo root path.
	 *
	 * @param {...string} pathSegments - The relative path segments.
	 * @returns {string} The formatted path from the nwayo root folder.
	 */
	pathFromRoot(...pathSegments) {
		const formattedPath = this.formatPath(...pathSegments);

		if (path.isAbsolute(formattedPath)) {
			return this.relativePath(paths.root, formattedPath);
		}

		return formattedPath;
	}

	/**
	 * Generate a path from the source folder.
	 *
	 * @param {...string} pathSegments - The relative path segments.
	 * @returns {string} The formatted path from the source folder.
	 */
	pathFromSource(...pathSegments) {
		return this.pathFromRoot(paths.source, ...pathSegments);
	}

	/**
	 * Generate a path from the bundle path.
	 *
	 * @param {...string} pathSegments - The relative path segments.
	 * @returns {string} The formatted path from the bundle folder.
	 */
	pathFromBundle(...pathSegments) {
		return this.pathFromRoot(paths.bundle(context.bundle), ...pathSegments);
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


module.exports = NwayoApi;
