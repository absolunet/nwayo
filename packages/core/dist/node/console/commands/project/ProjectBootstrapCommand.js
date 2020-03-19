"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Command = _interopRequireDefault(require("../../Command"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo Core - Console - Command - Project - Project Bootstrap
//--------------------------------------------------------

/**
 * Command that bootstrap components into source code's package manager.
 *
 * @memberof nwayo.core.console.commands.project
 * @augments nwayo.core.console.Command
 */
class ProjectBootstrapCommand extends _Command.default {
  /**
   * Class dependencies: <code>['nwayo.project', 'dependency', 'nwayo.project.component']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['nwayo.project', 'dependency', 'nwayo.project.component']);
  }
  /**
   * @inheritdoc
   */


  get name() {
    return 'project:bootstrap';
  }
  /**
   * @inheritdoc
   */


  get description() {
    return this.t('commands.project-bootstrap.description');
  }
  /**
   * @inheritdoc
   */


  get flags() {
    return [['install', this.t('commands.project-bootstrap.flags.install')]];
  }
  /**
   * @inheritdoc
   */


  async handle() {
    this.info(this.t('commands.project-bootstrap.messages.start'));
    await this.refreshComponents();
    this.success(this.t('commands.project-bootstrap.messages.completed'));
    await this.handleInstallation();
  }
  /**
   * Refresh components in source's package.json.
   *
   * @returns {Promise} The async process promise.
   */


  async refreshComponents() {
    const components = await this.nwayoProjectComponent.all();
    const dependencyManager = this.dependency.inFolder(this.nwayoProject.getSourcePath());
    await dependencyManager.clearLocal();
    await dependencyManager.saveMultipleLocal(components);
  }
  /**
   * Handle component installation, by either installing components or by indicating the next steps.
   *
   * @returns {Promise} The async process promise.
   */


  async handleInstallation() {
    const {
      installComponentsCommand
    } = this;

    if (this.flag('install')) {
      await this.call(installComponentsCommand);
    } else {
      this.info(this.t('commands.project-bootstrap.messages.manual', {
        command: installComponentsCommand
      }));
    }
  }
  /**
   * The command name that installs components.
   *
   * @type {string}
   */


  get installComponentsCommand() {
    return 'install:components';
  }

}

var _default = ProjectBootstrapCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;