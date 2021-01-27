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
	async beforeHandling() {
		await this.loadTranslations();
		this.registerCommands();
	}

	/**
	 * Load translations to prevent async translations.
	 *
	 * @returns {Promise} The async process promise.
	 */
	async loadTranslations() {
		await this.translator.loadTranslations();
	}

	/**
	 * Register commands in the command registrar based on application command path.
	 */
	registerCommands() {
		this.commandRegistrar.addFromFolder(this.app.commandPath());
	}

	/**
	 * Translator service.
	 *
	 * @type {ioc.translation.services.Translator}
	 */
	get translator() {
		return this.app.make('translator');
	}

}


export default Kernel;
