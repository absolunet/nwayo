"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Plugin = _interopRequireDefault(require("../Plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copy single file from current bundle to the destination folder.
 *
 * @function copyFile
 * @param {string} file - The file path from the current folder.
 * @param {string} [destination=file] - The destination file path from the destination folder.
 * @returns {nwayo.api.NwayoApi} The current NwayoApi instance.
 * @memberof nwayo.api.NwayoApi
 * @instance
 */

/**
 * Copy an entire directory from current bundle to the destination folder.
 *
 * @function copyDirectory
 * @param {string} directory - The directory path from the current folder.
 * @param {string} [destination=file] - The destination file path from the destination folder.
 * @returns {nwayo.api.NwayoApi} The current NwayoApi instance.
 * @memberof nwayo.api.NwayoApi
 * @instance
 */

/**
 * Copy an entire directory from current bundle to the destination folder,
 * and add imagemin optimization for every images (.jpe?g, .png, .gif, .svg).
 *
 * @function images
 * @param {string} directory - The directory path from the current folder.
 * @param {string} [destination=file] - The destination file path from the destination folder.
 * @param {object} [options={}] - The imagemin options.
 * @returns {nwayo.api.NwayoApi} The current NwayoApi instance.
 * @memberof nwayo.api.NwayoApi
 * @instance
 */

/**
 * Assets plugin.
 *
 * @memberof nwayo.api.plugins
 * @augments nwayo.api.Plugin
 */
class AssetsPlugin extends _Plugin.default {
  /**
   * @inheritdoc
   */
  get dependencies() {
    return ['laravel-mix-imagemin'];
  }
  /**
   * @inheritdoc
   */


  get type() {
    return 'assets';
  }
  /**
   * @inheritdoc
   */


  boot() {
    this.createMethod('copyFile', this._handleCopyFile.bind(this));
    this.createMethod('copyDirectory', this._handleCopyDirectory.bind(this));
    this.createMethod('images', this._handleImages.bind(this));
  }
  /**
   * Handle "copyFile" method.
   *
   * @see nwayo.api.NwayoApi#copyFile
   *
   * @param {string} file - The file path from the current folder.
   * @param {string} [destination=file] - The destination file path from the destination folder.
   * @private
   */


  _handleCopyFile(file, destination = file) {
    this.nwayoApi.withLaravelMix(laravelMix => {
      laravelMix.copy(this.nwayoApi.pathFromBundle(file), destination);
    });
  }
  /**
   * Handle "copyDirectory" method.
   *
   * @see nwayo.api.NwayoApi#copyDirectory
   *
   * @param {string} directory - The directory path from the current folder.
   * @param {string} [destination=file] - The destination file path from the destination folder.
   * @private
   */


  _handleCopyDirectory(directory, destination = directory) {
    this.nwayoApi.withLaravelMix(laravelMix => {
      laravelMix.copyDirectory(this.nwayoApi.pathFromBundle(directory), destination);
    });
  }
  /**
   * Handle "images" method.
   *
   * @see nwayo.api.NwayoApi#images
   *
   * @param {string} directory - The directory path from the current folder.
   * @param {string} [destination=file] - The destination file path from the destination folder.
   * @param {object} [options={}] - The imagemin options.
   * @private
   */


  _handleImages(directory, destination = directory, options = {}) {
    const copyOptions = {};
    const defaultImageOptions = {
      test: /\.(?:jpe?g|png|gif|svg)$/iu,
      pngquant: {},
      gigsicle: {},
      jpegtran: {},
      svgo: {}
    };
    const formattedOptions = { ...defaultImageOptions,
      ...options,
      pngquant: { ...defaultImageOptions.pngquant,
        ...(options.png || {}),
        ...(options.pngquant || {})
      },
      gifsicle: { ...defaultImageOptions.gifsicle,
        ...(options.gif || {}),
        ...(options.gifsicle || {})
      },
      jpegtran: { ...defaultImageOptions.jpegtran,
        ...(options.jpeg || {}),
        ...(options.jpegtran || {})
      },
      svgo: { ...defaultImageOptions.svgo,
        ...(options.svg || {}),
        ...(options.svgo || {})
      }
    };
    this.nwayoApi.withLaravelMix(laravelMix => {
      laravelMix.images({
        from: this.nwayoApi.pathFromBundle(directory),
        to: destination
      }, copyOptions, formattedOptions);
    });
  }

}

var _default = AssetsPlugin;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;