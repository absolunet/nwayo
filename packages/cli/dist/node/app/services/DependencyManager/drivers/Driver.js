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
 * @memberof nwayo.core.services.DependencyManager.drivers
 * @hideconstructor
 */
class Driver {
  /**
   * Class dependencies: <code>['folder', 'terminal.interceptor']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['folder', 'terminal.interceptor'];
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
    await new Promise((resolve, reject) => {
      require('child_process') // eslint-disable-line global-require
      .spawn(binary, parameters, {
        cwd: this.folder,
        stdio: 'inherit'
      }).on('close', code => {
        if (code === 0) {
          resolve();
        } else {
          reject(code);
        }
      });
    });
  }

}

var _default = Driver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;