//--------------------------------------------------------
//-- Nwayo - Command - InstallCommand
//--------------------------------------------------------

import { mixins } from '@absolunet/ioc';
import LegacyCommand from '../LegacyCommand';


/**
 * InstallCommand.
 */
class InstallCommand extends mixins.withTranslations(LegacyCommand) {

	/**
	 * @inheritdoc
	 */
	get name() {
		return 'install';
	}

	/**
	 * @inheritdoc
	 */
	get description() {
		return '[DEPRECATED] Install dependencies ex:[workflow|vendors]';
	}

	/**
	 * Command parameters: <code>['scope']</code>.
	 *
	 * @type {Array<string>}
	 */
	get parameters() {
		return [
			['scope', true, null, 'The installation scope.']
		];
	}

	/**
	 * Command flags: <code>['force']</code>.
	 *
	 * @type {Array<string>}
	 */
	get flags() {
		return [
			['force', 'The install workflow force flag.']
		];
	}

	/**
	 * @inheritdoc
	 */
	async handle() {
		await super.handle();
		await this.runCommand();
	}

	/**
	 * Validate the command that will need to be call based on arguments from terminal.
	 *
	 * @returns {string} The command to run based on arguments.
	 */
	getLegacyCommandName() {
		const scope = this.parameter('scope');

		if (scope === 'workflow') {
			return this.installExtensionsCommand;
		}

		if (scope === 'vendors') {
			return this.installComponentsCommand;
		}

		return '';
	}

	/**
	 * Command that will be executed based on arguments from terminal.
	 *
	 * @returns {Promise} Call to execute in terminal.
	 */
	async runCommand() {
		await this.call(this.getLegacyCommandName());
	}

	/**
	 * Get deprecation notice to show.
	 *
	 * @type {string}
	 */
	get deprecationNotice() {
		let isDeprecatedMessage = this.t('is deprecated');
		if (this.getLegacyCommandName() === '') {
			isDeprecatedMessage = this.t('doesn\'t exist');
		}

		return this.t('This command {{type}} Please use {{command}}', {
			type: isDeprecatedMessage,
			command: this.commandToUse
		});
	}

	/**
	 * Get command to use, for warning purpose.
	 *
	 * @type {string}
	 */
	get commandToUse() {
		const commandToCall = this.getLegacyCommandName();
		if (commandToCall) {
			return commandToCall;
		}

		return `${this.installExtensionsCommand} ${this.t('or')} ${this.installComponentsCommand}`;
	}

	/**
	 * Get workflow command to use.
	 *
	 * @type {string}
	 */
	get installExtensionsCommand() {
		return 'install:extensions';
	}

	/**
	 * Get vendors command to use.
	 *
	 * @type {string}
	 */
	get installComponentsCommand() {
		return 'install:components';
	}

}


export default InstallCommand;
