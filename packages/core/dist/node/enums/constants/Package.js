"use strict";

exports.default = void 0;

var _Enum = _interopRequireDefault(require("@absolunet/ioc/dist/node/support/Enum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- nwayo core - Enums - Constants - Package
//--------------------------------------------------------

/**
 * Package enum.
 *
 * @memberof nwayo.core.enums
 * @augments ioc.support.Enum
 * @hideconstructor
 */
class Package extends _Enum.default {
  /**
   * The package.json file name.
   *
   * @type {string}
   */
  get PACKAGE_JSON() {
    return 'package.json';
  }
  /**
   * Local package identifier in a package.json.
   *
   * @type {string}
   */


  get LOCAL_IDENTIFIER() {
    return 'file:';
  }
  /**
   * The dependencies property name.
   *
   * @type {string}
   */


  get DEPENDENCIES() {
    return 'dependencies';
  }
  /**
   * The dev dependencies property name.
   *
   * @type {string}
   */


  get DEV_DEPENDENCIES() {
    return 'devDependencies';
  }
  /**
   * The name property name.
   *
   * @type {string}
   */


  get NAME() {
    return 'name';
  }
  /**
   * The version property name.
   *
   * @type {string}
   */


  get VERSION() {
    return 'version';
  }

}

var _default = Package;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;