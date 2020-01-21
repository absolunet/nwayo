"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@nwayo/core");

//--------------------------------------------------------
//-- Nwayo Extension - JS - Handlers - JavaScript Handler
//--------------------------------------------------------

/**
 * JavaScript handler.
 *
 * @memberof nwayo.extension.js.handlers
 * @augments nwayo.core.handlers.Handler
 * @hideconstructor
 */
class JavaScriptHandler extends _core.Handler {
  /**
   * @inheritdoc
   */
  get type() {
    return this.nwayoBuildType.SCRIPTS;
  }
  /**
   * Process hook.
   *
   * @param {nwayo.core.services.Builder} builder - The builder.
   * @param {nwayo.core.BundleModel} bundle - The current bundle data.
   */


  process(builder, {
    files,
    outputPath
  }) {
    files.filter(file => {
      return /^scripts\/.*\.(?:vue|js)$/u.test(file.localPath);
    }).forEach(({
      localPath,
      path
    }) => {
      builder.addEntry('javascript', {
        source: path,
        destination: this.app.formatPath(outputPath, localPath).replace(/\.(?:vue|js)$/u, '.js')
      });
    });
  }

}

var _default = JavaScriptHandler;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;