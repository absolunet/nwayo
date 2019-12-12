"use strict";

exports.default = void 0;

//--------------------------------------------------------
//-- Nwayo - Handlers - Legacy Hander
//--------------------------------------------------------

/**
 * Handle Legacy Service.
 */
class LegacyHandler {
  /**
   * Class dependencies: <code>['app', 'file', 'helper.path', 'terminal']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['app', 'file', 'helper.path', 'terminal'];
  }
  /**
   * Handle calls for legacy nwayo project.
   *
   * @returns {Promise} The async process promise.
   */


  async handleLegacy() {
    const nwayoLegacyForward = this.forwardChildProcess();
    await new Promise((resolve, reject) => {
      nwayoLegacyForward.on('close', code => {
        if (code === 0 || code === 2 && this.terminal.argv.length === 0) {
          resolve();
        } else {
          reject(code);
        }
      });
    });
  }
  /**
   * Create the child process.
   *
   * @returns {spawn} The child process.
   */


  forwardChildProcess() {
    const {
      legacyNwayoPath
    } = this;
    const {
      bin: {
        nwayo: legacyNwayoBinPath
      }
    } = this.getLegacyNwayoPackage();
    return this.spawn('node', [this.app.formatPath(legacyNwayoPath, legacyNwayoBinPath), ...this.terminal.argv], {
      stdio: 'inherit'
    });
  }
  /**
   * Get legacy nwayo package.
   *
   * @returns {object} The object JSON from the package.json.
   */


  getLegacyNwayoPackage() {
    return this.file.load(this.app.formatPath(this.legacyNwayoPath, 'package.json'));
  }
  /**
   * Get legacy nwayo path.
   *
   * @type {string}
   */


  get legacyNwayoPath() {
    return this.helperPath.dirname(require.resolve('@absolunet/nwayo-cli'));
  }
  /**
   * Child process spawn.
   *
   * @type {spawn}
   */


  get spawn() {
    return require('child_process').spawn; // eslint-disable-line global-require
  }

}

var _default = LegacyHandler;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;