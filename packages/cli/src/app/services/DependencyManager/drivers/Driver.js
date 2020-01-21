//--------------------------------------------------------
//-- Nwayo - Services - Dependency Manager - Drivers - Driver
//--------------------------------------------------------

import { NotImplementedError } from '@absolunet/ioc';


/**
 * Abstract driver that describe dependency manager implementation.
 *
 * @memberof nwayo.core.services.DependencyManager.drivers
 * @hideconstructor
 */
class Driver {

	/**
	 * Class dependencies: <code>['folder', 'terminal', 'terminal.interceptor']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['folder', 'terminal', 'terminal.interceptor'];
	}

	/**
	 * Install all packages.
	 *
	 * @returns {Promise} The async process promise.
	 * @abstract
	 * @async
	 */
	install() {
		throw new NotImplementedError(this, 'install', 'Promise');
	}

	/**
	 * Add a single package by name, with an optional version, and install it.
	 *
	 * @param {string} packageName - The package name.
	 * @param {string} [version] - The package specific version.
	 * @returns {Promise} The async process promise.
	 * @abstract
	 * @async
	 */
	add(packageName, version) { // eslint-disable-line no-unused-vars
		throw new NotImplementedError(this, 'add', 'Promise');
	}

	/**
	 * Update a given package by name, with an optional version, and install it.
	 *
	 * @param {string} packageName - The package name.
	 * @param {string} [version] - The package specific version.
	 * @returns {Promise} The async process promise.
	 * @abstract
	 * @async
	 */
	update(packageName, version) { // eslint-disable-line no-unused-vars
		throw new NotImplementedError(this, 'update', 'Promise');
	}

	/**
	 * IRemove a single package.
	 *
	 * @param {string} packageName - The package name.
	 * @returns {Promise} The async process promise.
	 * @abstract
	 * @async
	 */
	remove(packageName) { // eslint-disable-line no-unused-vars
		throw new NotImplementedError(this, 'remove', 'Promise');
	}

	/**
	 * Run command through a spawn child process.
	 *
	 * @param {string} command - The command to run.
	 * @returns {Promise} The async process promise.
	 * @protected
	 */
	async run(command) {
		const [binary, ...parameters] = command.split(' ');
		const { folder: cwd } = this;

		await this.terminal.spawn(binary, parameters, { cwd });
	}

}


export default Driver;
