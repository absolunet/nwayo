"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _yargs = _interopRequireDefault(require("yargs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Context of the current build.
 *
 * @memberof nwayo.api
 */
class Context {
  /**
   * Context constructor.
   *
   * @param {object} [argv=yargs.argv] - The CLI arguments. Will be the ones parsed by Yargs by default.
   */
  constructor(argv = _yargs.default.argv) {
    this.argv = argv;
    this.setBundle(null);
  }
  /**
   * Set current bundle being processed.
   *
   * @param {string|null} bundle - The bundle name.
   * @returns {nwayo.api.Context} The current Context instance.
   */


  setBundle(bundle) {
    this._bundle = bundle;
    return this;
  }
  /**
   * Nwayo arguments.
   *
   * @type {object}
   */


  get nwayo() {
    return (this.argv.env || {}).nwayo || {};
  }
  /**
   * Name of the bundles to be compiled.
   *
   * @type {Array<string>}
   */


  get bundles() {
    const {
      bundle = []
    } = this.nwayo;
    return Array.isArray(bundle) ? bundle : [bundle];
  }
  /**
   * Build types to be compiled.
   *
   * @type {Array<"scripts"|"styles"|"assets">}
   */


  get buildTypes() {
    const {
      type = []
    } = this.nwayo;
    return Array.isArray(type) ? type : [type];
  }
  /**
   * Indicates that the compiled bundles should be analyzed after the compile process.
   *
   * @type {boolean}
   */


  get shouldAnalyze() {
    return Boolean(this.nwayo.analyze);
  }
  /**
   * Current bundle being processed.
   *
   * @type {string|null}
   */


  get bundle() {
    return this._bundle;
  }

}

var _default = new Context();

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;