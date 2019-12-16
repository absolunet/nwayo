"use strict";

exports.default = void 0;

var _ioc = require("@absolunet/ioc");

var _DependencyManager = _interopRequireDefault(require("./services/DependencyManager"));

var _ProjectPathService = _interopRequireDefault(require("./services/ProjectPathService"));

var _Package = _interopRequireDefault(require("./enums/constants/Package"));

var _Path = _interopRequireDefault(require("./enums/constants/Path"));

var _Project = _interopRequireDefault(require("./enums/constants/Project"));

var _InstallComponentsCommand = _interopRequireDefault(require("./console/commands/install/InstallComponentsCommand"));

var _ProjectBootstrapCommand = _interopRequireDefault(require("./console/commands/project/ProjectBootstrapCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo core - Extension service provider
//--------------------------------------------------------

/**
 * Core service provider.
 *
 * @memberof nwayo.core
 * @augments ioc.foundation.ServiceProvider
 * @hideconstructor
 */
class CoreServiceProvider extends _ioc.ServiceProvider {
  /**
   * @inheritdoc
   */
  register() {
    this.loadAndPublishConfig(this.app.formatPath(__dirname, 'config'));
    this.bindDependencyManager();
    this.bindProjectService();
    this.bindConstants();
  }
  /**
   * @inheritdoc
   */


  boot() {
    this.loadCommands([_InstallComponentsCommand.default, _ProjectBootstrapCommand.default]);
  }
  /**
   * Bind dependency manager.
   */


  bindDependencyManager() {
    this.app.singleton('dependency', _DependencyManager.default);
  }
  /**
   * Bind project service.
   */


  bindProjectService() {
    this.app.singleton('nwayo.project.path', _ProjectPathService.default);
  }
  /**
   * Bind constants.
   */


  bindConstants() {
    this.bindPackageConstants();
    this.bindPathConstants();
    this.bindProjectConstants();
  }
  /**
   * Bind package constant.
   */


  bindPackageConstants() {
    this.app.singleton('nwayo.constant.package', _Package.default);
  }
  /**
   * Bind path constants.
   */


  bindPathConstants() {
    this.app.singleton('nwayo.constant.path', _Path.default);
  }
  /**
   * Bind project constants.
   */


  bindProjectConstants() {
    this.app.singleton('nwayo.constant.project', _Project.default);
  }

}

var _default = CoreServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;