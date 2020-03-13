//--------------------------------------------------------
//-- Nwayo - Console - Legacy Command
//--------------------------------------------------------

import { NotImplementedError } from '@absolunet/ioc';
import Command                 from './Command';


/**
 * Legacy Command.
 *
 * @memberof nwayo.cli.console
 * @augments nwayo.cli.console.Command
 * @hideconstructor
 * @abstract
 */
class LegacyCommand extends Command {

	/**
	 * @inheritdoc
	 */
	init() {
		const { description } = this;
		Object.defineProperty(this, 'description', {
			get() {
				return `[${this.t('deprecated').toUpperCase()}] ${description}`;
			}
		});
		super.init();
	}

	/**
	 * @inheritdoc
	 */
	handle() {
		this.logDeprecationNotice();

		return super.handle();
	}

	/**
	 * Log a warning for deprecation notice.
	 */
	logDeprecationNotice() {
		this.warning(this.deprecationNotice);
	}

	/**
	 * Throw not implemented error for deprecation notice.
	 *
	 * @type {string}
	 * @abstract
	 */
	get deprecationNotice() {
		throw new NotImplementedError(this, 'deprecationNotice', 'string', 'accessor');
	}

}


export default LegacyCommand;
