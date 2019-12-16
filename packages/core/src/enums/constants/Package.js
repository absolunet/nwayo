//--------------------------------------------------------
//-- nwayo core - Enums - Constants - Package
//--------------------------------------------------------

import Enum from '@absolunet/ioc/dist/node/support/Enum';


/**
 * Package enum.
 *
 * @memberof nwayo.core.enums
 * @augments ioc.support.Enum
 * @hideconstructor
 */
class Package extends Enum {

	/**
	 * The package.json file name.
	 *
	 * @type {string}
	 */
	get PACKAGE_JSON() {
		return 'package.json';
	}

	/**
	 * Local package identifier in a package.json.
	 *
	 * @type {string}
	 */
	get LOCAL_IDENTIFIER() {
		return 'file:';
	}

	/**
	 * The dependencies property name.
	 *
	 * @type {string}
	 */
	get DEPENDENCIES() {
		return 'dependencies';
	}

	/**
	 * The dev dependencies property name.
	 *
	 * @type {string}
	 */
	get DEV_DEPENDENCIES() {
		return 'devDependencies';
	}

	/**
	 * The name property name.
	 *
	 * @type {string}
	 */
	get NAME() {
		return 'name';
	}

	/**
	 * The version property name.
	 *
	 * @type {string}
	 */
	get VERSION() {
		return 'version';
	}

}


export default Package;
