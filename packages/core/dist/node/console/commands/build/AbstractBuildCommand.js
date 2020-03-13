"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

var _Command = _interopRequireDefault(require("../../Command"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Console - Command - Build - Abstract Build
//--------------------------------------------------------

/**
 * Abstract build command that handles by calling <code>nwayo.build()</code> with the appropriate type.
 *
 * @memberof nwayo.core.console.commands.build
 * @augments ioc.console.Command
 * @hideconstructor
 * @abstract
 */
class AbstractBuildCommand extends _ioc.mixins.checksTypes(_Command.default) {
  /**
   * Class dependencies: <code>['helper.date', 'helper.string', 'nwayo', 'nwayo.builder', 'nwayo.build.type']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['helper.date', 'helper.string', 'nwayo', 'nwayo.builder', 'nwayo.build.type']);
  }
  /**
   * @inheritdoc
   */


  get policies() {
    return [`nwayo.build:${this.type}`];
  }
  /**
   * Build type name.
   * By default, it will use the class name to guess the type ID.
   *
   * @example
   * class BuildFooBarCommand extends AbstractBuildCommand {}
   * // Type ID => "FOO_BAR"
   * // Type name => app.make('nwayo.build.type').get('FOO_BAR'); => 'foo-bar'
   * app.make(BuildFooBarCommand).type; // 'foo-bar'
   *
   * @type {string}
   */


  get type() {
    const {
      name
    } = this.constructor;

    if (name && name !== AbstractBuildCommand.name) {
      const type = this.stringHelper.constant(name.replace(/^Build(?<type>[A-Z][A-Za-z]+)Command$/u, '$<type>'));

      if (this.nwayoBuildType.has(type)) {
        return this.nwayoBuildType.get(type);
      }
    }

    throw new _ioc.NotImplementedError(this, 'type', 'string', 'accessor');
  }
  /**
   * @inheritdoc
   */


  get name() {
    return `build:${this.type}`;
  }
  /**
   * @inheritdoc
   */


  get description() {
    return this.t(`commands.build-${this.type}.description`);
  }
  /**
   * @inheritdoc
   */


  get options() {
    return [['bundle', null, this.t('commands.build-abstract.options.bundle')]];
  }
  /**
   * @inheritdoc
   */


  async handle() {
    this.translationContext = {
      type: this.type
    };
    this.bindEventHandlers();
    this.terminal.spacer();

    try {
      await this.build();
    } finally {
      this.stopProgress(true);
    }
  }
  /**
   * Build the command type.
   *
   * @see {nwayo.core.commands.AbstractBuildCommand#type}
   * @returns {Promise} The async process promise.
   */


  async build() {
    const bundles = this.getBundles();
    this.progressCount = 0;
    const hasMultipleBundle = Array.isArray(bundles) && bundles.length > 0;
    this.log(this.t(`commands.build-abstract.messages.${hasMultipleBundle ? 'multiple' : 'all'}-bundles`, {
      bundles
    }));
    await this.nwayo.build(...this.getBuildArguments());
  }
  /**
   * Bind builder event handlers.
   *
   * @returns {nwayo.core.console.commands.build.AbstractBuildCommand} The current command instance.
   */


  bindEventHandlers() {
    Object.keys(this.nwayoBuilder.events).forEach(event => {
      const method = `on${this.stringHelper.pascal(event)}`;

      if (this.methodExists(method)) {
        this.nwayoBuilder[method](this[method].bind(this));
      }
    });
    return this;
  }
  /**
   * Get build type(s).
   *
   * @returns {string|Array<string>} The build type(s).
   */


  getBuildTypes() {
    return this.type;
  }
  /**
   * Get bundles to build.
   *
   * @returns {Array<string>|null} The bundles list.
   */


  getBundles() {
    const bundles = this.option('bundle');

    if (!bundles) {
      return null;
    }

    return bundles.split(',').map(bundle => {
      return bundle.trim();
    });
  }
  /**
   * Get nwayo.build() arguments.
   *
   * @returns {Array} The nwayo.build() arguments.
   */


  getBuildArguments() {
    return [this.getBuildTypes(), this.getBundles()];
  }
  /**
   * Handle "start" event.
   */


  onStart({
    bundleName: bundle
  } = {}) {
    this.info(this.t('commands.build-abstract.messages.start', {
      bundle
    }));
    this.startProgress();
  }
  /**
   * Handle "preparing" event.
   */


  onPreparing() {
    this.log(this.t('commands.build-abstract.messages.preparing'));
  }
  /**
   * Handle "prepared" event.
   */


  onPrepared() {
    this.log(this.t('commands.build-abstract.messages.prepared'));
  }
  /**
   * Handle "progress" event.
   *
   * @param {object} payload - The event payload.
   * @param {number} payload.percent - The completion percent, between 0 and 1.
   */


  onProgress({
    percent
  }) {
    if (this.progress) {
      this.progress.show(`${(percent * 100).toFixed(0)}%`, percent);
    }
  }
  /**
   * Handle "writing" event.
   */


  onWriting({
    path
  }) {
    this.write(this.terminal.chalk.blue(this.t('commands.build-abstract.messages.writing', {
      path
    })));
  }
  /**
   * Handle "wrote" event.
   *
   * @param {Array<string|Buffer>} payload - The event payload.
   * @param {string} payload.file - The wrote file path.
   */


  onWrote({
    path
  }) {
    this.success(this.t('commands.build-abstract.messages.wrote', {
      path
    }));
  }
  /**
   * Handle "watchReady" event.
   */


  onWatchReady() {
    this.stopProgress();

    if (!this.hasProgress()) {
      this.terminal.spacer();
      this.write(this.terminal.chalk.blue(this.t('commands.build-abstract.messages.watch-ready')));
      this.terminal.spacer();
    }
  }
  /**
   * Handle "completed" event.
   */


  onCompleted() {
    this.stopProgress();
    this.success(this.t('commands.build-abstract.messages.completed'));
  }
  /**
   * Handle "error" event.
   */


  onError({
    paths
  }) {
    paths.forEach(({
      path,
      message
    }) => {
      this.failure(this.t('commands.build-abstract.messages.error', {
        path
      }));
      super.write(message.split('\n').map(s => {
        return `${' '.repeat(4)}${s}`;
      }).join('\n'));
    });
    this.stopProgress();
  }
  /**
   * Start progress bar in console.
   */


  startProgress() {
    this.progressCount++;

    if (!this.progress) {
      this.app.make('terminal.interceptor').disable();
      this.progress = this.terminal.startProgress();
      this.progress.show('', 0);
      this.progressInterval = setInterval(() => {
        this.progress.pulse();
      }, 50);
    }
  }
  /**
   * Stop progress bar in console.
   *
   * @param {boolean} [force=false] - Indicates to force the progress bar removal, even if more than one progress is pending.
   */


  stopProgress(force = false) {
    this.progressCount--;

    if (!this.hasProgress()) {
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
      }

      if (this.progress) {
        this.progress.disable();
      }

      delete this.progress;
    } else if (force) {
      this.stopProgress(true);
    }
  }
  /**
   * Check if progress is displayed in CLI.
   *
   * @returns {boolean} Indicates that the progress is currently printed in CLI.
   */


  hasProgress() {
    return this.progressCount > 0;
  }
  /**
   * Print with write instead of terminal.writeln.
   *
   * @inheritdoc
   */


  print(level, ...parameters) {
    if (this.verbose >= level) {
      parameters.forEach(parameter => {
        this.write(this.prependLevel(level, parameter));
      });
    }
  }
  /**
   * Write with timestamp.
   *
   * @inheritdoc
   */


  write(...parameters) {
    return super.write(...this.batchPrependTimestamp(parameters));
  }
  /**
   * @inheritdoc
   */


  info(...parameters) {
    parameters.forEach(parameter => {
      this.write(this.terminal.chalk.blue(parameter));
    });
  }
  /**
   * @inheritdoc
   */


  success(...parameters) {
    parameters.forEach(parameter => {
      this.write(this.terminal.chalk.green(parameter));
    });
  }
  /**
   * @inheritdoc
   */


  failure(...parameters) {
    parameters.forEach(parameter => {
      this.write(this.terminal.chalk.red(parameter));
    });
  }
  /**
   * Prepend timestamps for all given parameters.
   *
   * @param {...string} parameters - The parameters to prepend timestamp on.
   * @returns {Array<string>} The mapped parameters.
   */


  batchPrependTimestamp(...parameters) {
    return parameters.map(parameter => {
      return this.prependTimestamp(parameter);
    });
  }
  /**
   * Prepend level name on the given parameter.
   *
   * @param {number} level - The level code.
   * @param {string} parameter - The parameter to prepend level on.
   * @returns {string} The mapped parameter.
   */


  prependLevel(level, parameter) {
    return `[${this.getLevelName(level).toUpperCase()}] ${parameter}`;
  }
  /**
   * Prepend formatted timestamp on the given parameter.
   *
   * @param {string} parameter - The parameter to prepend level on.
   * @returns {string} The mapped parameter.
   */


  prependTimestamp(parameter) {
    return `[${this.getTimestamp()}] ${parameter}`;
  }
  /**
   * Get level name based on level code.
   *
   * @param {number} level - The level code.
   * @returns {string} The level name.
   */


  getLevelName(level) {
    const levelNames = ['info', 'log', 'debug', 'spam'];
    return levelNames[level] || levelNames[0];
  }
  /**
   * Get current timestamps, properly formatted.
   *
   * @returns {string} The formatted timestamp.
   */


  getTimestamp() {
    return this.dateHelper().format('YYYY-MM-DD HH:mm:ss');
  }
  /**
   * Date helper.
   *
   * @type {ioc.support.helpers.DateHelper}
   */


  get dateHelper() {
    return this.helperDate;
  }
  /**
   * String helper.
   *
   * @type {ioc.support.helpers.StringHelper}
   */


  get stringHelper() {
    return this.helperString;
  }

}

var _default = AbstractBuildCommand;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;