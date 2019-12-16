"use strict";

exports.default = void 0;

//--------------------------------------------------------
//-- Nwayo core - Services - Project Path Service
//--------------------------------------------------------

/**
 * Service that exposes project information and meta-data.
 *
 * @memberof nwayo.core.services
 * @hideconstructor
 */
class ProjectPathService {
  /**
   * Class dependencies: <code>['helper.path']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['helper.path', 'nwayo.constant.misc'];
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
    return this.pathHelper.join(this.getRootPath(), this.genericPath.SOURCES);
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
      return require.resolve(`@nwayo-components/${component}`);
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
  /**
   * Generic path enum.
   *
   * @returns {nwayo.core.enums.Path}
   */


  get genericPath() {
    return this.nwayoPathGeneric;
  }

}

var _default = ProjectPathService;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;