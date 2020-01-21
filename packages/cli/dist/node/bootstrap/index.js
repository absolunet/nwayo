"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./mixins");

var _handlers = _interopRequireDefault(require("./handlers"));

var _lifecycle = _interopRequireDefault(require("./lifecycle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo - Bootstrap
//--------------------------------------------------------
var _default = async (app, shouldHandleRequest = true) => {
  // Use the application root folder as base path.
  // Since this file will be compiled into "dist/node", one level deeper than "src"
  // we must consider this path instead of the current one.
  app.useBasePath(app.formatPath(__dirname, '..', '..', '..')); // Use context of the module that required this file

  app.setContext(module.parent); // Bootstrap the main application handlers, which are the application kernel and the exception handler.

  (0, _handlers.default)(app); // Initialize the lifecycle and await for its termination.

  await (0, _lifecycle.default)(app, shouldHandleRequest);
};

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;