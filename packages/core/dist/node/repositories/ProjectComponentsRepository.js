"use strict";

exports.default = void 0;

//--------------------------------------------------------
//-- nwayo core - Repositories - Project Dependency Repository
//--------------------------------------------------------
class ProjectDependencyRepository {
  static get dependencies() {
    return ['nwayo.project.path'];
  }

  async all() {
    const {
      dependencies
    } = await this.loadPackageJson();
    return dependencies;
  }

  async has(dependency) {
    const dependencies = await this.all();
    return Object.prototype.hasOwnProperty.call(dependencies, dependency);
  }

  isLocal(dependency) {
    return this.dependencyVersionMatchesRegex(dependency, /^file:/u);
  }

  isExternal(dependency) {
    return this.dependencyVersionMatchesRegex(dependency, /^(?!file:)/u);
  }

  async add(dependency, version) {
    const packageJson = await this.loadPackageJson();
    packageJson.dependencies[dependency] = version;
    await this.savePackageJson(packageJson);
  }

  async remove(dependency) {
    const packageJson = await this.loadPackageJson();
    delete packageJson.dependencies[dependency];
  }

  clearLocal() {}

  clearExternal() {}

  loadPackageJson() {}

  savePackageJson(content) {}

  async dependencyVersionMatchesRegex(dependency, regex) {
    const dependencies = await this.all();

    if (!Object.prototype.hasOwnProperty.call(dependencies, dependency)) {
      return false;
    }

    return regex.test(dependencies[dependency]);
  }

}

var _default = ProjectDependencyRepository;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;