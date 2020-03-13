"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

//--------------------------------------------------------
//-- Nwayo - Context Service
//--------------------------------------------------------

/**
 * Context Service.
 *
 * @memberof nwayo.cli.services
 * @hideconstructor
 */
class ContextService {
  /**
   * Class dependencies: <code>['app', 'file']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['app', 'file'];
  }
  /**
   * Check if current call is in legacy nwayo project.
   *
   * @returns {boolean} Indicates that the current project is a legacy nwayo project.
   */


  projectIsLegacy() {
    if (this.isInCliFolder()) {
      return false;
    }

    const legacyFileName = 'nwayo.yaml';
    const hasNwayoYaml = this.projectFileExists(legacyFileName);

    if (hasNwayoYaml) {
      return Boolean(this.loadProjectFile(legacyFileName).legacy);
    }

    return false;
  }
  /**
   * Check if current working directory is located elsewhere than CLI folder.
   *
   * @returns {boolean} Indicates that the current working directory is not the CLI base path.
   */


  isInCliFolder() {
    return this.getCurrentWorkingDirectory() === this.app.basePath();
  }
  /**
   * Check if the "node_modules" folder can be found in the current working directory.
   *
   * @returns {boolean} Indicates that a "node_modules" folder exists in first level of the current working directory.
   */


  hasNodeModulesFolder() {
    return this.file.exists(this.getPathFromCurrentDirectory('node_modules'));
  }
  /**
   * Check if files or folders exists.
   *
   * @param {...string} segments - Files or folders to validate.
   * @returns {boolean} Indicates that the files or folders exists.
   */


  projectFileExists(...segments) {
    return this.file.exists(this.getPathFromCurrentDirectory(...segments));
  }
  /**
   * Load content of legacy project file.
   *
   * @param {...string} segments - The relative path segments from the project's directory.
   * @returns {object} The file content.
   */


  loadProjectFile(...segments) {
    return this.file.load(this.getPathFromCurrentDirectory(...segments));
  }
  /**
   * Get formatted current working directory.
   *
   * @returns {string} The formatted current working directory.
   */


  getCurrentWorkingDirectory() {
    return this.getPathFromCurrentDirectory();
  }
  /**
   * Get path from the current working directory.
   *
   * @param {...string} pathSegments - The path segments.
   * @returns {string} The formatted path from the current working directory.
   */


  getPathFromCurrentDirectory(...pathSegments) {
    return this.app.formatPath(this.currentDirectory, ...pathSegments);
  }
  /**
   * Currect directory.
   *
   * @type {string}
   */


  get currentDirectory() {
    return process.cwd();
  }

}

var _default = ContextService;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;