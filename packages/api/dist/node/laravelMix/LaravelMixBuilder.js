"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _context = _interopRequireDefault(require("../context"));

var _paths = _interopRequireDefault(require("../paths"));

var _laravelMixApiFactory = _interopRequireDefault(require("./laravelMixApiFactory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Laravel Mix builder.
 *
 * @memberof nwayo.api.laravelMix
 */
class LaravelMixBuilder {
  /**
   * Build the Webpack configuration object for the bundle.
   *
   * @param {{bundle: string}} options - The build options.
   * @param {string} options.bundle - The target bundle for which to generate the Webpack configuration object.
   * @returns {object} The built Webpack configuration object.
   */
  build({
    bundle
  }) {
    _context.default.setBundle(bundle);

    _laravelMixApiFactory.default.make(); // eslint-disable-next-line global-require


    require(_paths.default.bundleWebpackFile(_context.default.bundle));

    global.Mix.dispatch('init', global.Mix);
    const config = { ...this._getBuilderInstance().build(),
      name: _context.default.bundle
    };

    _context.default.setBundle(null);

    return config;
  }
  /**
   * Get the Webpack Config builder instance.
   *
   * @returns {WebpackConfig} A fresh Webpack Config builder instance.
   * @private
   */


  _getBuilderInstance() {
    const WebpackConfigBuilder = require('laravel-mix/src/builder/WebpackConfig'); // eslint-disable-line global-require


    return new WebpackConfigBuilder();
  }

}

var _default = LaravelMixBuilder;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;