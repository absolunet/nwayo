"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _friendlyErrorsWebpackPlugin = _interopRequireDefault(require("friendly-errors-webpack-plugin"));

var _Driver = _interopRequireDefault(require("./Driver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo Core - Services - Builder - Drivers - Abstract Webpack Driver
//--------------------------------------------------------

/**
 * Abstract driver that uses Webpack as builder engine.
 *
 * @memberof nwayo.core.services.Builder.drivers
 * @augments nwayo.core.services.Builder.drivers.Driver
 * @hideconstructor
 * @abstract
 */
class AbstractWebpackDriver extends _Driver.default {
  /**
   * Class dependencies: <code>['app', 'event', 'helper.path', 'nwayo.project']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['app', 'helper.path', 'nwayo.project']);
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    if (super.init) {
      super.init();
    }

    this.event.on(this.events.complete, this.getAfterBuild());
  }
  /**
   * @inheritdoc
   */


  async run(config) {
    const builder = this.getBuilder(config);
    await new Promise((resolve, reject) => {
      builder.run((error, stats) => {
        if (error || stats.hasErrors()) {
          const thrownError = error || new Error(stats.toJson().errors.map(statError => {
            return `[${statError}]`;
          }).join(', '));
          Object.defineProperty(thrownError, 'shouldRender', {
            value: false
          });
          this.event.emit(this.events.error, {
            error: thrownError,
            stats
          });
          reject(thrownError);
          return;
        }

        this.event.emit(this.events.completed, {
          stats
        });
        resolve();
      });
    });
  }
  /**
   * @inheritdoc
   */


  async watch(config, options) {
    const watchOptions = typeof options === 'object' && options ? options : undefined;
    const builder = this.getBuilder(config);
    const watchers = builder.compilers.map(compiler => {
      return compiler.watch(watchOptions, this.getDispatchHandler('watchReady'));
    });
    await this.waitForManualStop();
    watchers.forEach(watcher => {
      watcher.close();
    });
  }
  /**
   * Get a Webpack builder instance made from the given configuration object.
   *
   * @param {object|Array<object>} config - The Webpack configuration object.
   * @returns {webpack} The Webpack builder instance.
   */


  getBuilder(config) {
    const builder = this.webpack(this.formatConfig(config));
    const plugin = {
      name: 'nwayo'
    };
    Object.entries({
      compile: 'preparing',
      afterCompile: 'prepared',
      run: 'start',
      watchRun: 'start',
      emit: 'writing',
      assetEmitted: 'wrote',
      done: 'afterBuild'
    }).forEach(([hook, event]) => {
      const handler = this.getDispatchHandler(event);
      builder.compilers.forEach(compiler => {
        compiler.hooks[hook].tap(plugin, handler);
      });
    });
    builder.compilers.forEach(compiler => {
      const {
        taps
      } = compiler.hooks.invalid;
      const index = taps.findIndex(({
        name
      }) => {
        return name === 'FriendlyErrorsWebpackPlugin';
      });

      if (index > -1) {
        taps.splice(index, 1);
      }
    });
    this.enableProgress(builder);
    return builder;
  }
  /**
   * Overrides onStart hook to pass current bundle as argument.
   *
   * @inheritdoc
   */


  onStart(handler) {
    return super.onStart(([compiler]) => {
      const {
        bundle
      } = compiler.options.plugins.find(({
        name
      }) => {
        return name === 'nwayo';
      }) || {};
      return handler(bundle);
    });
  }
  /**
   * Overrides onPrepared hook to ensure prepared assets are real files.
   *
   * @inheritdoc
   */


  onPrepared(handler) {
    return super.onPrepared((...parameters) => {
      const [[{
        assets
      }]] = parameters;
      const hasRealFile = Object.keys(assets).some(name => {
        return /\.\w+$/u.test(name);
      });
      return hasRealFile ? handler(...parameters) : null;
    });
  }
  /**
   * Overrides onWriting hook to ensure writing assets are passed individually.
   *
   * @inheritdoc
   */


  onWriting(handler) {
    return super.onWriting(parameters => {
      parameters.forEach(({
        assets
      }) => {
        Object.keys(assets).forEach(originalPath => {
          const path = this.formatFilePath(originalPath.replace(/^\//u, ''));
          handler({
            path
          });
        });
      });
    });
  }
  /**
   * Overrides onWrote hook to ensure prepared assets is not mocked mix.js file.
   *
   * @inheritdoc
   */


  onWrote(handler) {
    return super.onWrote((...parameters) => {
      const [[originalPath, buffer], ...p] = parameters;
      const path = this.formatFilePath(originalPath.replace(/^\//u, ''));
      return handler({
        path,
        buffer
      }, ...p);
    });
  }
  /**
   * Handle errors properly.
   *
   * @inheritdoc
   */


  onError(handler) {
    return super.onError(({
      error,
      stats
    }) => {
      const getStatErrorResource = (s, compilation) => {
        const {
          stats: substats
        } = s;

        if (substats) {
          return substats.reduce((total, substat) => {
            return total.concat(getStatErrorResource(substat, compilation || substat.compilation)).filter(({
              path
            }, i, array) => {
              return array.slice(i + 1).every(({
                path: otherPath
              }) => {
                return path !== otherPath;
              });
            });
          }, []);
        }

        return (compilation || s.compilation).errors.map(compilationError => {
          const bundleFilePath = compilationError.origin.userRequest || compilationError.module.userRequest;
          const {
            message
          } = compilationError;
          return {
            path: this.formatFilePath(bundleFilePath),
            message
          };
        });
      };

      const paths = getStatErrorResource(stats);
      handler({
        error,
        paths
      });
    });
  }
  /**
   * Format configuration object.
   *
   * @param {object|Array<object>} webpackConfig - The Webpack configuration object or array.
   * @returns {Array<object>} The formatted configuration object.
   */


  formatConfig(webpackConfig) {
    return (Array.isArray(webpackConfig) ? webpackConfig : [webpackConfig]).map(config => {
      return { ...config,
        plugins: config.plugins.filter(plugin => {
          return !(plugin instanceof _friendlyErrorsWebpackPlugin.default);
        })
      };
    });
  }
  /**
   * Add nwayo plugin into the configuration object.
   *
   * @param {object} config - The configuration object.
   * @param {nwayo.core.services.BundleModel} bundle - The bundle model.
   * @returns {object} The configuration object.
   */


  addNwayoPlugin(config, bundle) {
    config.plugins.push({
      name: 'nwayo',
      bundle,
      apply: () => {} // eslint-disable-line no-empty-function

    });
    return config;
  }
  /**
   * Enable progress plugin for the given builder and config.
   *
   * @param {webpack} builder - The Webpack builder instance.
   * @returns {nwayo.core.services.Builder.drivers.Driver} The current driver instance.
   */


  enableProgress(builder) {
    new this.webpack.ProgressPlugin(percent => {
      this.event.emit(this.events.progress, {
        percent
      });
    }).apply(builder);
    return this;
  }
  /**
   * Wait for the user to manually stop the process.
   *
   * @returns {Promise} - The promise that the process asked for interruption.
   */


  async waitForManualStop() {
    await new Promise(resolve => {
      if (process.platform === 'win32') {
        const rl = require('readline').createInterface({
          // eslint-disable-line global-require
          input: process.stdin,
          output: process.stdout
        });

        rl.once('SIGINT', resolve);
      }

      process.once('SIGINT', resolve);
    });
  }
  /**
   * Format file path by assuming it it relative from the project root.
   *
   * @param {string} path - The file path.
   * @returns {string} The formatted file path.
   */


  formatFilePath(path) {
    const rootPath = this.nwayoProject.getRootPath();
    return this.pathHelper.relative(rootPath, this.pathHelper.resolve(rootPath, path));
  }
  /**
   * Webpack.
   *
   * @type {Function}
   */


  get webpack() {
    return require('webpack'); // eslint-disable-line global-require
  }
  /**
   * Webpack notifier plugin constructor.
   *
   * @type {WebpackNotifierPlugin}
   */


  get WebpackNotifier() {
    return require('webpack-notifier'); // eslint-disable-line global-require
  }
  /**
   * Path helper.
   *
   * @type {ioc.support.helpers.StringHelper}
   */


  get pathHelper() {
    return this.helperPath;
  }

}

var _default = AbstractWebpackDriver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;