"use strict";

exports.default = void 0;

var _ioc = require("@absolunet/ioc");

var _NwayoLegacyService = _interopRequireDefault(require("../services/legacy/NwayoLegacyService"));

var _LegacyHandler = _interopRequireDefault(require("../handlers/legacy/LegacyHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo - Providers - Application Service Provider
//--------------------------------------------------------

/**
 * Application service provider.
 *
 * @memberof nwayo.cli.providers
 * @augments ioc.foundation.ServiceProvider
 * @hideconstructor
 */
class AppServiceProvider extends _ioc.ServiceProvider {
  /**
   * @inheritdoc
   */
  get name() {
    return 'Nwayo - Application';
  }
  /**
   * Register the service provider.
   */


  register() {
    const cwd = process.cwd();

    if (cwd !== this.app.basePath()) {
      const nwayoPackageJson = this.app.make('file').load(this.app.formatPath(cwd, 'package.json'));
      const {
        dependencies = {}
      } = nwayoPackageJson || {};

      if (Object.prototype.hasOwnProperty.call(dependencies, '@nwayo/core')) {
        Object.keys(dependencies).forEach(extension => {
          this.app.register(this.app.formatPath(cwd, 'node_modules', extension));
        });
      }
    }

    this.bindNwayoLegacyService();
    this.bindNwayoLegacyHandler();
  }
  /**
   * Bind Nwayo Legacy Service singleton.
   */


  bindNwayoLegacyService() {
    this.app.singleton('nwayo.legacy', _NwayoLegacyService.default);
  }
  /**
   * Bind Legacy Handler singleton.
   */


  bindNwayoLegacyHandler() {
    this.app.singleton('nwayo.legacy.handler', _LegacyHandler.default);
  }

}

var _default = AppServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;