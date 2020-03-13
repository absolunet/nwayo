"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Command = _interopRequireDefault(require("../../Command"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
class InstallComponentsCommand extends _Command.default {
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
    return this.t('commands.install-components.description');
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

}

var _default = InstallComponentsCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;