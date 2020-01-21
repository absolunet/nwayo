"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

//--------------------------------------------------------
//-- Nwayo - Console - Command - Install Extension
//--------------------------------------------------------

/**
 * Command that installs extensions as node modules from the project root path.
 *
 * @memberof nwayo.core.console.commands
 * @augments ioc.console.Command
 * @hideconstructor
 */
class InstallExtensionsCommand extends _ioc.mixins.withTranslations(_ioc.Command) {
  /**
   * @inheritdoc
   */
  get name() {
    return 'install:extensions';
  }
  /**
   * @inheritdoc
   */


  get description() {
    return 'Install nwayo extensions for the current project.';
  }
  /**
   * @inheritdoc
   */


  async handle() {
    this.terminal.box(this.t('Installing {{type}}', {
      type: this.t('extensions')
    }));
    await this.installExtensions();
  }
  /**
   * Install project extensions.
   *
   * @returns {Promise} The async process promise.
   */


  async installExtensions() {
    await this.app.make('dependency').inFolder(process.cwd()).install();
  }

}

var _default = InstallExtensionsCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;