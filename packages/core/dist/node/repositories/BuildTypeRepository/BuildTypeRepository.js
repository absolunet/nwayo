"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _BuildTypeRepositoryProxy = _interopRequireDefault(require("./BuildTypeRepositoryProxy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Nwayo Core - Repositories - Build Type Repository
//--------------------------------------------------------

/**
 * Build type repository.
 *
 * @memberof nwayo.core.repositories
 * @hideconstructor
 */
class BuildTypeRepository {
  /**
   * Class dependencies: <code>['helper.string']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['helper.string'];
  }
  /**
   * All types.
   *
   * @type {string}
   */


  get ALL() {
    return 'all';
  }
  /**
   * Watch type.
   *
   * @type {string}
   */


  get WATCH() {
    return 'watch';
  }
  /**
   * BuildTypeRepository constructor.
   *
   * @returns {nwayo.core.repositories.BuildTypeRepository} The repository wrapped in a proxy.
   */


  constructor() {
    return new Proxy(this, new _BuildTypeRepositoryProxy.default());
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    (0, _privateRegistry.default)(this).set('types', {});
  }
  /**
   * Add new build type.
   *
   * @param {string} id - The unique type identifier.
   * @param {string} [label] - The type label.
   * @returns {nwayo.core.repositories.BuildTypeRepository} The current build type repository instance.
   */


  add(id, label) {
    if (/^[A-Z_]$/u.test(id)) {
      const suggestion = this.stringHelper.constant(id);
      throw new TypeError(`Build type ID [${id}] must be in upper-case and snake. Please try [${suggestion}].`);
    }

    if (this.has(id)) {
      throw new TypeError(`Build type [${id}] already exists.`);
    }

    (0, _privateRegistry.default)(this).get('types')[id] = label || this.stringHelper.slug(id);
    return this;
  }
  /**
   * Get all registered build types.
   *
   * @returns {object<string, string>} All registered build types.
   */


  all() {
    return { ...(0, _privateRegistry.default)(this).get('types')
    };
  }
  /**
   * Get build type label by ID.
   *
   * @param {string} id - The build type ID.
   * @returns {string|null} The build type label.
   */


  get(id) {
    if (this.stringHelper.constant(id) === id && Object.prototype.hasOwnProperty.call(this.constructor.prototype, id)) {
      return this[id];
    }

    return this.all()[id] || null;
  }
  /**
   * Check if the build type ID exists.
   *
   * @param {string} id - The build type ID.
   * @returns {boolean} Indicates that the build type exists.
   */


  has(id) {
    return Boolean(this.get(id));
  }
  /**
   * Get build type ID by label.
   *
   * @param {string} label - The build type label.
   * @returns {string|null} The build type ID.
   */


  getIdByLabel(label) {
    const constants = Object.getOwnPropertyNames(this.constructor.prototype).filter(name => {
      return this.stringHelper.constant(name) === name;
    }).map(name => {
      return [name, this[name]];
    });
    const [id = null] = constants.concat(Object.entries(this.all())).find(([, type]) => {
      return type === label;
    }) || [];
    return id;
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

var _default = BuildTypeRepository;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;