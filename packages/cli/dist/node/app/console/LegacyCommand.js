"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

//--------------------------------------------------------
//-- Nwayo - Command - Legacy Command
//--------------------------------------------------------

/**
 * Legacy Command.
 */
class LegacyCommand extends _ioc.Command {
  /**
   * @inheritdoc
   */
  handle() {
    this.logDeprecationNotice();
    return super.handle();
  }
  /**
   * Log a warning for deprecation notice.
   */


  logDeprecationNotice() {
    this.warning(this.deprecationNotice);
  }
  /**
   * Throw not implemented error for deprecation notice.
   *
   * @type {string}
   * @abstract
   */


  get deprecationNotice() {
    throw new _ioc.NotImplementedError(this, 'deprecationNotice', 'string', 'accessor');
  }

}

var _default = LegacyCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;