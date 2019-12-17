//--------------------------------------------------------
//-- Nwayo - Test - Unit - Console - Commands - InstallCommandTest
//--------------------------------------------------------
'use strict';

const TestCase       = require('../../../TestCase');
const InstallCommand = require('../../../../dist/node/app/console/commands/InstallCommand');
const fakeTerminal   = require('./stubs/fakeTerminal');


class InstallCommandTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenCommandRunner();
		this.givenFakeTerminal();
		this.givenCommand();
	}

	async testInstallationExtensionsTriggerWithDeprecationWarning() {
		this.givenCommandInstall();
		this.givenArgv('workflow');
		await this.whenRunningCommand();
		this.thenShouldNotHaveThrown();
		this.thenShouldHaveCallInstallExtentions();
		// this.thenShouldHaveThrownDeprecationWarning();
	}

	async testInstallationComponentsTriggerWithDeprecationWarning() {
		this.givenCommandInstall();
		this.givenArgv('vendors');
		await this.whenRunningCommand();
		this.thenShouldNotHaveThrown();
		this.thenShouldHaveCallInstallComponents();
		// this.thenShouldHaveThrownDeprecationWarning();
	}

	async testInstallationNotTrigger() {
		this.givenCommandInstall();
		this.givenArgv('nonexisting');
		await this.whenRunningCommand();
		this.thenShouldHaveThrown();
		this.thenShouldHaveCallInstall();
	}


	//-- Given
	//--------------------------------------------------------

	givenCommandRunner() {
		this.commandRunner = this.make('command.runner');
	}

	givenFakeTerminal() {
		this.app.singleton('terminal', fakeTerminal);
	}

	givenCommand() {
		this.command = this.make(InstallCommand, {
			app:      this.app,
			terminal: this.app.make('terminal')
		});
	}

	givenCommandInstall() {
		this.command = 'install';
	}

	givenArgv(argv) {
		this.argv = argv;
	}


	//-- When
	//--------------------------------------------------------

	async whenRunningCommand() {
		await this.attemptAsync(async () => {
			console.log(this.command);
			console.log(this.argv);
			await this.commandRunner.unsafeRun(this.command, this.argv);
		});
	}


	//-- Then
	//--------------------------------------------------------

	thenShouldHaveCallInstallExtentions() {
		//
	}

	thenShouldHaveCallInstallComponents() {
		//
	}

	thenShouldHaveCallInstall() {
		//
	}

}


module.exports = InstallCommandTest;
