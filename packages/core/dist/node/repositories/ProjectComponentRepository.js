"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

//--------------------------------------------------------
//-- Nwayo Core - Repositories - Project Components Repository
//--------------------------------------------------------
class ProjectComponentRepository {
  static get dependencies() {
    return ['dependency', 'file.system.async', 'helper.path', 'nwayo.constant.package', 'nwayo.project'];
  }

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

  async has(name) {
    const components = await this.all();
    return Object.prototype.hasOwnProperty.call(components, name);
  }

  get pathHelper() {
    return this.helperPath;
  }

  get fs() {
    return this.fileSystemAsync;
  }

}

var _default = ProjectComponentRepository;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;