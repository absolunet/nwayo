//--------------------------------------------------------
//-- Nwayo Extension - SCSS - Service provider
//--------------------------------------------------------

import { ServiceProvider } from '@absolunet/ioc';
import ScssHandler         from './handlers/ScssHandler';


/**
 * SCSS extension service provider.
 *
 * @memberof nwayo.extension.scss
 * @augments ioc.foundation.ServiceProvider
 * @hideconstructor
 */
class ExtensionScssServiceProvider extends ServiceProvider {

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
			this.app.make('nwayo').register(ScssHandler);
		}
	}

}


export default ExtensionScssServiceProvider;
