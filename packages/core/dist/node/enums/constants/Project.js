"use strict";

exports.default = void 0;

var _Enum = _interopRequireDefault(require("@absolunet/ioc/dist/node/support/Enum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- nwayo core - Enums - Constants - Project
//--------------------------------------------------------
class Project extends _Enum.default {
  /**
   * Class dependencies: <code>['helper.path', 'nwayo.constant.path']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['helper.path', 'nwayo.constant.path'];
  }
  /**
   * The components folder name.
   *
   * @type {string}
   */


  get COMPONENTS() {
    return 'components';
  }
  /**
   * The bundles folder name.
   *
   * @type {string}
   */


  get BUNDLES() {
    return 'bundles';
  }
  /**
   * The project root path.
   *
   * @returns {string} The project root path.
   */


  get ROOT_PATH() {
    return process.cwd();
  }
  /**
   * The project source path.
   *
   * @returns {string} The project source path.
   */


  get SOURCES_PATH() {
    return this.pathHelper.join(this.ROOT_PATH, this.nwayoConstantPath.SOURCES);
  }
  /**
   * The project's components path.
   *
   * @type {string}
   */


  get COMPONENTS_PATH() {
    return this.pathHelper.join(this.SOURCES_PATH, this.COMPONENTS);
  }
  /**
   * The project's bundles path.
   *
   * @type {string}
   */


  get BUNDLES_PATH() {
    return this.pathHelper.join(this.SOURCES_PATH, this.BUNDLES);
  }
  /**
   * Path helper.
   *
   * @type {ioc.support.helpers.PathHelper}
   */


  get pathHelper() {
    return this.helperPath;
  }

}

var _default = Project;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;