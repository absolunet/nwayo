"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

//--------------------------------------------------------
//-- Nwayo Core - Console - Command - Install - Install Components
//--------------------------------------------------------

/**
 * Command that installs components as node modules from the project source path.
 *
 * @memberof nwayo.core.console.commands.install
 * @augments ioc.console.Command
 * @hideconstructor
 */
class InstallComponentsCommand extends _ioc.Command {
  /**
   * Class dependencies: <code>['translator']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['translator'];
  }
  /**
   * @inheritdoc
   */


  get name() {
    return 'install:components';
  }
  /**
   * @inheritdoc
   */


  get description() {
    return 'Install components for the current project.';
  }
  /**
   * @inheritdoc
   */


  async handle() {
    this.terminal.box(this.t('Installing {{type}}', {
      type: this.t('components')
    }));
    await this.installComponents();
  }
  /**
   * Install project components.
   *
   * @returns {Promise} The async process promise.
   */


  async installComponents() {
    await this.app.make('dependency').inFolder(this.app.make('nwayo.project').getSourcePath()).install();
  }
  /**
   * Translate with the translator service.
   *
   * @param {...*} parameters - The translate parameters.
   * @returns {string} The translated value.
   */


  t(...parameters) {
    return this.translator.translate(...parameters);
  }

}

var _default = InstallComponentsCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;