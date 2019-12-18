//--------------------------------------------------------
//-- Nwayo - Test - Unit - Console - Commands - InstallCommandTest
//--------------------------------------------------------
'use strict';

const TestCase       = require('../../../TestCase');
const InstallCommand = require('../../../../dist/node/app/console/commands/InstallCommand');

const fakeTerminal         = require('./stubs/fakeTerminal');
const fakeTranslator       = require('./stubs/fakeTranslator');
const fakeCommandRegistrar = require('./stubs/fakeCommandRegistrar');


class InstallCommandTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenFakeTranslator();
		this.givenFakeTerminal();
		this.givenFakeCommandRegistrar();
		this.givenCommandRunner();
		this.givenInstallCommand();
		this.givenNoArgv();
	}

	async testCanInstallWorkflowWithDeprecationWarning() {
		this.givenScope('workflow');
		await this.whenRunningCommand();
		this.thenShouldNotHaveThrown();
		this.thenShouldHaveCalledCommand('install:extensions');
		this.thenShouldHaveShownDeprecationWarning('messages.deprecatedCommand', 'install:extensions');
	}

	async testCanInstallVendorsWithDeprecationWarning() {
		this.givenScope('vendors');
		await this.whenRunningCommand();
		this.thenShouldNotHaveThrown();
		this.thenShouldHaveCalledCommand('install:components');
		this.thenShouldHaveShownDeprecationWarning('messages.deprecatedCommand', 'install:components');
	}

	async testThrowsWhenInstallingUnknownScope() {
		this.givenScope('unknown');
		await this.whenRunningCommand();
		this.thenShouldHaveThrown();
		this.thenShouldNotHaveCalledCommand();
		this.thenShouldNotHaveShownDeprecationWarning();
	}

	async testThrowsWhenInstallingWithoutScope() {
		await this.whenRunningCommand();
		this.thenShouldHaveThrown();
		this.thenShouldNotHaveCalledCommand();
		this.thenShouldNotHaveShownDeprecationWarning();
	}


	//-- Given
	//--------------------------------------------------------

	givenCommandRunner() {
		this.commandRunner = this.make('command.runner');
	}

	givenFakeTerminal() {
		this.app.singleton('terminal', fakeTerminal);
	}

	givenFakeTranslator() {
		this.app.singleton('translator', fakeTranslator);
	}

	givenInstallCommand() {
		this.command = this.make(InstallCommand, {
			app:      this.app,
			terminal: this.app.make('terminal')
		});
	}

	givenFakeCommandRegistrar() {
		this.app.singleton('command.registrar', fakeCommandRegistrar);
	}

	givenNoArgv() {
		this.argv = {};
	}

	givenScope(scope) {
		this.argv.scope = scope;
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

	thenShouldHaveCalledCommand(command) {
		this.expect(fakeCommandRegistrar.resolve).toHaveBeenCalledWith(command, true);
		this.expect(fakeCommandRegistrar._resolveAsyncSpy).toHaveBeenCalled();
	}

	thenShouldNotHaveCalledCommand() {
		this.expect(fakeCommandRegistrar.resolve).not.toHaveBeenCalled();
	}

	thenShouldNotHaveShownDeprecationWarning() {
		this.expect(fakeTerminal.warning).not.toHaveBeenCalled();
	}

	thenShouldHaveShownDeprecationWarning(message, replacementCommand) {
		this.expect(fakeTranslator.translate).toHaveBeenCalledWith(message, { command: replacementCommand });
		const { results } = fakeTranslator.translate.mock;
		this.expect(fakeTerminal.warning).toHaveBeenCalledWith(results[results.length - 1].value);
	}

}


module.exports = InstallCommandTest;
