"use strict";

exports.default = void 0;

var _Kernel = _interopRequireDefault(require("../app/console/Kernel"));

var _Handler = _interopRequireDefault(require("../app/exceptions/Handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo - Bootstrap - Handlers
//--------------------------------------------------------
var _default = app => {
  // Define application kernel.
  app.singleton('kernel', _Kernel.default); // Define exception handler.

  app.singleton('exception.handler', _Handler.default);
};

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;