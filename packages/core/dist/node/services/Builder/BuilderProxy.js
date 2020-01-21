"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

//--------------------------------------------------------
//-- Nwayo Core - Services - Builder Proxy
//--------------------------------------------------------

/**
 * Builder proxy handler that forwards calls to the default driver.
 *
 * @memberof nwayo.core.services
 * @augments ioc.support.proxies.ForwardProxy
 */
class BuilderProxy extends _ioc.ForwardProxy {}

var _default = BuilderProxy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;