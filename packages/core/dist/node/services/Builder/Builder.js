"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

var _BuilderProxy = _interopRequireDefault(require("./BuilderProxy"));

var _LaravelMixDriver = _interopRequireDefault(require("./drivers/LaravelMixDriver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo Core - Services - Builder
//--------------------------------------------------------

/**
 * File builder.
 *
 * @memberof nwayo.core.services
 * @augments ioc.support.drivers.HasDriver
 * @hideconstructor
 */
class Builder extends _ioc.mixins.hasDriver() {
  /**
   * Class dependencies: <code>['app', 'config']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['app', 'config']);
  }
  /**
   * Builder constructor.
   *
   * @param {...*} parameters -  The injected parameters.
   * @returns {nwayo.core.services.Builder.Builder} The builder instance wrapped by a proxy.
   */


  constructor(...parameters) {
    super(...parameters);
    return new Proxy(this, new _BuilderProxy.default());
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    super.init();
    this.addDriver('laravel-mix', _LaravelMixDriver.default);
  }
  /**
   * @inheritdoc
   */


  driver(name = 'default', ...parameters) {
    if (name === 'default') {
      return this.driver(this.config.get('nwayo.core.driver', 'laravel-mix'));
    }

    return super.driver(name, ...parameters);
  }
  /**
   * Make a new builder instance.
   *
   * @param {...*} parameters - The injected parameters.
   * @returns {nwayo.core.services.Builder} A new builder instance.
   */


  make(parameters) {
    return this.app.make(this.constructor, parameters);
  }
  /**
   * Get default driver for forward calls.
   *
   * @returns {nwayo.core.service.Builder.drivers.Driver} The default driver instance.
   */


  getForward() {
    return this.driver();
  }

}

var _default = Builder;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;