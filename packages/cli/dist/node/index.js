"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

var _bootstrap = _interopRequireDefault(require("./bootstrap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo
//--------------------------------------------------------
// Import Node IoC application class.
// Import application bootstrapper.
// Create the application instance.
const app = _ioc.Application.getInstance(); // Bootstrap the application.


(0, _bootstrap.default)(app); // Expose the application.

var _default = app;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;