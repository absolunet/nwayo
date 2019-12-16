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
	 * Class dependencies: <code>['app', 'nwayo.constant.package']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app', 'nwayo.constant.package']);
	}

	/**
	 * The package.json file name.
	 *
	 * @type {string}
	 */
	get PACKAGE_JSON() {
		return this.nwayoConstantPackage.PACKAGE_JSON;
	}

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
		return this.app.formatPath('dist', 'node');
	}

}


export default Path;
