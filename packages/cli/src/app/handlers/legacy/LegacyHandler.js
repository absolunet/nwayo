//--------------------------------------------------------
//-- Nwayo - Handlers - Legacy Hander
//--------------------------------------------------------


/**
 * Handle Legacy Service.
 */
class LegacyHandler {

	/**
	 * Class dependencies: <code>['app', 'file', 'helper.path', 'terminal']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['app', 'file', 'helper.path', 'terminal'];
	}

	/**
	 * Handle calls for legacy nwayo project.
	 *
	 * @returns {Promise} The async process promise.
	 */
	async handle() {
		await this.forwardChildProcess();
	}

	/**
	 * Create the child process to forward command.
	 *
	 * @returns {spawn} The child process.
	 */
	async forwardChildProcess() {
		await this.terminal.spawn('node', [
			this.getLegacyNwayoBinaryPath(),
			...this.terminal.argv
		], { stdio: 'inherit' });
	}

	/**
	 * Get legacy nwayo binary path.
	 *
	 * @returns {string} The legacy nwayo binary path.
	 */
	getLegacyNwayoBinaryPath() {
		const { bin: { nwayo: legacyNwayoBinPath } } = this.getLegacyNwayoPackage();

		return  this.app.formatPath(this.getLegacyNwayoPath(), legacyNwayoBinPath);
	}

	/**
	 * Get legacy nwayo package.
	 *
	 * @returns {object} The JSON object from the package.json.
	 */
	getLegacyNwayoPackage() {
		return this.file.load(this.app.formatPath(this.getLegacyNwayoPath(), 'package.json'));
	}

	/**
	 * Get legacy nwayo package name prior to this current name.
	 *
	 * @returns {string} The legacy nwayo package name.
	 */
	getLegacyNwayoPackageName() {
		return '@absolunet/nwayo-cli';
	}

	/**
	 * Get legacy nwayo path.
	 *
	 * @returns {string} The legacy nwayo path.
	 */
	getLegacyNwayoPath() {
		return this.pathHelper.dirname(require.resolve(this.getLegacyNwayoPackageName()));
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


export default LegacyHandler;
