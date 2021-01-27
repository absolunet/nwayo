"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Plugin = _interopRequireDefault(require("../Plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Add a JavaScript (\.js) file to be compiled.
 *
 * @function js
 * @param {string} file - The file path from the current folder.
 * @param {string} [destination=file] - The destination file path from the destination folder.
 * @returns {nwayo.api.NwayoApi} - The current NwayoApi instance.
 * @memberof nwayo.api.NwayoApi
 * @instance
 */

/**
 * Add a TypeScript (\.tsx?) file to be compiled.
 *
 * @function ts
 * @param {string} file - The file path from the current folder.
 * @param {string} [destination=file] - The destination file path from the destination folder.
 * @returns {nwayo.api.NwayoApi} - The current NwayoApi instance.
 * @memberof nwayo.api.NwayoApi
 * @instance
 */

/**
 * Add a JavaScript (.jsx?) file to be compiled, with JSX support for React.
 *
 * @function react
 * @param {string} file - The file path from the current folder.
 * @param {string} [destination=file] - The destination file path from the destination folder.
 * @returns {nwayo.api.NwayoApi} - The current NwayoApi instance.
 * @memberof nwayo.api.NwayoApi
 * @instance
 */

/**
 * Add a JavaScript (.jsx?) file to be compiled, with support for .vue files.
 *
 * @function vue
 * @param {string} file - The file path from the current folder.
 * @param {string} [destination=file] - The destination file path from the destination folder.
 * @returns {nwayo.api.NwayoApi} - The current NwayoApi instance.
 * @memberof nwayo.api.NwayoApi
 * @instance
 */

/**
 * Extract dependencies from the JavaScript files info a dedicated file.
 * This operation will create two distinct additional files:
 * <ul>
 * 		<li>scripts/manifest.js</li>
 * 		<li>scripts/dependencies.js</li>
 * </ul>
 * Both files must be loaded before the other JavaScript files.
 * The manifest contains Webpack utilities scripts and everything to properly retrieve the different modules, regardless of the file location.
 *
 * @see https://webpack.js.org/plugins/commons-chunk-plugin/
 *
 * @function dependencies
 * @param {Array<string>} [dependencies] - The dependencies list.
 * @param {string} [destination="scripts/dependencies.js"] - The destination file path from the destination folder.
 * @returns {nwayo.api.NwayoApi} - The current NwayoApi instance.
 * @memberof nwayo.api.NwayoApi
 * @instance
 */

/**
 * Add ESLint analysis during build process.
 *
 * @function eslint
 * @returns {nwayo.api.NwayoApi} - The current NwayoApi instance.
 * @memberof nwayo.api.NwayoApi
 * @instance
 */

/**
 * Scripts plugin.
 *
 * @memberof nwayo.api.plugins
 * @augments nwayo.api.Plugin
 */
class ScriptsPlugin extends _Plugin.default {
  /**
   * @inheritdoc
   */
  get dependencies() {
    return ['laravel-mix-eslint'];
  }
  /**
   * @inheritdoc
   */


  get type() {
    return 'scripts';
  }
  /**
   * @inheritdoc
   */


  boot() {
    this.createMethod('js', this._handleJavaScript.bind(this));
    this.createMethod('ts', this._handleTypeScript.bind(this));
    this.createMethod('react', this._handleReact.bind(this));
    this.createMethod('vue', this._handleVue.bind(this));
    this.createMethod('dependencies', this._handleDependencies.bind(this));
    this.createMethod('eslint', this._handleESLint.bind(this));
  }
  /**
   * Handle "js" method.
   *
   * @see nwayo.api.NwayoApi#js
   *
   * @param {string} file - The file path from the current folder.
   * @param {string} [destination=file] - The destination file path from the destination folder.
   * @private
   */


  _handleJavaScript(file, destination = file) {
    this.nwayoApi.withLaravelMix(laravelMix => {
      laravelMix.js(this.nwayoApi.pathFromBundle(file), destination);
    });
  }
  /**
   * Add a TypeScript (\.tsx?) file to be compiled.
   *
   * @see nwayo.api.NwayoApi#ts
   *
   * @param {string} file - The file path from the current folder.
   * @param {string} [destination=file] - The destination file path from the destination folder.
   * @private
   */


  _handleTypeScript(file, destination = file) {
    this.nwayoApi.withLaravelMix(laravelMix => {
      laravelMix.ts(this.nwayoApi.pathFromBundle(file), destination.replace(/\.tsx?$/u, '.js'));
    });
  }
  /**
   * Handle "react" method.
   *
   * @see nwayo.api.NwayoApi#react
   *
   * @param {string} file - The file path from the current folder.
   * @param {string} [destination=file] - The destination file path from the destination folder.
   * @private
   */


  _handleReact(file, destination = file) {
    this.nwayoApi.withLaravelMix(laravelMix => {
      laravelMix.react(this.nwayoApi.pathFromBundle(file), destination.replace(/\.jsx?$/u, '.js'));
    });
  }
  /**
   * Handle "vue" method.
   *
   * @see nwayo.api.NwayoApi#vue
   *
   * @param {string} file - The file path from the current folder.
   * @param {string} [destination=file] - The destination file path from the destination folder.
   * @private
   */


  _handleVue(file, destination = file) {
    this.nwayoApi.withLaravelMix(laravelMix => {
      laravelMix.vue(this.nwayoApi.pathFromBundle(file), destination);
    });
  }
  /**
   * Handle "dependencies" method.
   *
   * @see nwayo.api.NwayoApi#dependencies
   *
   * @param {Array<string>} [dependencies] - The dependencies list.
   * @param {string} [destination="scripts/dependencies.js"] - The destination file path from the destination folder.
   * @private
   */


  _handleDependencies(dependencies, destination = 'scripts/dependencies.js') {
    const parameters = dependencies ? [destination, dependencies] : [destination];
    this.nwayoApi.withLaravelMix(laravelMix => {
      laravelMix.extract(...parameters);
    });
  }
  /**
   * Add ESLint analysis during build process.
   *
   * @see nwayo.api.NwayoApi#eslint
   *
   * @private
   */


  _handleESLint() {
    this.nwayoApi.withLaravelMix(laravelMix => {
      laravelMix.eslint();
    });
  }

}

var _default = ScriptsPlugin;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;