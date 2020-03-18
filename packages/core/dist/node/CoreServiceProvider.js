"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

var _ProjectService = _interopRequireDefault(require("./services/ProjectService"));

var _Nwayo = _interopRequireDefault(require("./services/Nwayo"));

var _Builder = _interopRequireDefault(require("./services/Builder"));

var _BuildTypeRepository = _interopRequireDefault(require("./repositories/BuildTypeRepository"));

var _NwayoBuildPolicy = _interopRequireDefault(require("./policies/NwayoBuildPolicy"));

var _TerminalDecorator = _interopRequireDefault(require("./services/TerminalDecorator"));

var _InstallComponentsCommand = _interopRequireDefault(require("./console/commands/install/InstallComponentsCommand"));

var _BuildAllCommand = _interopRequireDefault(require("./console/commands/build/BuildAllCommand"));

var _BuildWatchCommand = _interopRequireDefault(require("./console/commands/build/BuildWatchCommand"));

var _BuildScriptsCommand = _interopRequireDefault(require("./console/commands/build/BuildScriptsCommand"));

var _BuildStylesCommand = _interopRequireDefault(require("./console/commands/build/BuildStylesCommand"));

var _BuildAssetsCommand = _interopRequireDefault(require("./console/commands/build/BuildAssetsCommand"));

var _ProjectBootstrapCommand = _interopRequireDefault(require("./console/commands/project/ProjectBootstrapCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo Core - Service Provider
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
    this.loadAndPublishTranslations(this.app.formatPath(__dirname, 'resources', 'lang'));
    this.bindNwayo();
    this.bindBuildType();
    this.bindBuilder();
    this.bindProjectService();
    this.decorateTerminal();
  }
  /**
   * @inheritdoc
   */


  boot() {
    this.addDefaultBuildTypes();
    this.addBuildPolicies();
    this.loadCommands([_InstallComponentsCommand.default, _BuildAllCommand.default, _BuildWatchCommand.default, _BuildScriptsCommand.default, _BuildStylesCommand.default, _BuildAssetsCommand.default, _ProjectBootstrapCommand.default]);
  }
  /**
   * Bind nwayo orchestrator.
   */


  bindNwayo() {
    this.app.singleton('nwayo', _Nwayo.default);
  }
  /**
   * Bind builder.
   */


  bindBuilder() {
    this.app.singleton('nwayo.builder', _Builder.default);
  }
  /**
   * Bind project service.
   */


  bindProjectService() {
    this.app.singleton('nwayo.project', _ProjectService.default);
  }
  /**
   * Bind build type repository.
   */


  bindBuildType() {
    this.app.singleton('nwayo.build.type', _BuildTypeRepository.default);
  }
  /**
   * Add default buld types.
   */


  addDefaultBuildTypes() {
    this.app.make('nwayo.build.type').add('SCRIPTS', 'scripts').add('STYLES', 'styles').add('ASSETS', 'assets');
  }
  /**
   * Add build policies to prevent useless build commands to show up.
   */


  addBuildPolicies() {
    this.app.make('gate').register(_NwayoBuildPolicy.default);
  }
  /**
   * Decorate default terminal.
   */


  decorateTerminal() {
    this.app.decorate('terminal', terminal => {
      return new _TerminalDecorator.default(terminal);
    });
  }

}

var _default = CoreServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;