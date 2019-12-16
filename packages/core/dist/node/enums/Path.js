"use strict";

exports.default = void 0;

var _Enum = _interopRequireDefault(require("@absolunet/ioc/dist/node/support/Enum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- nwayo core - Enums - Path
//--------------------------------------------------------

/**
 * Path enum.
 *
 * @memberof nwayo.core.enums
 * @augments ioc.support.Enum
 * @hideconstructor
 */
class Path extends _Enum.default {
  /**
   * Class dependencies: <code>['app', 'nwayo.constant.package']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['app', 'nwayo.constant.package']);
  }
  /**
   * The package.json file name.
   *
   * @type {string}
   */


  get PACKAGE_JSON() {
    return this.nwayoConstantPackage.PACKAGE_JSON;
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

}

var _default = Path;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;