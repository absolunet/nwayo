"use strict";

exports.default = void 0;

var _ioc = require("@absolunet/ioc");

var _DependencyManager = _interopRequireDefault(require("./services/DependencyManager"));

var _ProjectService = _interopRequireDefault(require("./services/ProjectService"));

var _InstallComponentsCommand = _interopRequireDefault(require("./console/commands/install/InstallComponentsCommand"));

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
  }
  /**
   * @inheritdoc
   */


  boot() {
    this.loadCommands([_InstallComponentsCommand.default]);
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
    this.app.singleton('nwayo.project', _ProjectService.default);
  }

}

var _default = CoreServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;