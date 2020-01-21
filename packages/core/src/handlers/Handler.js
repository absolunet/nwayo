//--------------------------------------------------------
//-- Nwayo Core - Handlers - Handler
//--------------------------------------------------------

import { NotImplementedError } from '@absolunet/ioc';


/**
 * Abstract build handler.
 *
 * @memberof nwayo.core.handlers
 * @hideconstructor
 * @abstract
 */
class Handler {

	/**
	 * Class dependencies: <code>['app', 'nwayo.build.type']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['app', 'nwayo.build.type'];
	}

	/**
	 * Build types that handler should hook into.
	 * By default, it returns the type property.
	 *
	 * @type {Array<string>}
	 */
	get types() {
		return [this.type];
	}

	/**
	 * Single build type that handler should hook into.
	 * By default, the `types` accessor uses this accessor.
	 * This accessor will never be used except inside the handler.
	 *
	 * @type {string}
	 * @abstract
	 */
	get type() {
		throw new NotImplementedError(this, 'type', 'string', 'accessor');
	}

}


export default Handler;
