"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractBuildCommand = _interopRequireDefault(require("./AbstractBuildCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Console - Command - Build - Build Watch
//--------------------------------------------------------

/**
 * Command that run all build types and watch for file changes to rebuild.
 *
 * @memberof nwayo.core.console.commands.build
 * @augments nwayo.core.console.commands.build.AbstractBuildCommand
 * @hideconstructor
 */
class BuildWatchCommand extends _AbstractBuildCommand.default {
  /**
   * @inheritdoc
   */
  get policies() {
    return [];
  }
  /**
   * @inheritdoc
   */


  get name() {
    return `build:${this.nwayoBuildType.WATCH}`;
  }
  /**
   * @inheritdoc
   */


  get description() {
    return 'Listen for changes on files and run appropriate build.';
  }
  /**
   * @inheritdoc
   */


  get options() {
    return (super.options || []).concat([['type', 'all', 'Specific build types to build.']]);
  }
  /**
   * Get the build type(s).
   *
   * @returns {string|Array<string>} The build type(s).
   */


  getBuildTypes() {
    const types = (this.option('type') || '').split(',').map(type => {
      return type.trim();
    }).filter(type => {
      return type !== this.nwayoBuildType.WATCH;
    });

    if (types.includes(this.nwayoBuildType.ALL)) {
      return this.nwayoBuildType.ALL;
    }

    return types;
  }
  /**
   * Get nwayo build arguments.
   *
   * @returns {Array<*>} The nwayo build arguments.
   */


  getBuildArguments() {
    const [, bundles, options = {}, ...parameters] = super.getBuildArguments();
    const watchOptions = Object.assign(typeof options === 'object' && options ? options : {}, {
      watch: true
    });
    return [this.nwayoBuildType.ALL, bundles, watchOptions, ...parameters];
  }

}

var _default = BuildWatchCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;