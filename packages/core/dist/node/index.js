"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AbstractBuildCommand", {
  enumerable: true,
  get: function () {
    return _AbstractBuildCommand.default;
  }
});
Object.defineProperty(exports, "Command", {
  enumerable: true,
  get: function () {
    return _Command.default;
  }
});
Object.defineProperty(exports, "Handler", {
  enumerable: true,
  get: function () {
    return _Handler.default;
  }
});
exports.default = void 0;

require("./mixins");

var _CoreServiceProvider = _interopRequireDefault(require("./CoreServiceProvider"));

var _AbstractBuildCommand = _interopRequireDefault(require("./console/commands/build/AbstractBuildCommand"));

var _Command = _interopRequireDefault(require("./console/Command"));

var _Handler = _interopRequireDefault(require("./handlers/Handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo Core
//--------------------------------------------------------
// Load mixins.
// Load the main service provider.
// Load abstract classes to be used by other extensions.
// Export the service provider to be registered by an IoC application.
var _default = _CoreServiceProvider.default; // Expose classes to be used by other extensions.

exports.default = _default;