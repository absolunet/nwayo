"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractBuildCommand = _interopRequireDefault(require("./AbstractBuildCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Console - Command - Build - Build All
//--------------------------------------------------------

/**
 * Command that run all build types.
 *
 * @memberof nwayo.core.console.commands.build
 * @augments nwayo.core.console.commands.build.AbstractBuildCommand
 * @hideconstructor
 */
class BuildAllCommand extends _AbstractBuildCommand.default {
  /**
   * @inheritdoc
   */
  get policies() {
    return [];
  }
  /**
   * @inheritdoc
   */


  get description() {
    return 'Run all build commands.';
  }

}

var _default = BuildAllCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;