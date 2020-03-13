"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

var _Command = _interopRequireDefault(require("./Command"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo - Console - Legacy Command
//--------------------------------------------------------

/**
 * Legacy Command.
 *
 * @memberof nwayo.cli.console
 * @augments nwayo.cli.console.Command
 * @hideconstructor
 * @abstract
 */
class LegacyCommand extends _Command.default {
  /**
   * @inheritdoc
   */
  init() {
    const {
      description
    } = this;
    Object.defineProperty(this, 'description', {
      get() {
        return `[${this.t('deprecated').toUpperCase()}] ${description}`;
      }

    });
    super.init();
  }
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