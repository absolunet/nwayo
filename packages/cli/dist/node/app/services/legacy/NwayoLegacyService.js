"use strict";

exports.default = void 0;

//--------------------------------------------------------
//-- Nwayo - Providers - Application Service Provider
//--------------------------------------------------------

/**
 * Check Legacy Service.
 */
class CheckLegacyService {
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
    if (this.projectIsCurrentlyInApp()) {
      return false;
    }

    const legacyFileName = 'nwayo.yaml';
    const hasNwayoYaml = this.projectFileExists(legacyFileName);

    if (hasNwayoYaml) {
      return Boolean(this.getLegacyFile(legacyFileName).legacy);
    }

    return false;
  }
  /**
   * Check if files or folders exists.
   *
   * @param {...string} segments - Files or folders to validate.
   * @returns {boolean} Indicates that the files or folders exists.
   */


  projectFileExists(...segments) {
    return this.file.exists(this.app.formatPath(this.currentDirectory, ...segments));
  }
  /**
   * Check if project is nwayo kat.
   *
   * @returns {boolean} Indicates that the project run as nwayo kat.
   */


  projectIsCurrentlyInApp() {
    return this.currentDirectory === this.app.basePath();
  }
  /**
   * Get legacy file.
   *
   * @param {...string} segments - The file name to load.
   * @returns {object} The object of the file.
   */


  getLegacyFile(...segments) {
    return this.file.load(this.app.formatPath(this.currentDirectory, ...segments));
  }
  /**
   * Get currect directory.
   *
   * @type {string}
   */


  get currentDirectory() {
    return process.cwd();
  }

}

var _default = CheckLegacyService;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;