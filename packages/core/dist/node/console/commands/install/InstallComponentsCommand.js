"use strict";

exports.default = void 0;

var _ioc = require("@absolunet/ioc");

//--------------------------------------------------------
//-- nwayo core - Console - Command - Install - Install Components Command
//--------------------------------------------------------

/**
 * Command that installs components as node modules from the project source path.
 *
 * @memberof nwayo.core.console.commands
 * @augments ioc.console.Command
 * @hideconstructor
 */
class InstallComponentsCommand extends _ioc.mixins.withTranslations(_ioc.Command) {
  /**
   * Class dependencies: <code>['dependency', 'nwayo.project', 'translator']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['dependency', 'nwayo.project']);
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
    await this.dependency.inFolder(this.nwayoProject.getSourcePath()).install();
  }

}

var _default = InstallComponentsCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;