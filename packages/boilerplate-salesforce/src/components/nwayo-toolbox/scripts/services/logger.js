/**
 * Logger.
 *
 * @memberof nwayo.components.common.services
 */
class Logger {

	/**
	 * Log an information.
	 *
	 * @param {string} message - The message to log.
	 * @returns {nwayo.components.common.services.Logger} The current Logger instance.
	 */
	info(message) {
		return this.log('info', message);
	}

	/**
	 * Log a warning.
	 *
	 * @param {string} message - The message to log.
	 * @returns {nwayo.components.common.services.Logger} The current Logger instance.
	 */
	warning(message) {
		return this.log('warning', message);
	}

	/**
	 * Log an error.
	 *
	 * @param {string} message - The message to log.
	 * @returns {nwayo.components.common.services.Logger} The current Logger instance.
	 */
	error(message) {
		return this.log('error', message);
	}

	/**
	 * Log a message with a given level.
	 *
	 * @param {"info"|"warning"|"error"|string} level - The log level.
	 * @param {string} message - The message to log.
	 * @returns {nwayo.components.common.services.Logger} The current Logger instance.
	 */
	log(level, message) {
		// eslint-disable-next-line no-undef
		if (process.env.NODE_ENV !== 'production') {
			const methodMapping = {
				info:    'info',
				warning: 'warn',
				error:   'error'
			};

			const method = methodMapping[level] || methodMapping.info;

			// eslint-disable-next-line no-console
			console[method](message);
		}

		return this;
	}

}


export default new Logger();
