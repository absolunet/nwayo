"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

var _LegacyCommand = _interopRequireDefault(require("../LegacyCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo - Command - InstallCommand
//--------------------------------------------------------

/**
 * InstallCommand.
 */
class InstallCommand extends _ioc.mixins.withTranslations(_LegacyCommand.default) {
  /**
   * @inheritdoc
   */
  get name() {
    return 'install';
  }
  /**
   * @inheritdoc
   */


  get description() {
    return this.t('commands.install.description', {
      type: this.t('deprecated').toUpperCase(),
      command: Object.keys(this.legacyCommandMapping).join('|')
    });
  }
  /**
   * @inheritdoc
   */


  get parameters() {
    return [['scope', true, null, this.t('commands.install.parameters.scope')]];
  }
  /**
   * @inheritdoc
   */


  get flags() {
    return [['force', this.t('commands.install.flags.force')]];
  }
  /**
   * @inheritdoc
   */


  async handle() {
    await super.handle();
    await this.runCommand();
  }
  /**
   * Run command based on deprecated command name.
   *
   * @returns {Promise} Call to execute in terminal.
   */


  async runCommand() {
    await this.call(this.getLegacyCommandName());
  }
  /**
   * Validate the command that will need to be call based on arguments from terminal.
   *
   * @throws {TypeError} - Indicates that the command scope is not supported.
   * @returns {string} The command to run based on arguments.
   */


  getLegacyCommandName() {
    const command = this.legacyCommandMapping[this.parameter('scope')];

    if (!command) {
      const commandMapping = Object.values(this.legacyCommandMapping).map(c => {
        return `"${c}"`;
      }).join(', ');
      throw new TypeError(this.t('messages.nonExistingCommand', {
        command: `: [${commandMapping}]`
      }));
    }

    return command;
  }
  /**
   * @inheritdoc
   */


  get deprecationNotice() {
    return this.t('messages.deprecatedCommand', {
      command: this.getLegacyCommandName()
    });
  }
  /**
   * Get legacy command mapping.
   *
   * @type {object}
   */


  get legacyCommandMapping() {
    return {
      workflow: this.installExtensionsCommand,
      vendors: this.installComponentsCommand
    };
  }
  /**
   * Workflow command to use.
   *
   * @type {string}
   */


  get installExtensionsCommand() {
    return 'install:extensions';
  }
  /**
   * Vendors command to use.
   *
   * @type {string}
   */


  get installComponentsCommand() {
    return 'install:components';
  }

}

var _default = InstallCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;