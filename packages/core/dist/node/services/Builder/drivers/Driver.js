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
   * Class dependencies: <code>['event']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['event']);
  }
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
   * Register an event through the event dispatcher.
   *
   * @param {string} eventName - The event name.
   * @param {Function} handler - The event handler.
   * @returns {nwayo.core.services.Builder.drivers.Driver} The current driver instance.
   */


  on(eventName, handler) {
    this.event.on(eventName, (event, ...parameters) => {
      handler(...parameters);
    });
    return this;
  }
  /**
   * Register a start listener.
   *
   * @param {Function} handler - The handler function.
   * @returns {nwayo.core.services.Builder.drivers.Driver} The current driver instance.
   */


  onStart(handler) {
    return this.on(this.events.start, handler);
  }
  /**
   * Register a preparing listener.
   *
   * @param {Function} handler - The event handler.
   * @returns {nwayo.core.services.Builder.drivers.Driver} The current driver instance.
   */


  onPreparing(handler) {
    return this.on(this.events.preparing, handler);
  }
  /**
   * Register a prepared listener.
   *
   * @param {Function} handler - The event handler.
   * @returns {nwayo.core.services.Builder.drivers.Driver} The current driver instance.
   */


  onPrepared(handler) {
    return this.on(this.events.prepared, handler);
  }
  /**
   * Register a writing listener.
   *
   * @param {Function} handler - The event handler.
   * @returns {nwayo.core.services.Builder.drivers.Driver} The current driver instance.
   */


  onWriting(handler) {
    return this.on(this.events.writing, handler);
  }
  /**
   * Register a wrote listener.
   *
   * @param {Function} handler - The event handler.
   * @returns {nwayo.core.services.Builder.drivers.Driver} The current driver instance.
   */


  onWrote(handler) {
    return this.on(this.events.wrote, handler);
  }
  /**
   * Register a progress listener.
   *
   * @param {Function} handler - The event handler.
   * @returns {nwayo.core.services.Builder.drivers.Driver} The current driver instance.
   */


  onProgress(handler) {
    return this.on(this.events.progress, handler);
  }
  /**
   * Register a watch ready listener.
   *
   * @param {Function} handler - The event handler.
   * @returns {nwayo.core.services.Builder.drivers.Driver} The current driver instance.
   */


  onWatchReady(handler) {
    return this.on(this.events.watchReady, handler);
  }
  /**
   * Register a completed listener.
   *
   * @param {Function} handler - The event handler.
   * @returns {nwayo.core.services.Builder.drivers.Driver} The current driver instance.
   */


  onCompleted(handler) {
    return this.on(this.events.completed, handler);
  }
  /**
   * Register an error listener.
   *
   * @param {Function} handler - The event handler.
   * @returns {nwayo.core.services.Builder.drivers.Driver} The current driver instance.
   */


  onError(handler) {
    return this.on(this.events.error, handler);
  }
  /**
   * Add action to be run after build process.
   *
   * @param {Function} handler - The action to take during build process. Can be async.
   * @returns {nwayo.core.services.Builder.drivers.Driver} The current driver instance.
   */


  onAfterBuild(handler) {
    (0, _privateRegistry.default)(this.constructor).get('afterBuild').push(handler);
    return this;
  }
  /**
   * Add an entry in the configuration object.
   *
   * @param {string} type - The entry type.
   * @param {...*} parameters - The entry parameters.
   * @returns {Driver} The current driver instance.
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
   * Get global callback to be run on after build.
   * It will run all registered afterBuild callbacks.
   *
   * @returns {Function} The function to be run once the compiler has build assets.
   */


  getAfterBuild() {
    return async (...parameters) => {
      const afterBuild = (0, _privateRegistry.default)(this.constructor).get('afterBuild');

      for (const action of afterBuild) {
        await action(...parameters); // eslint-disable-line no-await-in-loop
      }
    };
  }
  /**
   * Get a dispatch handler for the given event name.
   *
   * @param {string} event - The event name.
   * @returns {Function} The dispatch handler.
   */


  getDispatchHandler(event) {
    if (!Object.prototype.hasOwnProperty.call(this.events, event)) {
      throw new TypeError(`Event [${event}] is not a nwayo builder event.`);
    }

    return (...parameters) => {
      this.event.emit(this.events[event], parameters);
    };
  }
  /**
   * Build configuration that can be run.
   *
   * @param {nwayo.core.services.BundleModel} bundle - The bundle model.
   * @returns {Promise<object>} The configuration object.
   * @async
   * @abstract
   */


  buildConfig(bundle) {
    // eslint-disable-line no-unused-vars
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
   * @param {object} [options] - The watch options object.
   * @returns {Promise} The async process promise.
   * @async
   * @abstract
   */


  watch(config, options) {
    // eslint-disable-line no-unused-vars
    throw new _ioc.NotImplementedError(this, 'watch', 'Promise');
  }
  /**
   * Event names that may be dispatched by driver.
   * For event key `foo`, the event name will be `nwayo.builder.foo`.
   *
   * @type {object<string, string>}
   */


  get events() {
    return Object.fromEntries(['start', 'preparing', 'prepared', 'progress', 'writing', 'wrote', 'afterBuild', 'watchReady', 'error', 'completed'].map(name => {
      return [name, `nwayo.builder.${name}`];
    }));
  }

}

var _default = Driver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;