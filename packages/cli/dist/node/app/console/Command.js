"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

//--------------------------------------------------------
//-- Nwayo - Console - Command
//--------------------------------------------------------

/**
 * Base command class.
 *
 * @memberof nwayo.cli.console
 * @augments ioc.console.Command
 * @hideconstructor
 * @abstract
 */
class Command extends _ioc.Command {
  /**
   * Class dependencies: <code>['translator']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['translator'];
  }
  /**
   * Translate with the translator service.
   *
   * @param {...*} parameters - Translator's translate parameters.
   * @returns {string} The translated content.
   */


  t(...parameters) {
    return this.translator.translate(...parameters);
  }

}

var _default = Command;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;