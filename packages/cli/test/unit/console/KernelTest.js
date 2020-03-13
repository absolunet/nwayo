//--------------------------------------------------------
//-- Nwayo - Test - Unit - Console - Kernel
//--------------------------------------------------------
'use strict';

const TestCase = require('../../TestCase');
const Kernel   = require('../../../dist/node/app/console/Kernel');

const fakeCommandRegistrar = require('./stubs/fakeCommandRegistrar');
const fakeContextService   = require('./stubs/fakeContextService');
const fakeLegacyHandler    = require('./stubs/fakeLegacyHandler');
const fakeTranslator       = require('./stubs/fakeTranslator');


class KernelTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenFakeCommandPath();
		this.givenFakeCommandRegistrar();
		this.givenFakeContextService();
		this.givenFakeLegacyHandler();
		this.givenFakeTranslator();
		this.givenConsoleKernel();
		this.givenNoLegacyProject();
	}

	async testHandleRequestNormally() {
		await this.whenHandlingRequest();
		this.thenShouldHaveLoadedTranslations();
		this.thenShouldHaveRegisteredApplicationCommand();
		this.thenShouldHaveResolvedCommandThroughCommandRegistrar();
		this.thenShouldNotHaveHandledRequestThroughLegacyHandler();
	}

	async testHandleRequestThroughLegacyHandlerIfInLegacyProject() {
		this.givenLegacyProject();
		await this.whenHandlingRequest();
		this.thenShouldNotHaveLoadedTranslations();
		this.thenShouldNotHaveRegisteredApplicationCommand();
		this.thenShouldNotHaveResolvedCommandThroughCommandRegistrar();
		this.thenShouldHaveHandledRequestThroughLegacyHandler();
	}


	//-- Given
	//--------------------------------------------------------

	givenFakeCommandPath() {
		this.app.singleton('path.command', '/path/to/fake/commands');
	}

	givenFakeCommandRegistrar() {
		this.app.singleton('command.registrar', fakeCommandRegistrar);
	}

	givenFakeContextService() {
		this.app.singleton('nwayo.context', fakeContextService);
	}

	givenFakeLegacyHandler() {
		this.app.singleton('nwayo.legacy.handler', fakeLegacyHandler);
	}

	givenFakeTranslator() {
		this.app.singleton('translator', fakeTranslator);
	}

	givenConsoleKernel() {
		this.kernel = this.app.make(Kernel);
	}

	givenLegacyProject() {
		fakeContextService._projectIsLegacy = true;
	}

	givenNoLegacyProject() {
		fakeContextService._projectIsLegacy = false;
	}


	//-- When
	//--------------------------------------------------------

	async whenHandlingRequest() {
		await this.attemptAsync(async () => {
			await this.kernel.handle();
		});
	}


	//-- Then
	//--------------------------------------------------------

	thenShouldHaveLoadedTranslations() {
		this.thenShouldNotHaveThrown();
		this.expect(fakeTranslator.loadTranslations).toHaveBeenCalled();
		this.expect(fakeTranslator._loadTranslationsAsyncSpy).toHaveBeenCalled();
	}

	thenShouldNotHaveLoadedTranslations() {
		this.thenShouldNotHaveThrown();
		this.expect(fakeTranslator.loadTranslations).not.toHaveBeenCalled();
	}

	thenShouldHaveRegisteredApplicationCommand() {
		this.thenShouldNotHaveThrown();
		this.expect(fakeCommandRegistrar.addFromFolder).toHaveBeenCalledWith('/path/to/fake/commands');
	}

	thenShouldNotHaveRegisteredApplicationCommand() {
		this.thenShouldNotHaveThrown();
		this.expect(fakeCommandRegistrar.addFromFolder).not.toHaveBeenCalled();
	}

	thenShouldHaveResolvedCommandThroughCommandRegistrar() {
		this.thenShouldNotHaveThrown();
		this.expect(fakeCommandRegistrar.resolve).toHaveBeenCalled();
		this.expect(fakeCommandRegistrar._resolveAsyncSpy).toHaveBeenCalled();
	}

	thenShouldNotHaveResolvedCommandThroughCommandRegistrar() {
		this.thenShouldNotHaveThrown();
		this.expect(fakeCommandRegistrar.resolve).not.toHaveBeenCalled();
	}

	thenShouldHaveHandledRequestThroughLegacyHandler() {
		this.thenShouldNotHaveThrown();
		this.expect(fakeLegacyHandler.handle).toHaveBeenCalled();
		this.expect(fakeLegacyHandler._handleAsyncSpy).toHaveBeenCalled();
	}

	thenShouldNotHaveHandledRequestThroughLegacyHandler() {
		this.thenShouldNotHaveThrown();
		this.expect(fakeLegacyHandler.handle).not.toHaveBeenCalled();
	}

}


module.exports = KernelTest;
