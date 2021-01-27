"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _context = _interopRequireDefault(require("./context"));

var _NwayoApi = _interopRequireDefault(require("./NwayoApi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base plugin.
 *
 * @memberof nwayo.api
 * @abstract
 */
class Plugin {
  /**
   * Plugin dependencies.
   * Dependencies should be modules that can be required.
   * If one or more dependencies are exposing a Plugin by default,
   * it will be registered in the current NwayoApi instance during
   * the register process, right before the boot phase.
   *
   * @type {Array<string>}
   */
  get dependencies() {
    return [];
  }
  /**
   * Type, or types, that the plugin is responding to.
   *
   * @type {string|Array<string>|null}
   * @abstract
   */


  get type() {
    return null;
  }
  /**
   * Get types that the plugin is responding to.
   *
   * @returns {Array<string>} The types that the plugin is responding to.
   */


  getBuildTypes() {
    return (Array.isArray(this.type) ? this.type : [this.type]).filter(Boolean);
  }
  /**
   * Register the plugin.
   */


  register() {
    this.dependencies.forEach(dependency => {
      const dependencyExportedValue = require(dependency); // eslint-disable-line global-require


      if (dependencyExportedValue && dependencyExportedValue.prototype instanceof Plugin) {
        this.nwayoApi.plugin(dependencyExportedValue);
      }
    });
  }
  /**
   * Boot the plugin.
   *
   * @abstract
   */


  boot() {//
  }
  /**
   * Create a method in the current NwayoApi instance.
   *
   * @example
   * this.createMethod('methodName', this._handleMethodName.bind(this));
   *
   * @example
   * // Here is an example to replicate for every additional methods
   * // provided by the plugin for IDE auto-completion and documentation.
   * // Don't forget to change the opening documentation block to match
   * // JSDoc standards (/** instead of /*).
   * /**
   *  * Method description. Should be as explicit as possible.
   *  *
   *  * @function methodName
   *  * @param {string} foo - The first argument.
   *  * @param {object} [bar={}}] - The second argument, which is optional and has a default value.
   *  * @returns {nwayo.api.NwayoApi} The current NwayoApi instance.
   *  * @memberof nwayo.api.NwayoApi
   *  * @instance
   *  *\/
   *
   * @example
   * // Here is an example to replicate for every internal method handler.
   * // Internal handlers should be kept private and start with an underscore,
   * // such as _handleMethodName() {}.
   * // This is mostly for internal plugin documentation, but for maintenance as well.
   * /**
   *  * Handle "methodName" method.
   *  *
   *  * @see nwayo.api.NwayoApi#methodName
   *  *
   *  * @param {string} foo - The first argument
   *  * @param {object} [bar={}}] - The second argument, which is optional and has a default value.
   *  * @private
   *  *\/
   *  _handleMethodName(foo, bar={}) {}
   *
   * @param {string} name - The method name.
   * @param {Function} handler - The method handler.
   * @returns {nwayo.api.Plugin} The current Plugin instance.
   * @protected
   */


  createMethod(name, handler) {
    this.nwayoApi[name] = (...parameters) => {
      const shouldBeHandled = _context.default.buildTypes.some(buildType => {
        return this.getBuildTypes().includes(buildType);
      });

      if (shouldBeHandled) {
        handler(...parameters);
      }

      return this.nwayoApi;
    };

    return this;
  }
  /**
   * The current NwayoApi instance.
   *
   * @type {nwayo.api.NwayoApi|undefined}
   */


  get nwayoApi() {
    return this._nwayoApi;
  }
  /**
   * Set the current NwayoApi instance.
   *
   * @param {nwayo.api.NwayoApi} nwayoApi - The NwayoApi instance.
   * @returns {nwayo.api.Plugin} The current Plugin instance.
   */


  setNwayoApi(nwayoApi) {
    if (!(nwayoApi instanceof _NwayoApi.default)) {
      throw new TypeError('The nwayoApi must be an instance of NwayoApi.');
    }

    this._nwayoApi = nwayoApi;
    return this;
  }

}

var _default = Plugin;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;