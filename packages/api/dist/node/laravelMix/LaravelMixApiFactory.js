"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _paths = _interopRequireDefault(require("../paths"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Laravel Mix API Factory.
 *
 * @memberof nwayo.api.laravelMix
 */
class LaravelMixApiFactory {
  /**
   * LaravelMixApiFactory constructor.
   */
  constructor() {
    this.flushableModulePaths = [_paths.default.format(__dirname, 'index.js'), _paths.default.format(require.resolve('laravel-mix')).replace(/(?<module>.*\/node_modules\/laravel-mix).*/u, '$<module>')];
  }
  /**
   * Make a fresh Laravel Mix API instance.
   *
   * @returns {Api} The Laravel Mix API instance.
   */


  make() {
    const laravelMix = this.flushLaravelMixModuleCache().ensureGlobalOverridesAvailable().getLaravelMix();
    this.installAllComponents();
    return laravelMix;
  }
  /**
   * Get the current Laravel Mix API instance.
   *
   * @returns {Api} The current Laravel Mix API instance.
   */


  getLaravelMix() {
    return require('laravel-mix'); // eslint-disable-line global-require
  }
  /**
   * Flush Laravel Mix module cache.
   *
   * @returns {nwayo.api.laravelMix.LaravelMixApiFactory} The current LaravelMixApiFactory instance.
   */


  flushLaravelMixModuleCache() {
    Object.keys(require.cache).forEach(key => {
      const formattedKey = _paths.default.format(key);

      const isFlushableModule = this.flushableModulePaths.some(flushableModulePath => {
        return formattedKey.startsWith(flushableModulePath);
      });

      if (isFlushableModule) {
        delete require.cache[key];
      }
    });
    return this;
  }
  /**
   * Ensure that global variable overrides are made available.
   * Since Laravel Mix defines a `tap` Array helper, without defining the `configurable` property,
   * we must clearly indicate that the property is configurable to prevent TypeError on module reload.
   *
   * @returns {nwayo.api.laravelMix.LaravelMixApiFactory} The current LaravelMixApiFactory instance.
   */


  ensureGlobalOverridesAvailable() {
    Object.defineProperty(Array.prototype, 'tap', {
      configurable: true
    }); // eslint-disable-line no-extend-native

    return this;
  }
  /**
   * Install all Laravel Mix components.
   *
   * @returns {nwayo.api.laravelMix.LaravelMixApiFactory} The current LaravelMixApiFactory instance.
   */


  installAllComponents() {
    const ComponentFactory = require('laravel-mix/src/components/ComponentFactory'); // eslint-disable-line global-require


    new ComponentFactory().installAll();
    return this;
  }

}

var _default = LaravelMixApiFactory;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;