"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo Core - Services - Project Service
//--------------------------------------------------------

/**
 * @typedef {object} BundleModel
 * @property {string} bundlePath - Bundle absolute path.
 * @property {string} bundleName - Bundle name.
 * @property {string} outputPath - Resolved output path from bundle configuration.
 * @property {object} config - Bundle configuration parsed from .yaml files.
 * @property {Array<nwayo.core.services.BundleFileModel>} files - Bundle files.
 * @memberof nwayo.core.services
 */

/**
 * @typedef {object} BundleFileModel
 * @property {string} localPath - Relative file path from its bundle.
 * @property {string} name - File name.
 * @property {string} path - File absolute path.
 * @memberof nwayo.core.services
 */

/**
 * Service that exposes project information and meta-data.
 *
 * @memberof nwayo.core.services
 * @hideconstructor
 */
class ProjectService {
  /**
   * Class dependencies: <code>['app', 'file', 'helper.path']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['app', 'file', 'helper.path'];
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    (0, _privateRegistry.default)(this).set('namespaces', []);
    this.addComponentNamespace('@nwayo/component-');
    this.addComponentNamespace('@nwayo-components/');
  }
  /**
   * Add a component namespace for external packages as components.
   * If the namespace is a NPM scope, such as "@foo" for "@foo/my-component, "@foo/" should be given as argument.
   * If the namespace is a standardized prefix, such as "foo-" for "foo-my-component", "foo-" should be given as argument.
   * Either way, a simple interpolation will be done with the namespace and the component name.
   *
   * @param {string} namespace - The component namespace.
   * @returns {nwayo.core.services.ProjectService} The current project service instance.
   */


  addComponentNamespace(namespace) {
    (0, _privateRegistry.default)(this).get('namespaces').push(namespace);
    return this;
  }
  /**
   * Get project root path.
   *
   * @returns {string} The project root path.
   */


  getRootPath() {
    return process.cwd();
  }
  /**
   * Get project source path.
   *
   * @returns {string} The project source path.
   */


  getSourcePath() {
    return this.pathHelper.join(this.getRootPath(), 'src');
  }
  /**
   * Get project's components path.
   *
   * @returns {string} The project's components path.
   */


  getComponentsPath() {
    return this.pathHelper.join(this.getSourcePath(), 'components');
  }
  /**
   * Get project's single component path by name.
   *
   * @param {string} component - The component name.
   * @returns {string} The component path.
   */


  getComponentPath(component) {
    for (const namespace of (0, _privateRegistry.default)(this).get('namespaces')) {
      const componentPath = this.pathHelper.join(this.getSourcePath(), 'node_modules', `${namespace}${component}`);

      if (this.file.exists(componentPath)) {
        return componentPath;
      }
    }

    return this.pathHelper.join(this.getComponentsPath(), component);
  }
  /**
   * Get project's bundles path.
   *
   * @returns {string} The project's bundles path.
   */


  getBundlesPath() {
    return this.pathHelper.join(this.getSourcePath(), 'bundles');
  }
  /**
   * Get project's single bundle path.
   *
   * @param {string} bundle - The bundle name.
   * @returns {string} The bundle path.
   */


  getBundlePath(bundle) {
    return this.pathHelper.join(this.getBundlesPath(), bundle);
  }
  /**
   * Get all bundles name.
   *
   * @returns {Array<string>} The bundles name.
   */


  getBundles() {
    return this.file.scandir(this.getBundlesPath(), 'dir');
  }
  /**
   * Load bundle data from a bundle name.
   *
   * @param {string} bundleName - The bundle name.
   * @returns {object} The bundle data.
   */


  loadBundleData(bundleName) {
    const bundlePath = this.getBundlePath(bundleName);

    if (!this.file.exists(bundlePath)) {
      throw new TypeError(`Bundle [${bundleName}] does not exists (resolved path: [${bundlePath}]).`);
    }

    const configFolder = 'config';
    const config = this.file.loadRecursivelyInFolder(this.app.formatPath(bundlePath, configFolder));
    const outputPath = this.app.formatPath(bundlePath, config.bundle.output);
    const files = this.file.scandir(bundlePath, 'file', {
      recursive: true
    }).filter(filePath => {
      const formattedFilePath = this.app.formatPath(filePath);
      return !formattedFilePath.startsWith(configFolder) && !/\/_[\w\-.]+$/iu.test(formattedFilePath.replace(/^(?<first>[^/])/u, '/$<first>'));
    }).map(file => {
      return {
        localPath: file,
        name: this.pathHelper.basename(file),
        path: this.app.formatPath(bundlePath, file)
      };
    });
    return {
      bundlePath,
      bundleName,
      outputPath,
      config,
      files
    };
  }
  /**
   * Path helper.
   *
   * @type {ioc.support.helpers.PathHelper}
   */


  get pathHelper() {
    return this.helperPath;
  }

}

var _default = ProjectService;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;