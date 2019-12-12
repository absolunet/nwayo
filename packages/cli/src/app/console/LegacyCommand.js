//--------------------------------------------------------
//-- Nwayo - Command - Install
//--------------------------------------------------------

import { Command } from '@absolunet/ioc';


/**
 * Install.
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
	 * @type {throw}
	 */
	get deprecationNotice() {
		throw new NotImplementedError(this, 'deprecationNotice', 'string', 'accessor');
	}

}


export default LegacyCommand;
