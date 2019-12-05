//--------------------------------------------------------
//-- Nwayo - Providers - Application Service Provider
//--------------------------------------------------------

import { ServiceProvider } from '@absolunet/ioc';


/**
 * Application service provider.
 *
 * @memberof nwayo.cli.providers
 * @augments ioc.foundation.ServiceProvider
 * @hideconstructor
 */
class AppServiceProvider extends ServiceProvider {

	/**
	 * @inheritdoc
	 */
	get name() {
		return 'Nwayo - Application';
	}

	/**
	 * Register the service provider.
	 */
	register() {
		const cwd = process.cwd();

		if (cwd !== this.app.basePath()) {
			const nwayoPackageJson = this.app.make('file').load(this.app.formatPath(cwd, 'package.json'));

			const { dependencies = {} } = nwayoPackageJson || {};

			if (Object.prototype.hasOwnProperty.call(dependencies, '@nwayo/core')) {
				Object.keys(dependencies).forEach((extension) => {
					this.app.register(this.app.formatPath(cwd, 'node_modules', extension));
				});
			}
		}
	}

}

export default AppServiceProvider;
