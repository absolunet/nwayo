//--------------------------------------------------------
//-- Nwayo - Exceptions - Handler
//--------------------------------------------------------

import { ExceptionHandler } from '@absolunet/ioc';


/**
 * Application exception handler.
 *
 * @memberof nwayo.cli.exceptions
 * @augments ioc.foundation.exceptions.Handler
 * @hideconstructor
 */
class Handler extends ExceptionHandler {

	/**
	 * Report an exception through the logger.
	 *
	 * @inheritdoc
	 */
	async report(exception) {
		await super.report(exception);
	}

	/**
	 * Render an exception through an HTTP response.
	 *
	 * @inheritdoc
	 */
	async renderResponse(exception, request, response) {
		await super.renderResponse(exception, request, response);
	}

	/**
	 * Render an exception through a console message.
	 *
	 * @inheritdoc
	 */
	async renderConsole(exception) {
		if (exception && exception.shouldRender !== false) {
			await super.renderConsole(exception);
		}
	}

}


export default Handler;
