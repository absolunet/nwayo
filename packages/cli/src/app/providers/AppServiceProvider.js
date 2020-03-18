//--------------------------------------------------------
//-- Nwayo - Providers - Application Service Provider
//--------------------------------------------------------

import { ServiceProvider } from '@absolunet/ioc';
import DependencyManager   from '../services/DependencyManager';
import ContextService      from '../services/ContextService';
import LegacyHandler       from '../handlers/LegacyHandler';
import PackageConstants    from '../enums/Package';
import PathConstants       from '../enums/Path';


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
		this.bindDependencyManager();
		this.bindContextService();
		this.bindLegacyHandler();
		this.bindConstants();

		const context = this.app.make('nwayo.context');

		if (!context.isInCliFolder() && context.hasNodeModulesFolder()) {
			this.registerModulesFromPackageJson(context);
		}
	}

	/**
	 * Register all modules marked as dependencies in the "package.json" in the current working directory.
	 *
	 * All those modules should be registrable as Node IoC service providers.
	 *
	 * @param {nwayo.cli.services.ContextService} context - The context service.
	 */
	registerModulesFromPackageJson(context) {
		const nwayoPackageJson = context.loadProjectFile('package.json');

		const { dependencies = {} } = nwayoPackageJson || {};

		if (Object.prototype.hasOwnProperty.call(dependencies, '@nwayo/core')) {
			Object.keys(dependencies).forEach((extension) => {
				if (extension !== '@nwayo/cli') {
					this.app.register(context.getPathFromCurrentDirectory('node_modules', extension));
				}
			});
		}
	}

	/**
	 * Bind dependency manager.
	 */
	bindDependencyManager() {
		this.app.singleton('dependency', DependencyManager);
	}

	/**
	 * Bind context service.
	 */
	bindContextService() {
		this.app.singleton('nwayo.context', ContextService);
	}

	/**
	 * Bind legacy handler.
	 */
	bindLegacyHandler() {
		this.app.singleton('nwayo.legacy.handler', LegacyHandler);
	}

	/**
	 * Bind constants.
	 */
	bindConstants() {
		this.bindPackageConstants();
		this.bindPathConstants();
	}

	/**
	 * Bind package constants.
	 */
	bindPackageConstants() {
		this.app.singleton('nwayo.constant.package', PackageConstants);
	}

	/**
	 * Bind path constants.
	 */
	bindPathConstants() {
		this.app.singleton('nwayo.constant.path', PathConstants);
	}

}


export default AppServiceProvider;
