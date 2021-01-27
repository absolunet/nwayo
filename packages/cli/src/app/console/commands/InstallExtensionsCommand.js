//--------------------------------------------------------
//-- Nwayo - Console - Commands - Install Extension
//--------------------------------------------------------

import { Command } from '@absolunet/ioc';


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
		return 'Install extensions.';
	}

	/**
	 * @inheritdoc
	 */
	async handle() {
		this.info('Installing extensions...');

		await this.installExtensions();

		this.success('Extensions installed!');
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
