//--------------------------------------------------------
//-- Nwayo core - Services - Dependency Manager
//--------------------------------------------------------

import { mixins }             from '@absolunet/ioc';
import DependencyManagerProxy from './DependencyManagerProxy';
import NpmDriver              from './drivers/NpmDriver';


/**
 * Dependency manager for external and local modules and packages.
 *
 * @memberof nwayo.core.services
 * @augments ioc.support.mixins.HasDriver
 * @hideconstructor
 */
class DependencyManager extends mixins.hasDriver() {

	/**
	 * Class dependencies: <code>['app', 'config']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['config']);
	}

	/**
	 * DependencyManager constructor.
	 *
	 * @param {...*} parameters -Injected parameters.
	 * @returns {DependencyManager} The dependency manager instance wrapped by a proxy.
	 */
	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new DependencyManagerProxy());
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		super.init();

		this.addDriver('npm', NpmDriver);
		this.setDefaultDriver('npm');
	}

	/**
	 * @inheritdoc
	 */
	driver(driver = 'default', parameters = {}) {
		parameters.folder = parameters.folder || process.cwd();

		return super.driver(driver, parameters);
	}

	/**
	 * Use dependency manager driver in specified folder.
	 *
	 * @param {string} folder - Absolute path to the folder.
	 * @returns {nwayo.core.services.DependencyManager.drivers.Driver} The driver instance.
	 */
	inFolder(folder) {
		return this.inFolderForDriver(folder, 'default');
	}

	/**
	 * Use specific dependency manager driver in specified folder.
	 *
	 * @param {string} folder - Absolute path to the folder.
	 * @param {string} driver - The driver name.
	 * @returns {nwayo.core.services.DependencyManager.drivers.Driver} The driver instance.
	 */
	inFolderForDriver(folder, driver) {
		return this.driver(driver, { folder });
	}

	/**
	 * Get default driver for forward calls, with the current working directory as folder.
	 *
	 * @returns {nwayo.core.services.DependencyManager.drivers.Driver} The driver instance.
	 */
	getForward() {
		return this.driver();
	}

}


export default DependencyManager;
