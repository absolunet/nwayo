//--------------------------------------------------------
//-- Nwayo Extension - JS - Service Provider
//--------------------------------------------------------

import { ServiceProvider } from '@absolunet/ioc';
import JavaScriptHandler from './handlers/JavaScriptHandler';


/**
 * JavaScript extension service provider.
 *
 * @memberof nwayo.extension.js
 * @augments ioc.foundation.ServiceProvider
 * @hideconstructor
 */
class ExtensionJsServiceProvider extends ServiceProvider {

	/**
	 * @inheritdoc
	 */
	register() {
		this.loadConfig(this.app.formatPath(__dirname, 'config'));
	}

	/**
	 * @inheritdoc
	 */
	boot() {
		if (this.app.isBound('nwayo')) {
			this.app.make('nwayo').register(JavaScriptHandler);
		}
	}

}


export default ExtensionJsServiceProvider;
