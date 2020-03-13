"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

//--------------------------------------------------------
//-- Nwayo Core - Services - Terminal Decorator Proxy
//--------------------------------------------------------

/**
 * Terminal decorator proxy handler that forwards calls to the base terminal.
 *
 * @memberof nwayo.core.services
 * @augments ioc.support.proxies.ForwardProxy
 */
class TerminalDecoratorProxy extends _ioc.ForwardProxy {}

var _default = TerminalDecoratorProxy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;