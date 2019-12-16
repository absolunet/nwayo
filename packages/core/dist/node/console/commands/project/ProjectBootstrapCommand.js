"use strict";

exports.default = void 0;

var _ioc = require("@absolunet/ioc");

//--------------------------------------------------------
//-- Node IoC - Command - Project - Project Bootstrap Command
//--------------------------------------------------------

/**
 * ProjectBootstrapCommand.
 */
class ProjectBootstrapCommand extends _ioc.Command {
  /**
   * Class dependencies: <code>['file.system.async', 'nwayo.path.generic', 'nwayo.project', 'helper.path']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['file.system.async', 'nwayo.path.generic', 'nwayo.project', 'helper.path']);
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
    return 'Bootstrap all the project components into the package.json.';
  }
  /**
   * @inheritdoc
   */


  async handle() {
    this.info(`Bootstrapping local components into source's "package.json"...`);
    const components = await this.getComponentsMapping();
    await this.updateDependencies(components);
    this.success('Bootstrap completed!');
    this.info('To install components, please run "install:components" command.');
  }
  /**
   * Get all components of the current project, mapped as "package.json" dependency entries.
   *
   * @returns {Array<string>} A list of all relative paths to components.
   */


  async getComponentsMapping() {
    const sourcePath = this.nwayoProject.getSourcePath();
    const componentsPath = this.nwayoProject.getComponentsPath();
    const componentsRelativePath = this.pathHelper.relative(sourcePath, componentsPath);
    const files = await this.fs.scandir(componentsPath, 'file', {
      recursive: true
    });
    const components = await Promise.all(files.filter(file => {
      return file.endsWith(`/${this.genericPaths.PACKAGE_JSON}`);
    }).map(async file => {
      const fullPath = this.pathHelper.join(componentsPath, file);
      const packageJson = await this.fs.readJson(fullPath);
      const {
        name
      } = packageJson;
      const componentPath = this.pathHelper.join(componentsRelativePath, this.pathHelper.dirname(file));
      return [name, `file:${componentPath}`];
    }));
    return Object.fromEntries(components);
  }
  /**
   * Update dependencies in "package.json" by resetting local components.
   *
   * @param {object<string, string>} dependencies - A key-value pair that match component name to its path.
   * @returns {Promise} The async process promise.
   */


  async updateDependencies(dependencies) {
    const packageJsonPath = this.app.formatPath(this.nwayoProject.getSourcePath(), this.genericPaths.PACKAGE_JSON);
    const packageJson = await this.fs.readJson(packageJsonPath);
    const originalDependencies = Object.fromEntries(Object.entries(packageJson.dependencies || {}).filter(([, value]) => {
      return !value.startsWith('file');
    }));
    packageJson.dependencies = Object.assign(originalDependencies, dependencies);
    await this.fs.writeJson(packageJsonPath, packageJson, {
      space: 2
    });
  }
  /**
   * Path helper.
   *
   * @type {ioc.support.helpers.PathHelper}
   */


  get pathHelper() {
    return this.helperPath;
  }

  get fs() {
    return this.fileSystemAsync;
  }

  get genericPaths() {
    return this.nwayoPathGeneric;
  }

}

var _default = ProjectBootstrapCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;