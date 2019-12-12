//--------------------------------------------------------
//-- Nwayo - Command - InstallCommand
//--------------------------------------------------------

import { mixins }    from '@absolunet/ioc';
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
		return this.t('commands.install.description', {
			type: this.t('deprecated').toUpperCase(),
			command: Object.keys(this.legacyCommandMapping).join('|')
		});
	}

	/**
	 * Command parameters: <code>['scope']</code>.
	 *
	 * @type {Array<string>}
	 */
	get parameters() {
		return [
			['scope', true, null, this.t('commands.install.parameters.scope')]
		];
	}

	/**
	 * Command flags: <code>['force']</code>.
	 *
	 * @type {Array<string>}
	 */
	get flags() {
		return [
			['force', this.t('commands.install.flags.force')]
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
	 * Command that will be executed based on arguments from terminal.
	 *
	 * @returns {Promise} Call to execute in terminal.
	 */
	async runCommand() {
		await this.call(this.getLegacyCommandName());
	}

	/**
	 * Validate the command that will need to be call based on arguments from terminal.
	 *
	 * @returns {string} The command to run based on arguments.
	 */
	getLegacyCommandName() {
		const command = this.legacyCommandMapping[this.parameter('scope')];

		if (!command) {
			throw new TypeError(this.t('messages.nonExistingCommand', {
				command: Object.values(this.legacyCommandMapping).join(` ${this.t('or')} `)
			}));
		}

		return command;
	}

	/**
	 * Get deprecation notice to show.
	 *
	 * @type {string}
	 */
	get deprecationNotice() {
		return this.t('messages.deprecatedCommand', {
			command: this.getLegacyCommandName()
		});
	}


	/**
	 * Get legacy command mapping.
	 *
	 * @type {object}
	 */
	get legacyCommandMapping() {
		return {
			workflow: this.installExtensionsCommand,
			vendors:  this.installComponentsCommand
		};
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
