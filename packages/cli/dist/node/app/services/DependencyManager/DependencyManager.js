"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

var _DependencyManagerProxy = _interopRequireDefault(require("./DependencyManagerProxy"));

var _NpmDriver = _interopRequireDefault(require("./drivers/NpmDriver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo - Services - Dependency Manager
//--------------------------------------------------------

/**
 * Dependency manager for external and local modules and packages.
 *
 * @memberof nwayo.cli.services
 * @augments ioc.support.mixins.HasDriver
 * @hideconstructor
 */
class DependencyManager extends _ioc.mixins.hasDriver() {
  /**
   * Class dependencies: <code>['app', 'config']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['config']);
  }
  /**
   * DependencyManager constructor.
   *
   * @param {...*} parameters -Injected parameters.
   * @returns {DependencyManager} The dependency manager instance wrapped by a proxy.
   */


  constructor(...parameters) {
    super(...parameters);
    return new Proxy(this, new _DependencyManagerProxy.default());
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    super.init();
    this.addDriver('npm', _NpmDriver.default);
    this.setDefaultDriver('npm');
  }
  /**
   * @inheritdoc
   */


  driver(driver = 'default', parameters = {}) {
    parameters.folder = parameters.folder || process.cwd();
    return super.driver(driver, parameters);
  }
  /**
   * Use dependency manager driver in specified folder.
   *
   * @param {string} folder - Absolute path to the folder.
   * @returns {nwayo.core.services.DependencyManager.drivers.Driver} The driver instance.
   */


  inFolder(folder) {
    return this.inFolderForDriver(folder, 'default');
  }
  /**
   * Use specific dependency manager driver in specified folder.
   *
   * @param {string} folder - Absolute path to the folder.
   * @param {string} driver - The driver name.
   * @returns {nwayo.core.services.DependencyManager.drivers.Driver} The driver instance.
   */


  inFolderForDriver(folder, driver) {
    return this.driver(driver, {
      folder
    });
  }
  /**
   * Get default driver for forward calls, with the current working directory as folder.
   *
   * @returns {nwayo.core.services.DependencyManager.drivers.Driver} The driver instance.
   */


  getForward() {
    return this.driver();
  }

}

var _default = DependencyManager;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;