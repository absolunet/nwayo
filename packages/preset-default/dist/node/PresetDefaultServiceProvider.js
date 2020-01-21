"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

var _core = _interopRequireDefault(require("@nwayo/core"));

var _extensionJs = _interopRequireDefault(require("@nwayo/extension-js"));

var _extensionScss = _interopRequireDefault(require("@nwayo/extension-scss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo Preset - Default - Preset Default Service Provider
//--------------------------------------------------------

/**
 * Preset default service provider.
 *
 * @memberof nwayo.core
 * @augments ioc.foundation.ServiceProvider
 * @hideconstructor
 */
class PresetDefaultServiceProvider extends _ioc.ServiceProvider {
  /**
   * @inheritdoc
   */
  register() {
    this.registerCore();
    this.registerExtensionJs();
    this.registerExtensionScss();
  }
  /**
   * Register core.
   */


  registerCore() {
    this.app.register(_core.default);
  }
  /**
   * Register JavaScript extension.
   */


  registerExtensionJs() {
    this.app.register(_extensionJs.default);
  }
  /**
   * Register SCSS extension.
   */


  registerExtensionScss() {
    this.app.register(_extensionScss.default);
  }

}

var _default = PresetDefaultServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;