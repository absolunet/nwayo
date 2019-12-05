//--------------------------------------------------------
//-- Nwayo core - Extension service provider
//--------------------------------------------------------

import { ServiceProvider } from '@absolunet/ioc';

import DependencyManager   from './services/DependencyManager';
import ProjectService      from './services/ProjectService';

import InstallComponentsCommand from './console/commands/install/InstallComponentsCommand';


/**
 * Core service provider.
 *
 * @memberof nwayo.core
 * @augments ioc.foundation.ServiceProvider
 * @hideconstructor
 */
class CoreServiceProvider extends ServiceProvider {

	/**
	 * @inheritdoc
	 */
	register() {
		this.loadAndPublishConfig(this.app.formatPath(__dirname, 'config'));
		this.bindDependencyManager();
		this.bindProjectService();
	}

	/**
	 * @inheritdoc
	 */
	boot() {
		this.loadCommands([
			InstallComponentsCommand
		]);
	}

	/**
	 * Bind dependency manager.
	 */
	bindDependencyManager() {
		this.app.singleton('dependency', DependencyManager);
	}

	/**
	 * Bind project service.
	 */
	bindProjectService() {
		this.app.singleton('nwayo.project', ProjectService);
	}

}


export default CoreServiceProvider;
