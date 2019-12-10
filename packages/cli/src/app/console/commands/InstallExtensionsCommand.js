//--------------------------------------------------------
//-- Nwayo - Command - Install Extension Command
//--------------------------------------------------------

import { Command, mixins } from '@absolunet/ioc';


/**
 * Command that installs extensions as node modules from the project root path.
 *
 * @memberof nwayo.core.console.commands
 * @augments ioc.console.Command
 * @hideconstructor
 */
class InstallExtensionsCommand extends mixins.withTranslations(Command) {

	/**
	 * @inheritdoc
	 */
	get name() {
		return 'install:extensions';
	}

	/**
	 * @inheritdoc
	 */
	get description() {
		return 'Install nwayo extensions for the current project.';
	}

	/**
	 * @inheritdoc
	 */
	async handle() {
		this.terminal.box(this.t('Installing {{type}}', { type: this.t('extensions') }));

		await this.installExtensions();
	}

	/**
	 * Install project extensions.
	 *
	 * @returns {Promise} The async process promise.
	 */
	async installExtensions() {
		await this.app.make('dependency')
			.inFolder(process.cwd())
			.install();
	}

}


export default InstallExtensionsCommand;
