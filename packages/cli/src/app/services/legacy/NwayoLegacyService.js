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

		const hasNwayoYaml = this.projectFileExists('nwayo.yaml');
		const hasPackage   = this.projectFileExists('src', 'package.json');

		return !hasNwayoYaml || !hasPackage;
	}

	/**
	 * Check if files or folders exists.
	 *
	 * @param {string} files - Files or folders to validate.
	 * @returns {boolean} Indicates that the files or folders exists.
	 */
	projectFileExists(...files) {
		return this.file.exists(this.app.formatPath(this.currentDirectory, ...files));
	}

	/**
	 * Check if project is nwayo kat.
	 *
	 * @returns {boolean} Indicates that the project run as nwayo kat.
	 */
	projectIsCurrentlyInApp() {
		return this.currentDirectory === this.app.basePath();
	}

	/**
	 * Get currect directory.
	 *
	 * @type {string}
	 */
	get currentDirectory() {
		return process.cwd();
	}

}

export default CheckLegacyService;
