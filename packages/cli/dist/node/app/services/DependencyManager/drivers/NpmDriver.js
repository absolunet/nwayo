"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Driver = _interopRequireDefault(require("./Driver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo - Services - Dependency Manager - Drivers - NPM Driver
//--------------------------------------------------------

/**
 * Driver that uses NPM as concrete dependency manager.
 *
 * @memberof nwayo.core.services.DependencyManager.drivers
 * @augments nwayo.core.services.DependencyManager.drivers.Driver
 * @hideconstructor
 */
class NpmDriver extends _Driver.default {
  /**
   * @inheritdoc
   */
  async install() {
    await this.run('npm install');
  }
  /**
   * @inheritdoc
   */


  async add(packageName, version) {
    await this.run(`npm install ${packageName}${version ? `@${version}` : ''}`);
  }
  /**
   * @inheritdoc
   */


  async remove(packageName) {
    await this.run(`npm uninstall ${packageName}`);
  }
  /**
   * @inheritdoc
   */


  async update(packageName, version) {
    if (version) {
      await this.remove(packageName);
      await this.add(packageName, version);
    } else {
      await this.run(`npm update ${packageName}`);
    }
  }

}

var _default = NpmDriver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;