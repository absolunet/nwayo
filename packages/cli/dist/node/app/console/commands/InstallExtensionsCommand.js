"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Command = _interopRequireDefault(require("../Command"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo - Console - Commands - Install Extension
//--------------------------------------------------------

/**
 * Command that installs extensions as node modules from the project root path.
 *
 * @memberof nwayo.cli.console.commands
 * @augments nwayo.cli.console.Command
 * @hideconstructor
 */
class InstallExtensionsCommand extends _Command.default {
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
    return this.t('commands.install-extensions.description');
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