"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

//--------------------------------------------------------
//-- Nwayo - Services - Dependency Manager - Drivers - Driver
//--------------------------------------------------------

/**
 * Abstract driver that describe dependency manager implementation.
 *
 * @memberof nwayo.cli.services.DependencyManager.drivers
 * @hideconstructor
 */
class Driver {
  /**
   * Class dependencies: <code>['app', 'file.system.async', 'folder', 'nwayo.constant.package', 'terminal']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['app', 'file.system.async', 'folder', 'nwayo.constant.package', 'terminal'];
  }
  /**
   * Install all packages.
   *
   * @returns {Promise} The async process promise.
   * @abstract
   * @async
   */


  install() {
    throw new _ioc.NotImplementedError(this, 'install', 'Promise');
  }
  /**
   * Add a single package by name, with an optional version, and install it.
   *
   * @param {string} packageName - The package name.
   * @param {string} [version] - The package specific version.
   * @returns {Promise} The async process promise.
   * @abstract
   * @async
   */


  add(packageName, version) {
    // eslint-disable-line no-unused-vars
    throw new _ioc.NotImplementedError(this, 'add', 'Promise');
  }
  /**
   * Update a given package by name, with an optional version, and install it.
   *
   * @param {string} packageName - The package name.
   * @param {string} [version] - The package specific version.
   * @returns {Promise} The async process promise.
   * @abstract
   * @async
   */


  update(packageName, version) {
    // eslint-disable-line no-unused-vars
    throw new _ioc.NotImplementedError(this, 'update', 'Promise');
  }
  /**
   * IRemove a single package.
   *
   * @param {string} packageName - The package name.
   * @returns {Promise} The async process promise.
   * @abstract
   * @async
   */


  remove(packageName) {
    // eslint-disable-line no-unused-vars
    throw new _ioc.NotImplementedError(this, 'remove', 'Promise');
  }
  /**
   * Run command through a spawn child process.
   *
   * @param {string} command - The command to run.
   * @returns {Promise} The async process promise.
   * @protected
   */


  async run(command) {
    const [binary, ...parameters] = command.split(' ');
    const {
      folder: cwd
    } = this;
    await this.terminal.spawn(binary, parameters, {
      cwd
    });
  }
  /**
   * Get all dependencies associated with their version.
   *
   * @returns {Promise<Object<string, string>>} The listed dependencies.
   */


  async all() {
    const {
      dependencies
    } = await this.loadPackageJson();
    return dependencies;
  }
  /**
   * Check if the given dependency is listed in the "package.json" file.
   *
   * @param {string} dependency - The dependency name.
   * @returns {Promise<boolean>} Indicates that the dependency is listed.
   */


  async has(dependency) {
    const dependencies = await this.all();
    return Object.prototype.hasOwnProperty.call(dependencies, dependency);
  }
  /**
   * Check if the given dependency is a local dependency.
   *
   * @param {string} dependency - The dependency name.
   * @returns {Promise<boolean>} Indicates that the dependency is local and must exist on the current machine.
   */


  isLocal(dependency) {
    return this.dependencyVersionMatchesRegex(dependency, this.localVersionRegex);
  }
  /**
   * Check if the given dependency is an external dependency.
   *
   * @param {string} dependency - The dependency name.
   * @returns {Promise<boolean>} Indicates that the dependency is external and must be downloaded.
   */


  isExternal(dependency) {
    return this.dependencyVersionMatchesRegex(dependency, this.externalVersionRegex);
  }
  /**
   * Add a dependency to the given version.
   *
   * @param {string} dependency - The dependency name.
   * @param {string} version - The dependency version.
   * @returns {Promise} The async process promise.
   */


  async add(dependency, version) {
    const packageJson = await this.loadPackageJson();
    packageJson.dependencies[dependency] = version;
    await this.savePackageJson(packageJson);
  }
  /**
   * Remove a given dependency.
   *
   * @param {string} dependency
   * @returns {Promise<void>}
   */


  async remove(dependency) {
    const packageJson = await this.loadPackageJson();
    delete packageJson.dependencies[dependency];
    await this.savePackageJson(packageJson);
  }
  /**
   * Clear all dependencies from the "package.json" file.
   *
   * @returns {Promise} The async process promise.
   */


  async clear() {
    const packageJson = await this.loadPackageJson();
    packageJson.dependencies = {};
    await this.savePackageJson(packageJson);
  }
  /**
   * Clear all local dependencies from the "package.json" file.
   *
   * @returns {Promise} The async process promise.
   */


  async clearLocal() {
    await this.clearByRegex(this.localVersionRegex);
  }
  /**
   * Clear all external dependencies from the "package.json" file.
   *
   * @returns {Promise} The async process promise.
   */


  async clearExternal() {
    await this.clearByRegex(this.externalVersionRegex);
  }
  /**
   * Clear all dependencies that version match the given regular expression.
   *
   * @param {RegExp} regex - The regular expression.
   * @returns {Promise} The async process promise.
   */


  async clearByRegex(regex) {
    const packageJson = await this.loadPackageJson();
    Object.entries(packageJson.dependencies).forEach(([name, version], i, dependencies) => {
      if (regex.test(version)) {
        delete dependencies[name];
      }
    });
    await this.savePackageJson(packageJson);
  }
  /**
   * Load "package.json" file data.
   *
   * @returns {Promise<object>} The "package.json" file data.
   */


  async loadPackageJson() {
    const packageJson = await this.fs.readJson(this.packageJsonPath);
    packageJson.dependencies = packageJson.dependencies || {};
    packageJson.devDependencies = packageJson.devDependencies || {};
    return packageJson;
  }
  /**
   * Save given "package.json" data in file.
   *
   * @param {object} packageJson - The "package.json" file data.
   * @returns {Promise} The async process promise.
   */


  async savePackageJson(packageJson) {
    if (Object.keys(packageJson.dependencies || {}).length === 0) {
      delete packageJson.dependencies;
    }

    if (Object.keys(packageJson.devDependencies || {}).length === 0) {
      delete packageJson.devDependencies;
    }

    await this.fs.writeJson(this.packageJsonPath, packageJson);
  }
  /**
   * Check if a given component version matches the given regular expression.
   *
   * @param {string} component - The component name.
   * @param {RegExp} regex - The regular expression.
   * @returns {Promise<boolean>} Indicates that the component version matches the given regular expression.
   */


  async dependencyVersionMatchesRegex(dependency, regex) {
    const dependencies = await this.all();

    if (!Object.prototype.hasOwnProperty.call(dependencies, dependency)) {
      return false;
    }

    return regex.test(dependencies[dependency]);
  }
  /**
   * The "package.json" file path from current folder.
   *
   * @type {string}
   */


  get packageJsonPath() {
    return this.app.formatPath(this.folder, this.nwayoConstantPackage.PACKAGE_JSON);
  }
  /**
   * Local identifier.
   *
   * @type {string}
   */


  get localIdentifier() {
    return 'file:';
  }
  /**
   * Local version regular expression.
   *
   * @type {RegExp}
   */


  get localVersionRegex() {
    return new RegExp(`^${this.localIdentifier}`, 'u');
  }
  /**
   * External version regular expression.
   *
   * @type {RegExp}
   */


  get externalVersionRegex() {
    return new RegExp(`^(?!${this.localIdentifier})`, 'u');
  }
  /**
   * Async file system.
   *
   * @type {ioc.file.system.async}
   */


  get fs() {
    return this.fileSystemAsync;
  }

}

var _default = Driver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;