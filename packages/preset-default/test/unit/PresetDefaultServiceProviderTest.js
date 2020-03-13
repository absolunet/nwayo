//--------------------------------------------------------
//-- Nwayo Preset - Default - Test - Unit - Service Provider
//--------------------------------------------------------
'use strict';

const path                         = require('path');
const TestCase                     = require('../TestCase');
const ExtensionJsServiceProvider   = require('@nwayo/extension-js').default;
const ExtensionScssServiceProvider = require('@nwayo/extension-scss').default;


class PresetDefaultServiceProviderTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenPresetDefaultServiceProvider();
	}

	testRegistersExtensionJs() {
		this.whenRegisteringProvider();
		this.thenShouldHaveRegistered(ExtensionJsServiceProvider);
	}

	testRegistersExtensionScss() {
		this.whenRegisteringProvider();
		this.thenShouldHaveRegistered(ExtensionScssServiceProvider);
	}


	//-- Given
	//--------------------------------------------------------

	givenPresetDefaultServiceProvider() {
		this.provider = path.join(__dirname, '..', '..');
	}


	//-- When
	//--------------------------------------------------------

	whenRegisteringProvider() {
		this.attempt(() => {
			this.app.register(this.provider);
		});
	}


	//-- Then
	//--------------------------------------------------------

	thenShouldHaveRegistered(provider) {
		this.thenShouldNotHaveThrown();
		this.expect(this.app.isRegistered(provider)).toBe(true);
	}

}


module.exports = PresetDefaultServiceProviderTest;
