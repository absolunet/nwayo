"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@nwayo/core");

//--------------------------------------------------------
//-- Nwayo Extension - SCSS - Handlers - SCSS Handler
//--------------------------------------------------------

/**
 * SCSS Handler.
 *
 * @memberof nwayo.extension.scss.handlers
 * @augments nwayo.core.handlers.Handler
 * @hideconstructor
 */
class ScssHandler extends _core.Handler {
  /**
   * @inheritdoc
   */
  get type() {
    return this.nwayoBuildType.STYLES;
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
      return /^styles\/.*\.scss$/u.test(file.localPath);
    }).forEach(({
      localPath,
      path
    }) => {
      builder.addEntry('scss', {
        source: path,
        destination: this.app.formatPath(outputPath, localPath).replace(/\.scss$/u, '.css')
      });
    });
  }

}

var _default = ScssHandler;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;