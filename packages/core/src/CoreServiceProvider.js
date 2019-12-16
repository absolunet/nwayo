//--------------------------------------------------------
//-- Nwayo core - Extension service provider
//--------------------------------------------------------

import { ServiceProvider } from '@absolunet/ioc';

import DependencyManager   from './services/DependencyManager';
import ProjectPathService  from './services/ProjectPathService';

import Package from './enums/constants/Package';
import Path    from './enums/constants/Path';
import Project from './enums/constants/Project';

import InstallComponentsCommand from './console/commands/install/InstallComponentsCommand';
import ProjectBootstrapCommand  from './console/commands/project/ProjectBootstrapCommand';


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
		this.bindConstants();
	}

	/**
	 * @inheritdoc
	 */
	boot() {
		this.loadCommands([
			InstallComponentsCommand,
			ProjectBootstrapCommand
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
		this.app.singleton('nwayo.project.path', ProjectPathService);
	}

	/**
	 * Bind constants.
	 */
	bindConstants() {
		this.bindPackageConstants();
		this.bindPathConstants();
		this.bindProjectConstants();
	}

	/**
	 * Bind package constant.
	 */
	bindPackageConstants() {
		this.app.singleton('nwayo.constant.package', Package);
	}

	/**
	 * Bind path constants.
	 */
	bindPathConstants() {
		this.app.singleton('nwayo.constant.path', Path);
	}

	/**
	 * Bind project constants.
	 */
	bindProjectConstants() {
		this.app.singleton('nwayo.constant.project', Project);
	}

}


export default CoreServiceProvider;
