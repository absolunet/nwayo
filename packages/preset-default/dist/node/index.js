"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./mixins");

var _PresetDefaultServiceProvider = _interopRequireDefault(require("./PresetDefaultServiceProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo Preset - Default
//--------------------------------------------------------
// Load mixins.
// Load the main service provider.
// Export the service provider to be registered by an IoC application.
var _default = _PresetDefaultServiceProvider.default;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;