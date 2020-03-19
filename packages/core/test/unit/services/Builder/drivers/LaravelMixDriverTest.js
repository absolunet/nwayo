//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Services - Builder - Drivers - Laravel Mix Driver
//--------------------------------------------------------
'use strict';

const DriverTestCase                   = require('./DriverTestCase');
const LaravelMixDriver                 = require('../../../../../dist/node/services/Builder/drivers/LaravelMixDriver');
const MockedLaravelMix                 = require('./stubs/mockedLaravelMix');
const MockedLaravelMixApi              = require('./stubs/mockedLaravelMixApi');
const MockedLaravelMixWebpackConfig    = require('./stubs/mockedLaravelMixWebpackConfig');
const MockedLaravelMixComponentFactory = require('./stubs/mockedLaravelMixComponentFactory');
const MockedLaravelMixManifest         = require('./stubs/mockedLaravelMixManifest');


class LaravelMixDriverTest extends DriverTestCase {

	beforeEach() {
		this.givenMockedLaravelMix();
		super.beforeEach();
	}


	//-- Given
	//--------------------------------------------------------

	givenMockedLaravelMix() {
		jest.mock('laravel-mix', () => {
			global.Mix = MockedLaravelMix;

			return new MockedLaravelMixApi();
		});

		jest.mock('laravel-mix/src/builder/WebpackConfig', () => {
			return MockedLaravelMixWebpackConfig;
		});

		jest.mock('laravel-mix/src/components/ComponentFactory', () => {
			return MockedLaravelMixComponentFactory;
		});

		jest.mock('laravel-mix/src/Manifest', () => {
			return MockedLaravelMixManifest;
		});
	}


	//-- Then
	//--------------------------------------------------------

	thenShouldHaveCalledLaravelMixApi(method, ...parameters) {
		this.thenShouldNotHaveThrown();
		this.expect(MockedLaravelMixApi._instances).toHaveLength(1);
		this.expect(MockedLaravelMixApi._spies[`_${method}`]).toHaveBeenCalledTimes(1);
		this.expect(MockedLaravelMixApi._spies[`_${method}`]).toHaveBeenCalledWith(...parameters);
	}

	thenJavaScriptEntryShouldHaveBeenAdded() {
		this.thenShouldHaveCalledLaravelMixApi('js', this.entry.source, this.entry.destination);
	}

	thenScssEntryShouldHaveBeenAdded() {
		this.thenShouldHaveCalledLaravelMixApi('sass', this.entry.source, this.entry.destination);
	}

	thenLessEntryShouldHaveBeenAdded() {
		this.thenShouldHaveCalledLaravelMixApi('less', this.entry.source, this.entry.destination);
	}

	thenStylusEntryShouldHaveBeenAdded() {
		this.thenShouldHaveCalledLaravelMixApi('stylus', this.entry.source, this.entry.destination);
	}

	thenReactEntryShouldHaveBeenAdded() {
		this.thenShouldHaveCalledLaravelMixApi('react', this.entry.source, this.entry.destination);
	}

	thenTypeScriptEntryShouldHaveBeenAdded() {
		this.thenShouldHaveCalledLaravelMixApi('ts', this.entry.source, this.entry.destination);
	}

	thenCopyEntryShouldHaveBeenAdded() {
		this.thenShouldHaveCalledLaravelMixApi('copy', this.entry.source, this.entry.destination);
	}

	thenCopyDirectoryEntryShouldHaveBeenAdded() {
		this.thenShouldHaveCalledLaravelMixApi('copyDirectory', this.entry.source, this.entry.destination);
	}


	//-- Helpers
	//--------------------------------------------------------

	getDriver() {
		return this.make(LaravelMixDriver);
	}

}


module.exports = LaravelMixDriverTest;
