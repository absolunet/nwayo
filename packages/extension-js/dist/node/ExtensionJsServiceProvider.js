"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

var _JavaScriptHandler = _interopRequireDefault(require("./handlers/JavaScriptHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo Extension - JS - Service Provider
//--------------------------------------------------------

/**
 * JavaScript extension service provider.
 *
 * @memberof nwayo.extension.js
 * @augments ioc.foundation.ServiceProvider
 * @hideconstructor
 */
class ExtensionJsServiceProvider extends _ioc.ServiceProvider {
  /**
   * @inheritdoc
   */
  register() {
    this.loadConfig(this.app.formatPath(__dirname, 'config'));
  }
  /**
   * @inheritdoc
   */


  boot() {
    if (this.app.isBound('nwayo')) {
      this.app.make('nwayo').register(_JavaScriptHandler.default);
    }
  }

}

var _default = ExtensionJsServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;