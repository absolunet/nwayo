//--------------------------------------------------------
//-- Nwayo - Console - Command
//--------------------------------------------------------

import { Command as BaseCommand } from '@absolunet/ioc';


/**
 * Base command class.
 *
 * @memberof nwayo.cli.console
 * @augments ioc.console.Command
 * @hideconstructor
 * @abstract
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
	 * @param {...*} parameters - Translator's translate parameters.
	 * @returns {string} The translated content.
	 */
	t(...parameters) {
		return this.translator.translate(...parameters);
	}

}


export default Command;
