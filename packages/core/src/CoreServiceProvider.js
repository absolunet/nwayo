//--------------------------------------------------------
//-- Nwayo Core - Service Provider
//--------------------------------------------------------

import { ServiceProvider } from '@absolunet/ioc';

import ProjectService             from './services/ProjectService';
import Nwayo                      from './services/Nwayo';
import Builder                    from './services/Builder';
import BuildTypeRepository        from './repositories/BuildTypeRepository';
import ProjectComponentRepository from './repositories/ProjectComponentRepository';
import NwayoBuildPolicy           from './policies/NwayoBuildPolicy';
import TerminalDecorator          from './services/TerminalDecorator';

import InstallComponentsCommand from './console/commands/install/InstallComponentsCommand';
import BuildAllCommand          from './console/commands/build/BuildAllCommand';
import BuildWatchCommand        from './console/commands/build/BuildWatchCommand';
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
	register() {
		this.loadAndPublishConfig(this.app.formatPath(__dirname, 'config'));
		this.loadAndPublishTranslations(this.app.formatPath(__dirname, 'resources', 'lang'));
		this.bindNwayo();
		this.bindBuildType();
		this.bindBuilder();
		this.bindProjectService();
		this.bindProjectComponentRepository();
		this.decorateTerminal();
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
			BuildAssetsCommand,
			ProjectBootstrapCommand
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
	 * Bind project component repository.
	 */
	bindProjectComponentRepository() {
		this.app.singleton('nwayo.project.component', ProjectComponentRepository);
	}

	/**
	 * Bind build type repository.
	 */
	bindBuildType() {
		this.app.singleton('nwayo.build.type', BuildTypeRepository);
	}

	/**
	 * Add default build types.
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
		this.app.make('gate').register(NwayoBuildPolicy);
	}

	/**
	 * Decorate default terminal.
	 */
	decorateTerminal() {
		this.app.decorate('terminal', (terminal) => {
			return new TerminalDecorator(terminal);
		});
	}

}


export default CoreServiceProvider;
