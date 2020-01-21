"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _ioc = require("@absolunet/ioc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo Core - Repositories - Build Type Repository Proxy
//--------------------------------------------------------

/**
 * Build type repository proxy.
 *
 * @memberof nwayo.core.repositories
 * @augments ioc.support.proxy.BaseProxy
 */
class BuildTypeRepositoryProxy extends _ioc.BaseProxy {
  /**
   * @inheritdoc
   */
  get(object, property) {
    if (property.toUpperCase() === property && !(0, _privateRegistry.default)(this).get('has')(object, property)) {
      return object.get(property);
    }

    return super.get(object, property);
  }

}

var _default = BuildTypeRepositoryProxy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;