//--------------------------------------------------------
//-- nwayo core - Enums - Constants - Project
//--------------------------------------------------------

import Enum from '@absolunet/ioc/dist/node/support/Enum';


class Project extends Enum {

	/**
	 * Class dependencies: <code>['helper.path', 'nwayo.constant.path']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['helper.path', 'nwayo.constant.path'];
	}

	/**
	 * The components folder name.
	 *
	 * @type {string}
	 */
	get COMPONENTS() {
		return 'components';
	}

	/**
	 * The bundles folder name.
	 *
	 * @type {string}
	 */
	get BUNDLES() {
		return 'bundles';
	}

	/**
	 * The project root path.
	 *
	 * @returns {string} The project root path.
	 */
	get ROOT_PATH() {
		return process.cwd();
	}

	/**
	 * The project source path.
	 *
	 * @returns {string} The project source path.
	 */
	get SOURCES_PATH() {
		return this.pathHelper.join(this.ROOT_PATH, this.nwayoConstantPath.SOURCES);
	}

	/**
	 * The project's components path.
	 *
	 * @type {string}
	 */
	get COMPONENTS_PATH() {
		return this.pathHelper.join(this.SOURCES_PATH, this.COMPONENTS);
	}

	/**
	 * The project's bundles path.
	 *
	 * @type {string}
	 */
	get BUNDLES_PATH() {
		return this.pathHelper.join(this.SOURCES_PATH, this.BUNDLES);
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


export default Project;
