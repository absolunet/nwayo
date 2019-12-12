"use strict";

exports.default = void 0;

var _ioc = require("@absolunet/ioc");

//--------------------------------------------------------
//-- nwayo - Bootstrap - Mixins - withTranslations
//--------------------------------------------------------

/**
 * The withTranslations mixin.
 *
 * @class
 * @name WithTranslationsMixin
 * @memberof bootstrap.mixins
 * @hideconstructor
 */

/**
 * Mixin that adds translation features.
 *
 * @param {Function} SuperClass - The inherited class.
 * @returns {WithTranslationsMixin} The super class, augmented by the mixin.
 */
const withTranslations = SuperClass => {
  /**
   * The withTranslations mixin.
   */
  return class WithTranslationsMixin extends SuperClass {
    /**
     * Class dependencies: <code>['translator']</code>.
     *
     * @type {Array<string>}
     */
    static get dependencies() {
      return (super.dependencies || []).concat(['translator']);
    }
    /**
     * Translate with the translator service.
     *
     * @param {...*} parameters - The translate parameters.
     * @returns {string} The translated value.
     */


    t(...parameters) {
      return this.translator.translate(...parameters);
    }

  };
};

_ioc.mixins.add('withTranslations', withTranslations);

var _default = withTranslations;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;