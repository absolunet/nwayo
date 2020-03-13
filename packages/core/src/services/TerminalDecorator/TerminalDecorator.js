//--------------------------------------------------------
//-- Nwayo Core - Services - Terminal Decorator
//--------------------------------------------------------

import Gauge                  from 'gauge';
import TerminalDecoratorProxy from './TerminalDecoratorProxy';


/**
 * Terminal decorator that adds progress support.
 *
 * @memberof nwayo.core.services
 * @hideconstructor
 */
class TerminalDecorator {

	/**
	 * TerminalDecorator constructor.
	 *
	 * @param {ioc.console.services.Terminal} terminal - The original terminal.
	 * @returns {TerminalDecorator} The terminal decorator wrapped by a proxy.
	 */
	constructor(terminal) {
		this.terminal = terminal;

		return new Proxy(this, new TerminalDecoratorProxy());
	}

	/**
	 * Start progress gauge.
	 *
	 * @param {object} [options={}] - The gauge options.
	 * @returns {Gauge} The gauge instance.
	 */
	startProgress(options = {}) {
		return new Gauge(undefined, {
			updateInterval: 50,
			cleanupOnExit: false,
			...options
		});
	}

	/**
	 * @inheritdoc
	 */
	getForward() {
		return this.terminal;
	}

	/**
	 * Chalk package.
	 *
	 * @type {chalk}
	 */
	get chalk() {
		return require('chalk'); // eslint-disable-line global-require
	}

}


export default TerminalDecorator;
