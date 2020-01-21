"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractBuildCommand = _interopRequireDefault(require("./AbstractBuildCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Console - Command - Build - Build Assets
//--------------------------------------------------------

/**
 * Command that builds assets.
 *
 * @memberof nwayo.core.console.commands.build
 * @augments nwayo.core.console.commands.build.AbstractBuildCommand
 * @hideconstructor
 */
class BuildAssetsCommand extends _AbstractBuildCommand.default {}

var _default = BuildAssetsCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;