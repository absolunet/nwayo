"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _laravelMix = require("./laravelMix");

var _paths = _interopRequireDefault(require("./paths"));

var plugins = _interopRequireWildcard(require("./plugins"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    const instance = new this(_laravelMix.factory.getLaravelMix());
    const {
      CorePlugin,
      ScriptsPlugin,
      StylesPlugin,
      AssetsPlugin
    } = plugins;
    [CorePlugin, ScriptsPlugin, StylesPlugin, AssetsPlugin].forEach(Plugin => {
      instance.plugin(new Plugin());
    });
    return instance;
  }
  /**
   * API constructor.
   *
   * @param {import('laravel-mix')} laravelMix - The Laravel Mix API instance.
   */


  constructor(laravelMix) {
    this._laravelMix = laravelMix;
    this._plugins = [];
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
    return _paths.default.bundle(pathSegment);
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
    const pluginAlreadyRegistered = this._plugins.some(registeredPlugin => {
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

var _default = NwayoApi;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;