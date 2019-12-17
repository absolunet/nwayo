//--------------------------------------------------------
//-- Nwayo - Console - Kernel
//--------------------------------------------------------

import { ConsoleKernel } from '@absolunet/ioc';


/**
 * Application kernel that handle incoming CLI request.
 *
 * @memberof nwayo.cli.console
 * @augments ioc.foundation.console.Kernel
 * @hideconstructor
 */
class Kernel extends ConsoleKernel {

	/**
	 * @inheritdoc
	 */
	async handle() {
		const isLegacy = this.checkIfLegacy();

		if (isLegacy) {
			await this.handleLegacy();
		} else {
			await super.handle();
		}
	}

	/**
	 * Handle calls for legacy nwayo project.
	 *
	 * @returns {Promise} The async process promise.
	 */
	handleLegacy() {
		return this.app.make('nwayo.legacy.handler').handle();
	}

	/**
	 * @inheritdoc
	 */
	async beforeHandling() {
		await this.loadTranslations();

		this.registerCommands();
	}

	/**
	 * @inheritdoc
	 */
	afterHandling() {
		// Here, you can perform actions after request was handled, if no error was thrown.
	}

	/**
	 * @inheritdoc
	 */
	terminating() {
		// Here, you can perform actions before the application terminates.
	}

	/**
	 * Load translations to prevent async translations.
	 *
	 * @returns {Promise} The async process promise.
	 */
	async loadTranslations() {
		await this.app.make('translator').driver().loadTranslations();
	}

	/**
	 * Register commands in the command registrar based on application command path.
	 */
	registerCommands() {
		this.commandRegistrar.addFromFolder(this.app.commandPath());
	}

	/**
	 * Check if current call is in legacy nwayo project.
	 *
	 * @returns {boolean} Indicates that the current project is a legacy nwayo project.
	 */
	checkIfLegacy() {
		return this.app.make('nwayo.legacy').projectIsLegacy();
	}

}


export default Kernel;
