"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Plugin = _interopRequireDefault(require("../Plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Specify the destination folder.
 *
 * @function destination
 * @param {string} destination - The destination folder.
 * @returns {nwayo.api.NwayoApi} - The current NwayoApi instance.
 * @memberof nwayo.api.NwayoApi
 * @instance
 */

/**
 * Specify the public URL to use inside the compiled assets when using internal references.
 *
 * @function url
 * @param {string} url - The public URL.
 * @returns {nwayo.api.NwayoApi} - The current NwayoApi instance.
 * @memberof nwayo.api.NwayoApi
 * @instance
 */

/**
 * Add additional Webpack configuration.
 * The given configuration will be smartly merged through the webpack-merge package.
 * This is intended for advanced usage and should be considered as a last resort for most use cases.
 *
 * @function webpackConfig
 * @param {object} config - The additional Webpack configuration.
 * @returns {nwayo.api.NwayoApi} - The current NwayoApi instance.
 * @memberof nwayo.api.NwayoApi
 * @instance
 */

/**
 * Execute a process after the build has completed.
 *
 * @function then
 * @param {Function} callback - The process to be executed at the end of the build process.
 * @returns {nwayo.api.NwayoApi} - The current NwayoApi instance.
 * @memberof nwayo.api.NwayoApi
 * @instance
 */

/**
 * Core plugin.
 *
 * @memberof nwayo.api.plugins
 * @augments nwayo.api.Plugin
 */
class CorePlugin extends _Plugin.default {
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
    this.nwayoApi.withLaravelMix(laravelMix => {
      laravelMix.setPublicPath(destination);
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
    this.nwayoApi.withLaravelMix(laravelMix => {
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
    this.nwayoApi.withLaravelMix(laravelMix => {
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
    this.nwayoApi.withLaravelMix(laravelMix => {
      laravelMix.then(callback);
    });
  }

}

var _default = CorePlugin;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;