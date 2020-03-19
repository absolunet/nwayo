//--------------------------------------------------------
//-- Nwayo Core - Console - Command - Install - Install Components
//--------------------------------------------------------

import Command from '../../Command';


/**
 * Command that installs components as node modules from the project source path.
 *
 * @memberof nwayo.core.console.commands.install
 * @augments ioc.console.Command
 * @hideconstructor
 */
class InstallComponentsCommand extends Command {

	/**
	 * @inheritdoc
	 */
	get name() {
		return 'install:components';
	}

	/**
	 * @inheritdoc
	 */
	get description() {
		return this.t('commands.install-components.description');
	}

	/**
	 * @inheritdoc
	 */
	async handle() {
		this.info(this.t('commands.install-components.messages.start'));

		await this.installComponents();

		this.success(this.t('commands.install-components.messages.completed'));
	}

	/**
	 * Install project components.
	 *
	 * @returns {Promise} The async process promise.
	 */
	async installComponents() {
		await this.app.make('dependency')
			.inFolder(this.app.make('nwayo.project').getSourcePath())
			.install();
	}

}


export default InstallComponentsCommand;
