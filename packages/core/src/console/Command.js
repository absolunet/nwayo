//--------------------------------------------------------
//-- Nwayo Core - Console - Command
//--------------------------------------------------------

import { Command as BaseCommand } from '@absolunet/ioc';


/**
 * Base core commands.
 *
 * @memberof nwayo.core.console.commands
 * @augments ioc.console.Command
 * @hideconstructor
 */
class Command extends BaseCommand {

	/**
	 * Class dependencies: <code>['translator']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['translator'];
	}

	/**
	 * Translate with the translator service.
	 *
	 *@param {string} string - The string to translate.
	 * @param {object<string, string>} [replacements] - The token replacements.
	 * @param {number} [count] - The string count for pluralization.
	 * @returns {string} The translated string.
	 */
	t(string, replacements, count) {
		return this.translator.translate(string, {
			...this.translationContext || {},
			...replacements || {}
		}, count);
	}

}


export default Command;
