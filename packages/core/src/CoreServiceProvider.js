//--------------------------------------------------------
//-- Nwayo Core - Service Provider
//--------------------------------------------------------

import { ServiceProvider } from '@absolunet/ioc';

import ProjectService             from './services/ProjectService';
import BuildTypeRepository        from './repositories/BuildTypeRepository';
import ProjectComponentRepository from './repositories/ProjectComponentRepository';

import InstallComponentsCommand from './console/commands/install/InstallComponentsCommand';
import InstallDependencyCommand from './console/commands/install/InstallDependencyCommand';
import BuildAllCommand          from './console/commands/build/BuildAllCommand';
import BuildScriptsCommand      from './console/commands/build/BuildScriptsCommand';
import BuildStylesCommand       from './console/commands/build/BuildStylesCommand';
import BuildAssetsCommand       from './console/commands/build/BuildAssetsCommand';
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
	register() { try {
		this.loadAndPublishTranslations(this.app.formatPath(__dirname, 'resources', 'lang'));
		this.bindProjectService();
		this.bindBuildTypeRepository();
		this.bindProjectComponentRepository(); } catch (error) { console.error(error); throw error; }
	}

	/**
	 * @inheritdoc
	 */
	boot() { try {
		this.addDefaultBuildTypes();
		this.loadCommands([
			InstallComponentsCommand,
			InstallDependencyCommand,
			BuildAllCommand,
			BuildScriptsCommand,
			BuildStylesCommand,
			BuildAssetsCommand,
			ProjectBootstrapCommand
		]); } catch (error) {} console.error(error); throw error; }
	}

	/**
	 * Bind project service.
	 */
	bindProjectService() {
		this.app.singleton('nwayo.project', ProjectService);
	}

	/**
	 * Bind the build type repository.
	 */
	bindBuildTypeRepository() {
		this.app.singleton('nwayo.build-type', BuildTypeRepository);
	}

	/**
	 * Bind project component repository.
	 */
	bindProjectComponentRepository() {
		this.app.singleton('nwayo.project.component', ProjectComponentRepository);
	}

	/**
	 * Add default build types.
	 */
	addDefaultBuildTypes() {
		this.app.make('nwayo.build-type').add(['scripts', 'styles', 'assets']);
	}

}


export default CoreServiceProvider;
