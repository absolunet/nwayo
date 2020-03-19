//--------------------------------------------------------
//-- Nwayo - Services - Dependency Manager - Drivers - Driver
//--------------------------------------------------------

import { NotImplementedError } from '@absolunet/ioc';


/**
 * Abstract driver that describe dependency manager implementation.
 *
 * @memberof nwayo.cli.services.DependencyManager.drivers
 * @hideconstructor
 */
class Driver {

	/**
	 * Class dependencies: <code>['app', 'file.system.async', 'folder', 'nwayo.constant.package', 'terminal']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['app', 'file.system.async', 'folder', 'nwayo.constant.package', 'terminal'];
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

	/**
	 * Get all dependencies associated with their version.
	 *
	 * @returns {Promise<object<string, string>>} The listed dependencies.
	 */
	async all(type = this.nwayoConstantPackage.DEPENDENCIES) {
		const packageJson = await this.loadPackageJson();

		return packageJson[type] || {};
	}

	/**
	 * Check if the given dependency is listed in the "package.json" file.
	 *
	 * @param {string} dependency - The dependency name.
	 * @returns {Promise<boolean>} Indicates that the dependency is listed.
	 */
	async has(dependency) {
		const dependencies = await this.all();

		return Object.prototype.hasOwnProperty.call(dependencies, dependency);
	}

	/**
	 * Check if the given dependency is a local dependency.
	 *
	 * @param {string} dependency - The dependency name.
	 * @returns {Promise<boolean>} Indicates that the dependency is local and must exist on the current machine.
	 */
	isLocal(dependency) {
		return this.dependencyVersionMatchesRegex(dependency, this.localVersionRegex);
	}

	/**
	 * Check if the given dependency is an external dependency.
	 *
	 * @param {string} dependency - The dependency name.
	 * @returns {Promise<boolean>} Indicates that the dependency is external and must be downloaded.
	 */
	isExternal(dependency) {
		return this.dependencyVersionMatchesRegex(dependency, this.externalVersionRegex);
	}

	async save(dependency, version, type = this.nwayoConstantPackage.DEPENDENCIES) {
		const packageJson = await this.loadPackageJson();

		packageJson[type][dependency] = version;

		await this.savePackageJson(packageJson);
	}

	async saveLocal(dependency, relativePath, type) {
		await this.save(dependency, this.getPathAsLocalVersion(relativePath), type);
	}

	async saveMultiple(dependencies, type = this.nwayoConstantPackage.DEPENDENCIES) {
		const packageJson = await this.loadPackageJson();

		Object.assign(packageJson[type], dependencies);

		await this.savePackageJson(packageJson);
	}

	async saveMultipleLocal(dependencies, type) {
		await this.saveMultiple(Object.fromEntries(Object.entries(dependencies).map(([dependency, relativePath]) => {
			return [dependency, this.getPathAsLocalVersion(relativePath)];
		})), type);
	}

	/**
	 * Clear all dependencies from the "package.json" file.
	 *
	 * @returns {Promise} The async process promise.
	 */
	async clear(type = this.nwayoConstantPackage.DEPENDENCIES) {
		await this.clearByRegex(/.*/, type);
	}

	/**
	 * Clear all local dependencies from the "package.json" file.
	 *
	 * @returns {Promise} The async process promise.
	 */
	async clearLocal(type) {
		await this.clearByRegex(this.localVersionRegex, type);
	}

	/**
	 * Clear all external dependencies from the "package.json" file.
	 *
	 * @returns {Promise} The async process promise.
	 */
	async clearExternal(type) {
		await this.clearByRegex(this.externalVersionRegex, type);
	}

	/**
	 * Clear all dependencies that version match the given regular expression.
	 *
	 * @param {RegExp} regex - The regular expression.
	 * @param {RegExp} [type='dependencies'] - The dependency type to clear.
	 * @returns {Promise} The async process promise.
	 */
	async clearByRegex(regex, type = this.nwayoConstantPackage.DEPENDENCIES) {
		const packageJson = await this.loadPackageJson();

		Object.entries(packageJson[type]).forEach(([name, version], i, dependencies) => {
			if (regex.test(version)) {
				delete dependencies[name];
			}
		});

		await this.savePackageJson(packageJson);
	}

	/**
	 * Load "package.json" file data.
	 *
	 * @returns {Promise<object>} The "package.json" file data.
	 */
	async loadPackageJson() {
		const packageJson = await this.fs.readJson(this.packageJsonPath);

		const { DEPENDENCIES, DEV_DEPENDENCIES } = this.nwayoConstantPackage;

		packageJson[DEPENDENCIES]     = packageJson[DEPENDENCIES] || {};
		packageJson[DEV_DEPENDENCIES] = packageJson[DEV_DEPENDENCIES] || {};

		return packageJson;
	}

	/**
	 * Save given "package.json" data in file.
	 *
	 * @param {object} packageJson - The "package.json" file data.
	 * @returns {Promise} The async process promise.
	 */
	async savePackageJson(packageJson) {
		const { DEPENDENCIES, DEV_DEPENDENCIES } = this.nwayoConstantPackage;

		[DEPENDENCIES, DEV_DEPENDENCIES].forEach((type) => {
			if (Object.keys(packageJson[type] || {}).length === 0) {
				delete packageJson[type];
			} else {
				packageJson[type] = Object.fromEntries(Object.entries(packageJson[type]).sort(([a], [b]) => {
					return a.localeCompare(b);
				}));
			}
		});

		await this.fs.writeJson(this.packageJsonPath, packageJson, { space: 2 });
	}

	/**
	 * Check if a given component version matches the given regular expression.
	 *
	 * @param {string} dependency - The dependency name.
	 * @param {RegExp} regex - The regular expression.
	 * @returns {Promise<boolean>} Indicates that the component version matches the given regular expression.
	 */
	async dependencyVersionMatchesRegex(dependency, regex, type) {
		const dependencies = await this.all(type);

		if (!Object.prototype.hasOwnProperty.call(dependencies, dependency)) {
			return false;
		}

		return regex.test(dependencies[dependency]);
	}

	/**
	 * Convert relative path to valid version identifier, such as "file:foo/bar".
	 *
	 * @param {string} relativePath - The dependency relative path.
	 * @returns {string} The local version identifier.
	 */
	getPathAsLocalVersion(relativePath) {
		return `${this.localIdentifier}${relativePath}`;
	}

	/**
	 * The "package.json" file path from current folder.
	 *
	 * @type {string}
	 */
	get packageJsonPath() {
		return this.app.formatPath(this.folder, this.nwayoConstantPackage.PACKAGE_JSON);
	}

	/**
	 * Local identifier.
	 *
	 * @type {string}
	 */
	get localIdentifier() {
		return this.nwayoConstantPackage.LOCAL_IDENTIFIER;
	}

	/**
	 * Local version regular expression.
	 *
	 * @type {RegExp}
	 */
	get localVersionRegex() {
		return new RegExp(`^${this.localIdentifier}`, 'u');
	}

	/**
	 * External version regular expression.
	 *
	 * @type {RegExp}
	 */
	get externalVersionRegex() {
		return new RegExp(`^(?!${this.localIdentifier})`, 'u');
	}

	/**
	 * Async file system.
	 *
	 * @type {ioc.file.system.async}
	 */
	get fs() {
		return this.fileSystemAsync;
	}

}


export default Driver;
