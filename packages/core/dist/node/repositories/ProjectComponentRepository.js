"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

//--------------------------------------------------------
//-- Nwayo Core - Repositories - Project Components Repository
//--------------------------------------------------------

/**
 * Repository that allows to get all available components in the current project.
 *
 * @memberof nwayo.core.repositories
 * @hideconstructor
 */
class ProjectComponentRepository {
  /**
   * Class dependencies: <code>['dependency', 'file.system.async', 'helper.path', 'nwayo.constant.package', 'nwayo.project']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['dependency', 'file.system.async', 'helper.path', 'nwayo.constant.package', 'nwayo.project'];
  }
  /**
   * Get all components fully qualified name in the current project,
   * associated with their relative path from the source folder.
   * It uses the "package.json" file to identify a component and its name.
   * It also handle duplicates by throwing an error.
   *
   * @returns {Promise<object<string, string>>} The list of all components.
   * @throws {Error} Indicates that there are at least two components sharing the same name.
   */


  async all() {
    const sourcePath = this.nwayoProject.getSourcePath();
    const componentsPath = this.nwayoProject.getComponentsPath();
    const files = await this.fs.scandir(componentsPath, 'file', {
      recursive: true,
      fullPath: true
    });
    const components = await Promise.all(files.filter(file => {
      return file.endsWith(`/${this.nwayoConstantPackage.PACKAGE_JSON}`);
    }).map(async file => {
      const {
        name
      } = await this.dependency.inFolder(this.pathHelper.dirname(file)).loadPackageJson();
      const componentPath = this.pathHelper.relative(sourcePath, this.pathHelper.dirname(file));
      return [name, componentPath];
    }));
    const duplicates = {};
    components.forEach((entry, i) => {
      const [name, path] = entry;

      if (duplicates[name]) {
        return;
      }

      const duplicateEntries = components.slice(i + 1).filter(([otherName]) => {
        return name === otherName;
      });

      if (duplicateEntries.length > 0) {
        duplicates[name] = [path, ...duplicateEntries.map(([, p]) => {
          return p;
        })];
      }
    });

    if (Object.keys(duplicates).length > 0) {
      const tab = ' '.repeat(2);
      const bullet = `\n${tab.repeat(2)} - `;
      throw new Error(`Local components duplication: \n${Object.entries(duplicates).map(([name, paths]) => {
        return `[${name}]:${bullet}${paths.join(bullet)}`;
      }).join('\n')}`);
    }

    return Object.fromEntries(components);
  }
  /**
   * Check it the component exists by fully qualified name.
   *
   * @param {string} name - The fully qualified component name.
   * @returns {Promise<boolean>} Indicates that the given component name exists in the current project.
   */


  async has(name) {
    const components = await this.all();
    return Object.prototype.hasOwnProperty.call(components, name);
  }
  /**
   * Path helper.
   *
   * @type {ioc.support.helpers.PathHelper}
   */


  get pathHelper() {
    return this.helperPath;
  }
  /**
   * Async file system.
   *
   * @type {ioc.file.system.Async}
   */


  get fs() {
    return this.fileSystemAsync;
  }

}

var _default = ProjectComponentRepository;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;