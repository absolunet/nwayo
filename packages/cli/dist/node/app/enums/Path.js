"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Enum = _interopRequireDefault(require("@absolunet/ioc/dist/node/support/Enum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- nwayo core - Enums - Constant - Path
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
    return 'dist/node';
  }

}

var _default = Path;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;