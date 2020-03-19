//--------------------------------------------------------
//-- Nwayo - Console - Commands - Install Extension
//--------------------------------------------------------

import Command from '../Command';


/**
 * Command that installs extensions as node modules from the project root path.
 *
 * @memberof nwayo.cli.console.commands
 * @augments nwayo.cli.console.Command
 * @hideconstructor
 */
class InstallExtensionsCommand extends Command {

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
		return this.t('commands.install-extensions.description');
	}

	/**
	 * @inheritdoc
	 */
	async handle() {
		this.info(this.t('commands.install-extensions.messages.start'));

		await this.installExtensions();

		this.success(this.t('commands.install-extensions.messages.completed'));
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
