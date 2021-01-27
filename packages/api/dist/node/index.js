"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Plugin", {
  enumerable: true,
  get: function () {
    return _Plugin.default;
  }
});
exports.default = void 0;

var _NwayoApi = _interopRequireDefault(require("./NwayoApi"));

var _Plugin = _interopRequireDefault(require("./Plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _NwayoApi.default.make();

exports.default = _default;