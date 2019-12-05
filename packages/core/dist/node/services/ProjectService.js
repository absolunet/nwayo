"use strict";

exports.default = void 0;

//--------------------------------------------------------
//-- Nwayo core - Services - Project Service
//--------------------------------------------------------

/**
 * Service that exposes project information and meta-data.
 *
 * @memberof nwayo.core.services
 * @hideconstructor
 */
class ProjectService {
  /**
   * Class dependencies: <code>['helper.path']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['helper.path'];
  }
  /**
   * Get project root path.
   *
   * @returns {string} The project root path.
   */


  getRootPath() {
    return process.cwd();
  }
  /**
   * Get project source path.
   *
   * @returns {string} The project source path.
   */


  getSourcePath() {
    return this.pathHelper.join(this.getRootPath(), 'src');
  }
  /**
   * Get project's components path.
   *
   * @returns {string} The project's components path.
   */


  getComponentsPath() {
    return this.pathHelper.join(this.getSourcePath(), 'components');
  }
  /**
   * Get project's single component path by name.
   *
   * @param {string} component - The component name.
   * @returns {string} The component path.
   */


  getComponentPath(component) {
    try {
      return require.resolve(`@nwayo/${component}`);
    } catch (error) {
      return this.pathHelper.join(this.getComponentsPath(), component);
    }
  }
  /**
   * Get project's bundles path.
   *
   * @returns {string} The project's bundles path.
   */


  getBundlesPath() {
    return this.pathHelper.join(this.getSourcePath(), 'bundles');
  }
  /**
   * Get project's single bundle path.
   *
   * @param {string} bundle - The bundle name.
   * @returns {string} The bundle path.
   */


  getBundlePath(bundle) {
    return this.pathHelper.join(this.getBundlesPath(), bundle);
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

var _default = ProjectService;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;