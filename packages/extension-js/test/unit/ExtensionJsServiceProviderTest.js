//--------------------------------------------------------
//-- Nwayo Extension - JS - Test - Unit - Service Provider
//--------------------------------------------------------
'use strict';

const path              = require('path');
const TestCase          = require('../TestCase');
const JavaScriptHandler = require('../../dist/node/handlers/JavaScriptHandler');
const fakeNwayo         = require('./stubs/fakeNwayo');


class ExtensionJsServiceProviderTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenExtensionJsServiceProvider();
	}

	testRegisterJavaScriptHandler() {
		this.givenFakeNwayo();
		this.whenRegisteringProvider();
		this.thenShouldHaveRegisteredNwayoHandler(JavaScriptHandler);
	}

	testDoesNotThrowIfNwayoDoesNotExist() {
		this.whenRegisteringProvider();
		this.thenShouldNotHaveRegisteredNwayoHandler();
	}


	givenExtensionJsServiceProvider() {
		this.provider = path.join(__dirname, '..', '..');
	}

	givenFakeNwayo() {
		this.app.singleton('nwayo', fakeNwayo);
	}

	whenRegisteringProvider() {
		this.attempt(() => {
			this.app.register(this.provider);
		});
	}

	thenShouldHaveRegisteredNwayoHandler(handler) {
		this.thenShouldNotHaveThrown();
		this.expect(fakeNwayo.register).toHaveBeenCalled();
		const call = fakeNwayo.register.mock.calls.find(([handlerClass]) => {
			return handlerClass === handler;
		});
		this.expect(call).toBeTruthy();
	}

	thenShouldNotHaveRegisteredNwayoHandler() {
		this.thenShouldNotHaveThrown();
		this.expect(fakeNwayo.register).not.toHaveBeenCalled();
	}

}


module.exports = ExtensionJsServiceProviderTest;
