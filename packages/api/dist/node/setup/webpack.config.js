"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _context = _interopRequireDefault(require("../context"));

var _laravelMix = require("../laravelMix");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const webpackConfig = _context.default.bundles.map(bundle => {
  return _laravelMix.builder.build({
    bundle
  });
}).filter(Boolean);

var _default = webpackConfig;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;