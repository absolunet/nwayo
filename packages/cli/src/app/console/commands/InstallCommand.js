//--------------------------------------------------------
//-- Nwayo - Console - Commands - Install
//--------------------------------------------------------

import LegacyCommand from '../LegacyCommand';


/**
 * Command that installs workflow and vendors through the legacy CLI.
 *
 * @memberof nwayo.cli.console.commands
 * @augments nwayo.cli.console.LegacyCommand
 * @hideconstructor
 */
class InstallCommand extends LegacyCommand {

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
			command: Object.keys(this.legacyCommandMapping).join('|')
		});
	}

	/**
	 * @inheritdoc
	 */
	get parameters() {
		return [
			['scope', true, null, this.t('commands.install.parameters.scope')]
		];
	}

	/**
	 * @inheritdoc
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
	 * Run command based on deprecated command name.
	 *
	 * @returns {Promise} Call to execute in terminal.
	 */
	async runCommand() {
		await this.call(this.getLegacyCommandName());
	}

	/**
	 * Validate the command that will need to be call based on arguments from terminal.
	 *
	 * @throws {TypeError} - Indicates that the command scope is not supported.
	 * @returns {string} The command to run based on arguments.
	 */
	getLegacyCommandName() {
		const scope   = this.parameter('scope');
		const command = this.legacyCommandMapping[scope];

		if (!command) {
			const commandMapping = Object.values(this.legacyCommandMapping).join(', ');

			throw new TypeError(`Cannot install [${scope}]. Please use a scope in the list [${commandMapping}].`);
		}

		return command;
	}

	/**
	 * @inheritdoc
	 */
	get deprecationNotice() {
		return this.t('commands.messages.deprecated', {
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
	 * Workflow command to use.
	 *
	 * @type {string}
	 */
	get installExtensionsCommand() {
		return 'install:extensions';
	}

	/**
	 * Vendors command to use.
	 *
	 * @type {string}
	 */
	get installComponentsCommand() {
		return 'install:components';
	}

}


export default InstallCommand;
