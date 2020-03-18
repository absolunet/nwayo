//--------------------------------------------------------
//-- nwayo core - Enums - Constant - Path
//--------------------------------------------------------

import Enum from '@absolunet/ioc/dist/node/support/Enum';


/**
 * Path enum.
 *
 * @memberof nwayo.core.enums
 * @augments ioc.support.Enum
 * @hideconstructor
 */
class Path extends Enum {

	/**
	 * The node modules folder name.
	 *
	 * @type {string}
	 */
	get NODE_MODULES() {
		return 'node_modules';
	}

	/**
	 * The standardized sources folder name.
	 *
	 * @type {string}
	 */
	get SOURCES() {
		return 'src';
	}

	/**
	 * The standardized distribution folder name.
	 *
	 * @type {string}
	 */
	get DISTRIBUTION() {
		return 'dist/node';
	}

}


export default Path;
