//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Console - Commands - Install - Install Dependency Command
//--------------------------------------------------------
'use strict';

const TestCase                 = require('../../../../TestCase');
const InstallDependencyCommand = require('../../../../../dist/node/console/commands/install/InstallDependencyCommand');

const fakeCommandRegistrar           = require('../stubs/fakeCommandRegistrar');
const fakeTerminal                   = require('../stubs/fakeTerminal');
const fakeTranslator                 = require('../stubs/fakeTranslator');
const fakeDependencyManager          = require('../stubs/fakeDependencyManager');
const fakeDependencyManagerDriver    = require('../stubs/fakeDependencyManagerDriver');
const fakeProjectService             = require('../stubs/fakeProjectService');
const fakeProjectComponentRepository = require('../stubs/fakeProjectComponentRepository');


class InstallDependencyCommandTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenEmptyArgv();
		this.givenCommandRunner();
		this.givenFakeCommandRegistrar();
		this.givenFakeTerminal();
		this.givenFakeTranslator();
		this.givenFakeDependencyManager();
		this.givenFakeProjectService();
		this.givenFakeProjectComponentRepository();
		this.givenFakeProjectRoot();
		this.givenComponent('@nwayo-components/foo', 'components/foo');
		this.givenAvailableVersions('@lorem/ipsum', ['1.2.3', '4.5.6']);
		this.givenCommand();
	}

	afterEach() {
		super.afterEach();
		this.thenRestoreFakeProjectService();
	}


	async testCanInstallDependencyIfGivenExplicitNameWithAvailableVersionAndExistingComponent() {
		this.givenParameter('dependency', '@lorem/ipsum@1.2.3');
		this.givenParameter('component', '@nwayo-components/foo');
		await this.whenRunningCommand();
		this.thenShouldHaveInstalledDependencyInComponent('@lorem/ipsum', '1.2.3', 'foo');
	}

	async testCanInstallDependencyIfGivenExplicitNameWithAvailableVersionWithoutComponent() {
		this.givenParameter('dependency', '@lorem/ipsum@1.2.3');
		this.givenPromptAnswer('@nwayo-components/foo');
		await this.whenRunningCommand();
		this.thenShouldHaveInstalledDependencyInComponent('@lorem/ipsum', '1.2.3', 'foo');
	}

	async testCanInstallDependencyIfGivenExplicitNameWithoutVersionWithComponent() {
		this.givenParameter('dependency', '@lorem/ipsum');
		this.givenParameter('component', '@nwayo-components/foo');
		this.givenPromptAnswer('1.2.3');
		await this.whenRunningCommand();
		this.thenShouldHaveInstalledDependencyInComponent('@lorem/ipsum', '1.2.3', 'foo');
	}

	async testCanInstallDependencyIfGivenExplicitNameWithoutVersionWithoutComponent() {
		this.givenParameter('dependency', '@lorem/ipsum');
		this.givenPromptAnswer('1.2.3');
		this.givenPromptAnswer('@nwayo-components/foo');
		await this.whenRunningCommand();
		this.thenShouldHaveInstalledDependencyInComponent('@lorem/ipsum', '1.2.3', 'foo');
	}

	async testCanInstallDependencyWithoutParameters() {
		this.givenPromptAnswer('@lorem/ipsum');
		this.givenPromptAnswer('1.2.3');
		this.givenPromptAnswer('@nwayo-components/foo');
		await this.whenRunningCommand();
		this.thenShouldHaveInstalledDependencyInComponent('@lorem/ipsum', '1.2.3', 'foo');
	}

	async testCanInstallDependencyWithoutParametersWithCombinedDependencyAndVersion() {
		this.givenPromptAnswer('@lorem/ipsum@1.2.3');
		this.givenPromptAnswer('@nwayo-components/foo');
		await this.whenRunningCommand();
		this.thenShouldHaveInstalledDependencyInComponent('@lorem/ipsum', '1.2.3', 'foo');
	}

	async testCanInstallDependencyWhenGivenComponentIsFolderNameInsteadOfFullyQualifiedName() {
		this.givenParameter('dependency', '@lorem/ipsum@1.2.3');
		this.givenParameter('component', 'foo');
		await this.whenRunningCommand();
		this.thenShouldHaveInstalledDependencyInComponent('@lorem/ipsum', '1.2.3', 'foo');
	}

	async testFailsWhenGivenNonexistentDependencyThroughParameter() {
		this.givenParameter('dependency', '@null/undefined');
		await this.whenRunningCommand();
		this.thenShouldHaveFailedToInstallDependency();
	}

	async testFailsWhenGivenNonexistentDependencyThroughPrompt() {
		this.givenPromptAnswer('@null/undefined');
		await this.whenRunningCommand();
		this.thenShouldHaveFailedToInstallDependency();
	}

	async testFailsWhenGivenNonexistentVersionThroughParameter() {
		this.givenParameter('dependency', '@lorem/ipsum@7.8.9');
		await this.whenRunningCommand();
		this.thenShouldHaveFailedToInstallDependency();
	}

	async testFailsWhenGivenNonexistentVersionThroughPromptWithCombinedDependencyAndVersion() {
		this.givenPromptAnswer('@lorem/ipsum@7.8.9');
		await this.whenRunningCommand();
		this.thenShouldHaveFailedToInstallDependency();
	}

	async testFailsWhenGivenNonexistentVersionThroughPromptWithDependencyThroughParameter() {
		this.givenParameter('dependency', '@lorem/ipsum');
		this.givenPromptAnswer('7.8.9');
		await this.whenRunningCommand();
		this.thenShouldHaveFailedToInstallDependency();
	}

	async testFailsWhenGivenNonexistentVersionThroughPromptWithDependencyThroughPrompt() {
		this.givenPromptAnswer('@lorem/ipsum');
		this.givenPromptAnswer('7.8.9');
		await this.whenRunningCommand();
		this.thenShouldHaveFailedToInstallDependency();
	}

	async testFailsWhenGivenNonexistentComponentThroughParameter() {
		this.givenParameter('dependency', '@lorem/ipsum@1.2.3');
		this.givenParameter('component', 'bar');
		await this.whenRunningCommand();
		this.thenShouldHaveFailedToInstallDependency();
	}


	//-- Given
	//--------------------------------------------------------

	givenEmptyArgv() {
		this.argv = {};
	}

	givenCommandRunner() {
		this.commandRunner = this.make('command.runner');
	}

	givenFakeCommandRegistrar() {
		this.app.singleton('command.registrar', fakeCommandRegistrar);
	}

	givenFakeTerminal() {
		this.app.singleton('terminal', fakeTerminal);
		fakeTerminal._promptAnswers = [];
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

	givenFakeProjectComponentRepository() {
		this.app.singleton('nwayo.project.component', fakeProjectComponentRepository);
		fakeDependencyManagerDriver._versions = {};
	}

	givenFakeProjectRoot() {
		fakeProjectService._projectRoot = '/path/to/fake/project/root';
	}

	givenComponent(name, path) {
		fakeProjectComponentRepository._components[name] = path;
	}

	givenAvailableVersions(packageName, versions) {
		fakeDependencyManagerDriver._versions[packageName] = versions;
	}

	givenCommand() {
		this.command = this.make(InstallDependencyCommand, {
			app:      this.app,
			terminal: this.app.make('terminal')
		});
	}

	givenParameter(name, value) {
		this.argv[name] = value;
	}

	givenPromptAnswer(value) {
		fakeTerminal._promptAnswers.push(value);
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

	thenRestoreFakeProjectService() {
		fakeProjectService._projectRoot = undefined;
	}

	thenShouldHaveInstalledDependencyInComponent(dependency, version, component) {
		this.thenShouldNotHaveThrown();
		this.expect(fakeDependencyManager.inFolder).toHaveBeenLastCalledWith(`/path/to/fake/project/root/src/components/${component}`);
		this.expect(fakeDependencyManagerDriver.save).toHaveBeenCalledWith(dependency, version);
		this.expect(fakeCommandRegistrar.resolve).toHaveBeenCalledWith('install:components', true);
		const saveCalls = fakeDependencyManagerDriver.save.mock.invocationCallOrder;
		const resolveCalls = fakeCommandRegistrar.resolve.mock.invocationCallOrder;
		this.expect(saveCalls[saveCalls.length - 1]).toBeLessThan(resolveCalls[resolveCalls.length - 1]);
	}

	thenShouldHaveFailedToInstallDependency() {
		this.thenShouldHaveThrown();
		this.expect(fakeDependencyManagerDriver.save).not.toHaveBeenCalled();
		this.expect(fakeCommandRegistrar.resolve).not.toHaveBeenCalled();
	}

}


module.exports = InstallDependencyCommandTest;
