"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

var _DependencyManager = _interopRequireDefault(require("../services/DependencyManager"));

var _ContextService = _interopRequireDefault(require("../services/ContextService"));

var _LegacyHandler = _interopRequireDefault(require("../handlers/LegacyHandler"));

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
    this.bindDependencyManager();
    this.bindContextService();
    this.bindLegacyHandler();
    const context = this.app.make('nwayo.context');

    if (!context.isInCliFolder() && context.hasNodeModulesFolder()) {
      this.registerModulesFromPackageJson(context);
    }
  }
  /**
   * Register all modules marked as dependencies in the "package.json" in the current working directory.
   *
   * All those modules should be registrable as Node IoC service providers.
   *
   * @param {nwayo.cli.services.ContextService} context - The context service.
   */


  registerModulesFromPackageJson(context) {
    const nwayoPackageJson = context.loadProjectFile('package.json');
    const {
      dependencies = {}
    } = nwayoPackageJson || {};

    if (Object.prototype.hasOwnProperty.call(dependencies, '@nwayo/core')) {
      Object.keys(dependencies).forEach(extension => {
        if (extension !== '@nwayo/cli') {
          this.app.register(context.getPathFromCurrentDirectory('node_modules', extension));
        }
      });
    }
  }
  /**
   * Bind dependency manager.
   */


  bindDependencyManager() {
    this.app.singleton('dependency', _DependencyManager.default);
  }
  /**
   * Bind context service.
   */


  bindContextService() {
    this.app.singleton('nwayo.context', _ContextService.default);
  }
  /**
   * Bind legacy handler.
   */


  bindLegacyHandler() {
    this.app.singleton('nwayo.legacy.handler', _LegacyHandler.default);
  }

}

var _default = AppServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;