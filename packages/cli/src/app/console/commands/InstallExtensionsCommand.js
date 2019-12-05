//--------------------------------------------------------
//-- Nwayo - Command - Install Extension Command
//--------------------------------------------------------

import { Command } from '@absolunet/ioc';


/**
 * Command that installs extensions as node modules from the project root path.
 *
 * @memberof nwayo.core.console.commands
 * @augments ioc.console.Command
 * @hideconstructor
 */
class InstallExtensionsCommand extends Command {

	/**
	 * Class dependencies: <code>['dependency', 'nwayo.project', 'translator']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['translator'];
	}

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
			.inFolder(this.app.make('nwayo.project').getRootPath())
			.install();
	}

	/**
	 * Translate with the translator service.
	 *
	 * @param {...*} parameters - The translate parameters.
	 * @returns {string} The translated value.
	 */
	t(...parameters) {
		return this.translator.translate(...parameters);
	}

}


export default InstallExtensionsCommand;
