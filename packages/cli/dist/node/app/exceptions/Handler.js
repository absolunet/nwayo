"use strict";

exports.default = void 0;

var _ioc = require("@absolunet/ioc");

//--------------------------------------------------------
//-- Nwayo - Exceptions - Handler
//--------------------------------------------------------

/**
 * Application exception handler.
 *
 * @memberof nwayo.cli.exceptions
 * @augments ioc.foundation.exceptions.Handler
 * @hideconstructor
 */
class Handler extends _ioc.ExceptionHandler {
  /**
   * Report an exception through the logger.
   *
   * @inheritdoc
   */
  async report(exception) {
    await super.report(exception);
  }
  /**
   * Render an exception through an HTTP response.
   *
   * @inheritdoc
   */


  async renderResponse(exception, request, response) {
    await super.renderResponse(exception, request, response);
  }
  /**
   * Render an exception through a console message.
   *
   * @inheritdoc
   */


  async renderConsole(exception) {
    await super.renderConsole(exception);
  }

}

var _default = Handler;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;