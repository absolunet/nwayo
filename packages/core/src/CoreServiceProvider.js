//--------------------------------------------------------
//-- Nwayo Core - Service Provider
//--------------------------------------------------------

import { ServiceProvider } from '@absolunet/ioc';

import ProjectService      from './services/ProjectService';
import Nwayo               from './services/Nwayo';
import Builder             from './services/Builder';
import BuildTypeRepository from './repositories/BuildTypeRepository';
import NwayoBuildPolicy    from './policies/NwayoBuildPolicy';

import InstallComponentsCommand from './console/commands/install/InstallComponentsCommand';
import BuildAllCommand          from './console/commands/build/BuildAllCommand';
import BuildWatchCommand        from './console/commands/build/BuildWatchCommand';
import BuildScriptsCommand      from './console/commands/build/BuildScriptsCommand';
import BuildStylesCommand       from './console/commands/build/BuildStylesCommand';
import BuildAssetsCommand       from './console/commands/build/BuildAssetsCommand';


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
		this.bindNwayo();
		this.bindBuildType();
		this.bindBuilder();
		this.bindProjectService();
	}

	/**
	 * @inheritdoc
	 */
	boot() {
		this.addDefaultBuildTypes();
		this.addBuildPolicies();

		this.loadCommands([
			InstallComponentsCommand,
			BuildAllCommand,
			BuildWatchCommand,
			BuildScriptsCommand,
			BuildStylesCommand,
			BuildAssetsCommand
		]);
	}

	/**
	 * Bind nwayo orchestrator.
	 */
	bindNwayo() {
		this.app.singleton('nwayo', Nwayo);
	}

	/**
	 * Bind builder.
	 */
	bindBuilder() {
		this.app.singleton('nwayo.builder', Builder);
	}

	/**
	 * Bind project service.
	 */
	bindProjectService() {
		this.app.singleton('nwayo.project', ProjectService);
	}

	/**
	 * Bind build type repository.
	 */
	bindBuildType() {
		this.app.singleton('nwayo.build.type', BuildTypeRepository);
	}

	/**
	 * Add default buld types.
	 */
	addDefaultBuildTypes() {
		this.app.make('nwayo.build.type')
			.add('SCRIPTS', 'scripts')
			.add('STYLES',  'styles')
			.add('ASSETS',  'assets')
		;
	}

	/**
	 * Add build policies to prevent useless build commands to show up.
	 */
	addBuildPolicies() {
		const nwayoBuildPolicy = this.app.make(NwayoBuildPolicy);

		this.app.make('gate').policy(nwayoBuildPolicy.name, nwayoBuildPolicy.passes.bind(nwayoBuildPolicy));
	}

}


export default CoreServiceProvider;
