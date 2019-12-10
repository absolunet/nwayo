//--------------------------------------------------------
//-- nwayo - Bootstrap - Mixins - withTranslations
//--------------------------------------------------------

import { mixins } from '@absolunet/ioc';


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
const withTranslations = (SuperClass) => {

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


mixins.add('withTranslations', withTranslations);


export default withTranslations;
