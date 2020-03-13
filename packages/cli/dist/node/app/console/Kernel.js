"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

//--------------------------------------------------------
//-- Nwayo - Console - Kernel
//--------------------------------------------------------

/**
 * Application kernel that handle incoming CLI request.
 *
 * @memberof nwayo.cli.console
 * @augments ioc.foundation.console.Kernel
 * @hideconstructor
 */
class Kernel extends _ioc.ConsoleKernel {
  /**
   * @inheritdoc
   */
  async handle() {
    if (this.projectIsLegacy()) {
      await this.handleLegacy();
    } else {
      await super.handle();
    }
  }
  /**
   * Handle calls for legacy nwayo project.
   *
   * @returns {Promise} The async process promise.
   */


  handleLegacy() {
    return this.legacyHandler.handle();
  }
  /**
   * @inheritdoc
   */


  async beforeHandling() {
    await this.loadTranslations();
    this.registerCommands();
  }
  /**
   * Load translations to prevent async translations.
   *
   * @returns {Promise} The async process promise.
   */


  async loadTranslations() {
    await this.translator.loadTranslations();
  }
  /**
   * Register commands in the command registrar based on application command path.
   */


  registerCommands() {
    this.commandRegistrar.addFromFolder(this.app.commandPath());
  }
  /**
   * Check if current call is in legacy nwayo project.
   *
   * @returns {boolean} Indicates that the current project is a legacy nwayo project.
   */


  projectIsLegacy() {
    return this.context.projectIsLegacy();
  }
  /**
   * Context service.
   *
   * @type {nwayo.cli.services.ContextService}
   */


  get context() {
    return this.app.make('nwayo.context');
  }
  /**
   * Legacy handler.
   *
   * @type {nwayo.cli.handlers.LegacyHandler}
   */


  get legacyHandler() {
    return this.app.make('nwayo.legacy.handler');
  }
  /**
   * Translator service.
   *
   * @type {ioc.translation.services.Translator}
   */


  get translator() {
    return this.app.make('translator');
  }

}

var _default = Kernel;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;