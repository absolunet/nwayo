"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _ioc = require("@absolunet/ioc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo Core - Services - Builder - Drivers - Driver
//--------------------------------------------------------
const {
  hasEngine,
  checksTypes
} = _ioc.mixins;
/**
 * Abstract builder driver that handle configuration entries,
 * builder process runs and watches.
 *
 * @memberof nwayo.core.services.Builder.drivers
 * @augments ioc.support.mixins.ChecksTypes
 * @augments ioc.support.mixins.HasEngine
 * @hideconstructor
 * @abstract
 */

class Driver extends checksTypes(hasEngine()) {
  /**
   * @inheritdoc
   * @private
   */
  init() {
    if (super.init) {
      super.init();
    }

    const _constructor = (0, _privateRegistry.default)(this.constructor);

    _constructor.set('handlers', _constructor.get('handlers') || {});

    _constructor.set('afterBuild', _constructor.get('afterBuild') || []);
  }
  /**
   * Add an entry in the configuration object.
   *
   * @param {string} type - The entry type.
   * @param {...*} parameters - The entry parameters.
   * @returns {Driver} - The current driver instance.
   * @throws {ReferenceError} Indicates that the entry type is not supported.
   */


  addEntry(type, ...parameters) {
    if (this.hasHandler(type)) {
      this.callHandler(type, parameters);
    } else if (this.methodExists(type)) {
      this[type](...parameters);
    } else {
      throw new ReferenceError(`Builder does not support [${type}]`);
    }

    return this;
  }
  /**
   * Register an external build type handler.
   *
   * @param {string} type - The build type name.
   * @param {Function} handler - The handler.
   * @returns {nwayo.core.services.Builder.drivers.Driver} The current driver instance.
   */


  registerHandler(type, handler) {
    (0, _privateRegistry.default)(this.constructor).get('handlers')[type] = handler;
    return this;
  }
  /**
   * Check if an external handler exists for the given build type.
   *
   * @param {string} type - The build type name.
   * @returns {boolean} Indicates that the external handler exists.
   */


  hasHandler(type) {
    return Object.prototype.hasOwnProperty.call((0, _privateRegistry.default)(this.constructor).get('handlers'), type);
  }
  /**
   * Call an external handler by build type name.
   *
   * @param {string} type - The build type name.
   * @param {Array<*>} parameters - The entry parameters.
   * @returns {*} - The handler returned value.
   * @throws {TypeError} Indicates that the handler does not exist.
   */


  callHandler(type, parameters) {
    if (!this.hasHandler(type)) {
      throw new TypeError(`Handler [${type}] does not exist.`);
    }

    return (0, _privateRegistry.default)(this.constructor).get('handlers')[type](this.engine, ...parameters);
  }
  /**
   * Add action to be run after build process.
   *
   * @param {Function} action - The action to take during build process. Can be async.
   * @returns {nwayo.core.services.Builder.drivers.Driver} The current driver instance.
   */


  afterBuild(action) {
    (0, _privateRegistry.default)(this.constructor).get('afterBuild').push(action);
    return this;
  }
  /**
   * Get global callback to be run on after build.
   * It will run all registered afterBuild callbacks.
   *
   * @returns {Function} The function to be run once the compiler has build assets.
   */


  getAfterBuild() {
    return async (...parameters) => {
      await Promise.all((0, _privateRegistry.default)(this.constructor).get('afterBuild').map(async action => {
        await action(...parameters);
      }));
    };
  }
  /**
   * Build configuration that can be run.
   *
   * @returns {Promise<object>} The configuration object.
   * @async
   * @abstract
   */


  buildConfig() {
    throw new _ioc.NotImplementedError(this, 'buildConfig', 'object');
  }
  /**
   * Run builder from configuration file.
   *
   * @param {object} config - The configuration object.
   * @returns {Promise} The async process promise.
   * @async
   * @abstract
   */


  run(config) {
    // eslint-disable-line no-unused-vars
    throw new _ioc.NotImplementedError(this, 'run', 'Promise');
  }
  /**
   * Run builder from configuration file and watch for file change.
   *
   * @param {object} config - The configuration object.
   * @returns {Promise} The async process promise.
   * @async
   * @abstract
   */


  watch(config) {
    // eslint-disable-line no-unused-vars
    throw new _ioc.NotImplementedError(this, 'watch', 'Promise');
  }

}

var _default = Driver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;