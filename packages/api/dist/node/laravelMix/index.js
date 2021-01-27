"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.factory = exports.builder = void 0;

var _LaravelMixBuilder = _interopRequireDefault(require("./LaravelMixBuilder"));

var _LaravelMixApiFactory = _interopRequireDefault(require("./LaravelMixApiFactory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const builder = new _LaravelMixBuilder.default();
exports.builder = builder;
const factory = new _LaravelMixApiFactory.default();
exports.factory = factory;