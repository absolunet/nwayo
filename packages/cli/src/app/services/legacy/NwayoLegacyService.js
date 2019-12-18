//--------------------------------------------------------
//-- Nwayo - Providers - Application Service Provider
//--------------------------------------------------------


/**
 * Check Legacy Service.
 */
class CheckLegacyService {

	/**
	 * Class dependencies: <code>['app', 'file']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['app', 'file'];
	}

	/**
	 * Check if current call is in legacy nwayo project.
	 *
	 * @returns {boolean} Indicates that the current project is a legacy nwayo project.
	 */
	projectIsLegacy() {
		if (this.projectIsCurrentlyInApp()) {
			return false;
		}

		const legacyFileName = 'nwayo.yaml';
		const hasNwayoYaml   = this.projectFileExists(legacyFileName);

		if (hasNwayoYaml) {
			return Boolean(this.loadProjectFile(legacyFileName).legacy);
		}

		return false;
	}

	/**
	 * Check if files or folders exists.
	 *
	 * @param {...string} segments - Files or folders to validate.
	 * @returns {boolean} Indicates that the files or folders exists.
	 */
	projectFileExists(...segments) {
		return this.file.exists(this.app.formatPath(this.currentDirectory, ...segments));
	}

	/**
	 * Check if project is nwayo app.
	 *
	 * @returns {boolean} Indicates that the project run as nwayo app.
	 */
	projectIsCurrentlyInApp() {
		return this.currentDirectory === this.app.basePath();
	}

	/**
	 * Load content of legacy project file.
	 *
	 * @param {...string} segments - The relative path segments from the project's directory.
	 * @returns {object} The file content.
	 */
	loadProjectFile(...segments) {
		return this.file.load(this.app.formatPath(this.currentDirectory, ...segments));
	}

	/**
	 * Currect directory.
	 *
	 * @type {string}
	 */
	get currentDirectory() {
		return process.cwd();
	}

}


export default CheckLegacyService;
