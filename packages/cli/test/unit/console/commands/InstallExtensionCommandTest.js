//--------------------------------------------------------
//-- nwayo - Test - Unit - Install Extension Command
//--------------------------------------------------------
'use strict';

const TestCase                = require('../../../TestCase');
const InstallExtensionCommand = require('../../../../dist/node/app/console/commands/InstallExtensionsCommand');

const fakeTerminal                = require('./stubs/fakeTerminal');
const fakeProjectService          = require('./stubs/fakeProjectService');
const fakeDependencyManager       = require('./stubs/fakeDependencyManager');
const fakeDependencyManagerDriver = require('./stubs/fakeDependencyManagerDriver');


class InstallExtensionCommandTest extends TestCase {

	init() {
		if (super.init) {
			super.init();
		}
	}

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

	async testTriggersInstallationInProjectRootFolder() {
		this.givenFakeProjectRoot();
		await this.whenRunningCommand();
		this.thenShouldNotHaveThrown();
		this.thenShouldHaveRunInstallOnFakeWorkingDirectory();
	}


	//-- Given
	//--------------------------------------------------------

	givenFakeProjectRoot() {
		this.fakeProjectRoot = '/path/to/fake/project/root';
		fakeProjectService.__projectRootPath = this.fakeProjectRoot;
	}

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

	givenCommand() {
		this.command = this.make(InstallExtensionCommand, {
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

	thenShouldHaveRunInstallOnFakeWorkingDirectory() {
		this.expect(fakeDependencyManager.inFolder).toHaveBeenCalledWith(this.fakeProjectRoot);
		this.expect(fakeDependencyManagerDriver.install).toHaveBeenCalled();
	}

	thenRestoreFakeProjectService() {
		fakeProjectService.__projectRootPath = '';
	}

}


module.exports = InstallExtensionCommandTest;
