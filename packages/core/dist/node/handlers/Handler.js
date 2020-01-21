"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

//--------------------------------------------------------
//-- Nwayo Core - Handlers - Handler
//--------------------------------------------------------

/**
 * Abstract build handler.
 *
 * @memberof nwayo.core.handlers
 * @hideconstructor
 * @abstract
 */
class Handler {
  /**
   * Class dependencies: <code>['app', 'nwayo.build.type']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['app', 'nwayo.build.type'];
  }
  /**
   * Build types that handler should hook into.
   * By default, it returns the type property.
   *
   * @type {Array<string>}
   */


  get types() {
    return [this.type];
  }
  /**
   * Single build type that handler should hook into.
   * By default, the `types` accessor uses this accessor.
   * This accessor will never be used except inside the handler.
   *
   * @type {string}
   * @abstract
   */


  get type() {
    throw new _ioc.NotImplementedError(this, 'type', 'string', 'accessor');
  }

}

var _default = Handler;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;