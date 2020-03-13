"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _gauge = _interopRequireDefault(require("gauge"));

var _TerminalDecoratorProxy = _interopRequireDefault(require("./TerminalDecoratorProxy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo Core - Services - Terminal Decorator
//--------------------------------------------------------

/**
 * Terminal decorator that adds progress support.
 *
 * @memberof nwayo.core.services
 * @hideconstructor
 */
class TerminalDecorator {
  /**
   * TerminalDecorator constructor.
   *
   * @param {ioc.console.services.Terminal} terminal - The original terminal.
   * @returns {TerminalDecorator} The terminal decorator wrapped by a proxy.
   */
  constructor(terminal) {
    this.terminal = terminal;
    return new Proxy(this, new _TerminalDecoratorProxy.default());
  }
  /**
   * Start progress gauge.
   *
   * @param {object} [options={}] - The gauge options.
   * @returns {Gauge} The gauge instance.
   */


  startProgress(options = {}) {
    return new _gauge.default(undefined, {
      updateInterval: 50,
      cleanupOnExit: false,
      ...options
    });
  }
  /**
   * @inheritdoc
   */


  getForward() {
    return this.terminal;
  }
  /**
   * Chalk package.
   *
   * @type {chalk}
   */


  get chalk() {
    return require('chalk'); // eslint-disable-line global-require
  }

}

var _default = TerminalDecorator;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;