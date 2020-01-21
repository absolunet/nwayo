//--------------------------------------------------------
//-- Nwayo Core - Services - Builder
//--------------------------------------------------------

import { mixins }       from '@absolunet/ioc';
import BuilderProxy     from './BuilderProxy';
import LaravelMixDriver from './drivers/LaravelMixDriver';


/**
 * File builder.
 *
 * @memberof nwayo.core.services
 * @augments ioc.support.drivers.HasDriver
 * @hideconstructor
 */
class Builder extends mixins.hasDriver() {

	/**
	 * Class dependencies: <code>['app', 'config']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app', 'config']);
	}

	/**
	 * Builder constructor.
	 *
	 * @param {...*} parameters -  The injected parameters.
	 * @returns {nwayo.core.services.Builder.Builder} The builder instance wrapped by a proxy.
	 */
	constructor(...parameters) {
		super(...parameters);

		return new Proxy(this, new BuilderProxy());
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		super.init();
		this.addDriver('laravel-mix', LaravelMixDriver);
	}

	/**
	 * @inheritdoc
	 */
	driver(name = 'default', ...parameters) {
		if (name === 'default') {
			return this.driver(this.config.get('nwayo.core.driver', 'laravel-mix'));
		}

		return super.driver(name, ...parameters);
	}

	/**
	 * Make a new builder instance.
	 *
	 * @param {...*} parameters - The injected parameters.
	 * @returns {nwayo.core.services.Builder} A new builder instance.
	 */
	make(parameters) {
		return this.app.make(this.constructor, parameters);
	}

	/**
	 * Get default driver for forward calls.
	 *
	 * @returns {nwayo.core.service.Builder.drivers.Driver} The default driver instance.
	 */
	getForward() {
		return this.driver();
	}

}


export default Builder;
