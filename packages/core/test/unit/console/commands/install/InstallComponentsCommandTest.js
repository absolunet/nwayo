//--------------------------------------------------------
//-- nwayo core - Test - Unit - Commands - Install - Install Components Command
//--------------------------------------------------------
'use strict';

const TestCase                 = require('../../../../TestCase');
const InstallComponentsCommand = require('../../../../../dist/node/console/commands/install/InstallComponentsCommand');

const fakeTerminal                = require('../stubs/fakeTerminal');
const fakeDependencyManager       = require('../stubs/fakeDependencyManager');
const fakeDependencyManagerDriver = require('../stubs/fakeDependencyManagerDriver');
const fakeProjectService          = require('../stubs/fakeProjectService');


class InstallComponentsCommandTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenEmptyArgv();
		this.givenCommandRunner();
		this.givenFakeTerminal();
		this.givenFakeDependencyManager();
		this.givenFakeProjectService();
		this.givenCommand();
	}

	afterEach() {
		super.afterEach();
		this.thenRestoreFakeProjectService();
	}

	async testTriggersInstallationInProjectSourceFolder() {
		this.givenFakeProjectRoot();
		await this.whenRunningCommand();
		this.thenShouldHaveRunInstallOnFakeProjectSourceDirectory();
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

	givenFakeDependencyManager() {
		this.app.singleton('dependency', fakeDependencyManager);
	}

	givenFakeProjectService() {
		this.app.singleton('nwayo.project', fakeProjectService);
	}

	givenFakeProjectRoot() {
		fakeProjectService._projectRoot = '/path/to/fake/project/root';
	}

	givenCommand() {
		this.command = this.app.make(InstallComponentsCommand, {
			app:      this.app,
			terminal: this.app.make('terminal')
		});
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

	thenShouldHaveRunInstallOnFakeProjectSourceDirectory() {
		this.thenShouldNotHaveThrown();
		this.expect(fakeDependencyManager.inFolder).toHaveBeenCalledWith('/path/to/fake/project/root/src');
		this.expect(fakeDependencyManagerDriver.install).toHaveBeenCalled();
		this.expect(fakeDependencyManagerDriver.installSpy).toHaveBeenCalled();
	}

	thenRestoreFakeProjectService() {
		fakeProjectService._projectRoot = undefined;
	}

}


module.exports = InstallComponentsCommandTest;
