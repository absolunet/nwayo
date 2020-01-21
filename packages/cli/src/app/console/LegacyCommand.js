//--------------------------------------------------------
//-- Nwayo - Command - Legacy Command
//--------------------------------------------------------

import { Command, NotImplementedError } from '@absolunet/ioc';


/**
 * Legacy Command.
 */
class LegacyCommand extends Command {

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
