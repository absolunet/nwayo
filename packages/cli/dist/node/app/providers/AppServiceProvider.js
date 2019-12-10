"use strict";

exports.default = void 0;

var _ioc = require("@absolunet/ioc");

var _DependencyManager = _interopRequireDefault(require("../services/DependencyManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo - Providers - Application Service Provider
//--------------------------------------------------------

/**
 * Application service provider.
 *
 * @memberof nwayo.cli.providers
 * @augments ioc.foundation.ServiceProvider
 * @hideconstructor
 */
class AppServiceProvider extends _ioc.ServiceProvider {
  /**
   * @inheritdoc
   */
  get name() {
    return 'Nwayo - Application';
  }
  /**
   * Register the service provider.
   */


  register() {
    if (this.isInOtherFolder() && this.hasNodeModulesFolder()) {
      this.registerModulesFromPackageJson();
    }

    this.bindDependencyManager();
  }
  /**
   * Check if current working directory is located elsewhere than CLI folder.
   *
   * @returns {boolean} Indicates that the current working directory is not the CLI base path.
   */


  isInOtherFolder() {
    return this.getCurrentWorkingDirectory() !== this.app.basePath();
  }
  /**
   * Check if the "node_modules" folder can be found in the current working directory.
   *
   * @returns {boolean} Indicates that a "node_modules" folder exists in first level of the current working directory.
   */


  hasNodeModulesFolder() {
    return this.file.exists(this.getPathFromCwd('node_modules'));
  }
  /**
   * Register all modules marked as dependencies in the "package.json" in the current working directory.
   *
   * All those modules should be registrable as Node IoC service providers.
   */


  registerModulesFromPackageJson() {
    const nwayoPackageJson = this.file.load(this.getPathFromCwd('package.json'));
    const {
      dependencies = {}
    } = nwayoPackageJson || {};
    Object.keys(dependencies).forEach(extension => {
      this.app.register(this.getPathFromCwd('node_modules', extension));
    });
  }
  /**
   * Get path from the current working directory.
   *
   * @param {...string} pathSegments - The path segments.
   * @returns {string} The formatted path from the current working directory.
   */


  getPathFromCwd(...pathSegments) {
    return this.app.formatPath(process.cwd(), ...pathSegments);
  }
  /**
   * Get formatted current working directory.
   *
   * @returns {string} The formatted current working directory.
   */


  getCurrentWorkingDirectory() {
    return this.getPathFromCwd();
  }
  /**
   * Bind dependency manager.
   */


  bindDependencyManager() {
    this.app.singleton('dependency', _DependencyManager.default);
  }
  /**
   * File manager.
   *
   * @type {ioc.file.services.FileManager}
   */


  get file() {
    return this.app.make('file');
  }

}

var _default = AppServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;