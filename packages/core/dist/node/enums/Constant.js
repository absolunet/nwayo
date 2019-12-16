"use strict";

exports.default = void 0;

var _Enum = _interopRequireDefault(require("@absolunet/ioc/dist/node/support/Enum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- nwayo core - Enums - Generic Path
//--------------------------------------------------------

/**
 * Generic path enum.
 *
 * @memberof nwayo.core.enums
 * @augments ioc.support.Enum
 * @hideconstructor
 */
class Constant extends _Enum.default {
  static get dependencies() {
    return (super.dependencies || []).concat(['app']);
  }
  /**
   * The package.json file name.
   *
   * @type {string}
   */


  get PACKAGE_JSON() {
    return 'package.json';
  }
  /**
   * The node modules folder name.
   *
   * @type {string}
   */


  get NODE_MODULES() {
    return 'node_modules';
  }
  /**
   * The standardized sources folder name.
   *
   * @type {string}
   */


  get SOURCES() {
    return 'src';
  }
  /**
   * The standardized distribution folder name.
   *
   * @type {string}
   */


  get DISTRIBUTION() {
    return this.app.formatPath('dist', 'node');
  }
  /**
   * Local package identifier in a package.json.
   *
   * @type {string}
   */


  get LOCAL_PACKAGE_IDENTIFIER() {
    return 'file:';
  }

}

var _default = Constant;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;