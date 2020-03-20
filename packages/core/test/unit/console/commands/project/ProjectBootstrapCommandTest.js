//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Console - Commands - Project - Project Bootstrap Command
//--------------------------------------------------------
'use strict';

const TestCase                = require('../../../../TestCase');
const ProjectBootstrapCommand = require('../../../../../dist/node/console/commands/project/ProjectBootstrapCommand');


const fakeTranslator                 = require('../stubs/fakeTranslator');
const fakeCommandRegistrar           = require('../stubs/fakeCommandRegistrar');
const fakeTerminal                   = require('../stubs/fakeTerminal');
const fakeDependencyManager          = require('../stubs/fakeDependencyManager');
const fakeDependencyManagerDriver    = require('../stubs/fakeDependencyManagerDriver');
const fakeProjectService             = require('../stubs/fakeProjectService');
const fakeProjectComponentRepository = require('./stubs/fakeProjectComponentRepository');


class InstallComponentsCommandTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenEmptyArgv();
		this.givenCommandRunner();
		this.givenFakeTerminal();
		this.givenFakeTranslator();
		this.givenFakeDependencyManager();
		this.givenFakeProjectService();
		this.givenFakeProjectRoot();
		this.givenFakeProjectComponentRepository();
		this.givenFakeCommandRegistrar();
		this.givenCommand();
	}

	afterEach() {
		super.afterEach();
		this.thenRestoreFakeProjectService();
	}

	async testSaveDependenciesFromRepositoryInPackageJson() {
		await this.whenRunningCommand();
		this.thenShouldHaveSaveDependenciesInPackageJson();
		this.thenShouldNotHaveRunInstallComponentsCommand();
	}

	async testSaveAndInstallDependenciesIfInstallFlagIsProvided() {
		this.givenInstallFlag();
		await this.whenRunningCommand();
		this.thenShouldHaveSaveDependenciesInPackageJson();
		this.thenShouldHaveRunInstallComponentsCommand();
	}


	//-- Given
	//--------------------------------------------------------

	givenEmptyArgv() {
		this.argv = {};
	}

	givenCommandRunner() {
		this.commandRunner = this.make('command.runner');
	}

	givenFakeTerminal() {
		this.app.singleton('terminal', fakeTerminal);
	}

	givenFakeTranslator() {
		this.app.singleton('translator', fakeTranslator);
	}

	givenFakeDependencyManager() {
		this.app.singleton('dependency', fakeDependencyManager);
	}

	givenFakeProjectService() {
		this.app.singleton('nwayo.project', fakeProjectService);
	}

	givenFakeProjectRoot() {
		fakeProjectService._projectRoot = '/path/to/fake/project/root';
	}

	givenFakeProjectComponentRepository() {
		this.app.singleton('nwayo.project.component', fakeProjectComponentRepository);
	}

	givenFakeCommandRegistrar() {
		this.app.singleton('command.registrar', fakeCommandRegistrar);
	}

	givenCommand() {
		this.command = this.app.make(ProjectBootstrapCommand, {
			app:      this.app,
			terminal: this.app.make('terminal')
		});
	}

	givenInstallFlag() {
		this.argv.install = true;
	}


	//-- When
	//--------------------------------------------------------

	async whenRunningCommand() {
		await this.attemptAsync(async () => {
			await this.commandRunner.unsafeRun(this.command, this.argv);
		});
	}


	//-- Then
	//--------------------------------------------------------

	thenShouldHaveSaveDependenciesInPackageJson() {
		this.thenShouldNotHaveThrown();
		this.expect(fakeDependencyManager.inFolder).toHaveBeenCalledWith('/path/to/fake/project/root/src');
		const { invocationCallOrder: clearLocalOrder }        = fakeDependencyManagerDriver.clearLocal.mock;
		const { invocationCallOrder: saveMultipleLocalOrder } = fakeDependencyManagerDriver.saveMultipleLocal.mock;
		this.expect(fakeProjectComponentRepository.all).toHaveBeenCalled();
		this.expect(fakeDependencyManagerDriver.clearLocal).toHaveBeenCalled();
		this.expect(fakeDependencyManagerDriver.saveMultipleLocal).toHaveBeenCalledWith(fakeProjectComponentRepository._components);
		this.expect(clearLocalOrder[clearLocalOrder.length - 1]).toBeLessThan(saveMultipleLocalOrder[saveMultipleLocalOrder.length - 1]);
	}

	thenShouldNotHaveRunInstallComponentsCommand() {
		this.thenShouldNotHaveThrown();
		this.expect(fakeCommandRegistrar.resolve).not.toHaveBeenCalled();
		const { results } = fakeTranslator.translate.mock;
		this.expect(fakeTranslator.translate).toHaveBeenLastCalledWith('commands.project-bootstrap.messages.manual', { command: 'install:components' }, undefined);
		this.expect(fakeTerminal.println).toHaveBeenLastCalledWith(results[results.length - 1].value);
	}

	thenShouldHaveRunInstallComponentsCommand() {
		this.thenShouldNotHaveThrown();
		this.expect(fakeTranslator.translate).not.toHaveBeenCalledWith('commands.project-bootstrap.messages.manual');
		this.expect(fakeCommandRegistrar.resolve).toHaveBeenCalledWith('install:components', true);
		this.expect(fakeCommandRegistrar._resolveAsyncSpy).toHaveBeenCalled();
	}

	thenRestoreFakeProjectService() {
		fakeProjectService._projectRoot = undefined;
	}

}


module.exports = InstallComponentsCommandTest;
