"use strict";

exports.default = void 0;

require("./mixins");

var _CoreServiceProvider = _interopRequireDefault(require("./CoreServiceProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo core
//--------------------------------------------------------
// Load mixins
// Load the main service provider
// Export the service provider to be registered by an IoC application.
var _default = _CoreServiceProvider.default;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;