"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

var _ScssHandler = _interopRequireDefault(require("./handlers/ScssHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo Extension - SCSS - Service provider
//--------------------------------------------------------

/**
 * SCSS extension service provider.
 *
 * @memberof nwayo.extension.scss
 * @augments ioc.foundation.ServiceProvider
 * @hideconstructor
 */
class ExtensionScssServiceProvider extends _ioc.ServiceProvider {
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
      this.app.make('nwayo').register(_ScssHandler.default);
    }
  }

}

var _default = ExtensionScssServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;