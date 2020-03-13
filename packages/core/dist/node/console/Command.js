"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

//--------------------------------------------------------
//-- Nwayo Core - Console - Command
//--------------------------------------------------------

/**
 * Base core commands.
 *
 * @memberof nwayo.core.console.commands
 * @augments ioc.console.Command
 * @hideconstructor
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
   *@param {string} string - The string to translate.
   * @param {object<string, string>} [replacements] - The token replacements.
   * @param {number} [count] - The string count for pluralization.
   * @returns {string} The translated string.
   */


  t(string, replacements, count) {
    return this.translator.translate(string, { ...(this.translationContext || {}),
      ...(replacements || {})
    }, count);
  }

}

var _default = Command;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;