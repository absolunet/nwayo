//--------------------------------------------------------
//-- Nwayo core - Services - Dependency Manager - Drivers - Driver
//--------------------------------------------------------

import { spawn }               from 'child_process';
import { NotImplementedError } from '@absolunet/ioc';


/**
 * Abstract driver that describe dependency manager implementation.
 *
 * @memberof nwayo.core.services.DependencyManager.drivers
 * @hideconstructor
 */
class Driver {

	/**
	 * Class dependencies: <code>['folder', 'terminal.interceptor']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['app', 'file.system.async', 'folder', 'nwayo.path.generic', 'terminal.interceptor'];
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
	 * Run command through a spawn child process.
	 *
	 * @param {string} command - The command to run.
	 * @returns {Promise} The async process promise.
	 * @protected
	 */
	async run(command) {
		const [binary, ...parameters] = command.split(' ');

		await new Promise((resolve, reject) => {
			spawn(binary, parameters, { cwd: this.folder, stdio: 'inherit' })
				.on('close', (code) => {
					if (code === 0) {
						resolve();
					} else {
						reject(code);
					}
				});
		});
	}

	async all() {
		const { dependencies } = await this.loadPackageJson();

		return dependencies;
	}

	async has(component) {
		const dependencies = await this.all();

		return Object.prototype.hasOwnProperty.call(dependencies, component);
	}

	isLocal(component) {
		return this.componentVersionMatchesRegex(component, this.localVersionRegex);
	}

	isExternal(component) {
		return this.componentVersionMatchesRegex(component, this.externalVersionRegex);
	}

	async add(dependency, version) {
		const packageJson = await this.loadPackageJson();

		packageJson.dependencies[dependency] = version;

		await this.savePackageJson(packageJson);
	}

	async remove(component) {
		const packageJson = await this.loadPackageJson();

		delete packageJson.dependencies[component];

		await this.savePackageJson(packageJson);
	}

	async clear() {
		const packageJson = await this.loadPackageJson();

		packageJson.dependencies = {};

		await this.savePackageJson(packageJson);
	}

	async clearLocal() {
		await this.clearByRegex(this.localVersionRegex);
	}

	async clearExternal() {
		await this.clearByRegex(this.externalVersionRegex);
	}

	async clearByRegex(regex) {
		const packageJson = await this.loadPackageJson();

		Object.entries(packageJson.dependencies).forEach(([name, version], i, components) => {
			if (regex.test(version)) {
				delete components[name];
			}
		});

		await this.savePackageJson(packageJson);
	}

	async loadPackageJson() {
		const packageJson = await this.fs.readJson(this.packageJsonPath);
		packageJson.dependencies    = packageJson.dependencies || {};
		packageJson.devDependencies = packageJson.devDependencies || {};

		return packageJson;
	}

	async savePackageJson(packageJson) {
		if (Object.keys(packageJson.dependencies || {}).length === 0) {
			delete packageJson.dependencies;
		}
		if (Object.keys(packageJson.devDependencies || {}).length === 0) {
			delete packageJson.devDependencies;
		}

		await this.fs.writeJson(this.packageJsonPath, packageJson);
	}

	async componentVersionMatchesRegex(component, regex) {
		const components = await this.all();

		if (!Object.prototype.hasOwnProperty.call(components, component)) {
			return false;
		}

		return regex.test(components[component]);
	}

	get packageJsonPath() {
		return this.app.formatPath(this.folder, this.nwayoGenericPath.PACKAGE_JSON);
	}

	get localIdentifier() {
		return 'file:';
	}

	get localVersionRegex() {
		new RegExp(`^${this.localIdentifier}`, 'u');
	}

	get externalVersionRegex() {
		new RegExp(`^(?!${this.localIdentifier})`, 'u');
	}

	get fs() {
		return this.fileSystemAsync;
	}

}


export default Driver;
