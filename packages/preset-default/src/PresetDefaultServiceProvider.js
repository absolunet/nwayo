//--------------------------------------------------------
//-- Nwayo Preset - Default - Preset Default Service Provider
//--------------------------------------------------------

import { ServiceProvider }          from '@absolunet/ioc';
import CoreServiceProvider          from '@nwayo/core';
import ExtensionJsServiceProvider   from '@nwayo/extension-js';
import ExtensionScssServiceProvider from '@nwayo/extension-scss';


/**
 * Preset default service provider.
 *
 * @memberof nwayo.core
 * @augments ioc.foundation.ServiceProvider
 * @hideconstructor
 */
class PresetDefaultServiceProvider extends ServiceProvider {

	/**
	 * @inheritdoc
	 */
	register() {
		this.registerCore();
		this.registerExtensionJs();
		this.registerExtensionScss();
	}

	/**
	 * Register core.
	 */
	registerCore() {
		this.app.register(CoreServiceProvider);
	}

	/**
	 * Register JavaScript extension.
	 */
	registerExtensionJs() {
		this.app.register(ExtensionJsServiceProvider);
	}

	/**
	 * Register SCSS extension.
	 */
	registerExtensionScss() {
		this.app.register(ExtensionScssServiceProvider);
	}

}


export default PresetDefaultServiceProvider;
