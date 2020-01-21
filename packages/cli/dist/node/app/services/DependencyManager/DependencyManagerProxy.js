"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

//--------------------------------------------------------
//-- Nwayo - Services - Dependency Manager Proxy
//--------------------------------------------------------

/**
 * Dependency manager forward proxy.
 *
 * @memberof nwayo.core.services
 * @augments ioc.console.Command
 */
class DependencyManagerProxy extends _ioc.ForwardProxy {}

var _default = DependencyManagerProxy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;