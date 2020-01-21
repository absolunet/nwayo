//--------------------------------------------------------
//-- Nwayo Extension - SCSS - Test - Unit - Handlers - SCSS Handler
//--------------------------------------------------------
'use strict';

const TestCase                = require('../../TestCase');
const ScssHandler             = require('../../../dist/node/handlers/ScssHandler');
const fakeBuildTypeRepository = require('./stubs/fakeBuildTypeRepository');
const fakeBuilder             = require('./stubs/fakeBuilder');


class ScssHandlerTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenFakeBuildTypeRepository();
		this.givenFakeBuilder();
		this.givenScssHandler();
		this.givenBundle({
			bundlePath: '/path/to/bundle',
			outputPath: '/path/to/output',
			files: []
		});
	}

	testHandlerHooksInProcessOnly() {
		this.whenGettingPrototypeMethods();
		this.thenResultShouldEqual(['process']);
	}

	testAddNoEntryForNoFile() {
		this.whenProcessing();
		this.thenShouldHaveAddedNoEntry();
	}

	testAddJavaScriptEntryForSingleScssFileInKebabCaseInStylesFolder() {
		this.givenFileInBundle('styles/foo-bar.scss');
		this.whenProcessing();
		this.thenShouldHaveAddedJavaScriptEntry({
			source: '/path/to/bundle/styles/foo-bar.scss',
			destination: '/path/to/output/styles/foo-bar.css'
		});
	}

	testAddJavaScriptEntryForSingleScssFileInPascalCaseInStylesFolder() {
		this.givenFileInBundle('styles/FooBar.scss');
		this.whenProcessing();
		this.thenShouldHaveAddedJavaScriptEntry({
			source: '/path/to/bundle/styles/FooBar.scss',
			destination: '/path/to/output/styles/FooBar.css'
		});
	}

	testAddNoEntryForSingleCssFileInStylesFolder() {
		this.givenFileInBundle('scripts/foo.css');
		this.whenProcessing();
		this.thenShouldHaveAddedNoEntry();
	}

	testAddNoEntryForSingleSassFolderInStylesFolder() {
		this.givenFileInBundle('styles/foo.sass');
		this.whenProcessing();
		this.thenShouldHaveAddedNoEntry();
	}

	testAddNoEntryForSingleScssFileInSomeFolder() {
		this.givenFileInBundle('some/foo.scss');
		this.whenProcessing();
		this.thenShouldHaveAddedNoEntry();
	}

	testAddNoEntryForSingleScssFileInStylesFolderInsideSomeFolder() {
		this.givenFileInBundle('some/scripts/foo.scss');
		this.whenProcessing();
		this.thenShouldHaveAddedNoEntry();
	}


	givenFakeBuildTypeRepository() {
		this.app.singleton('nwayo.build.type', fakeBuildTypeRepository);
	}

	givenFakeBuilder() {
		this.builder = fakeBuilder;
	}

	givenScssHandler() {
		this.handler = this.make(ScssHandler);
	}

	givenBundle(bundle) {
		this.bundle = bundle;
	}

	givenFileInBundle(file) {
		this.bundle.files = this.bundle.files || [];
		this.bundle.files.push({
			localPath: file,
			name: this.make('helper.path').basename(file),
			path: this.app.formatPath(this.bundle.bundlePath, file)
		});
	}

	whenGettingPrototypeMethods() {
		this.attempt(() => {
			this.setResult(Object.entries(Object.getOwnPropertyDescriptors(this.handler.constructor.prototype))
				.filter(([name, { value }]) => {
					return typeof value === 'function' && !['constructor', 'init'].includes(name);
				})
				.map(([name]) => {
					return name;
				}));
		});
	}

	whenProcessing() {
		this.attempt(() => {
			this.handler.process(this.builder, this.bundle);
		});
	}

	thenShouldHaveAddedNoEntry() {
		this.thenShouldNotHaveThrown();
		this.expect(fakeBuilder.addEntry).not.toHaveBeenCalled();
	}

	thenShouldHaveAddedEntry(type, data) {
		this.thenShouldNotHaveThrown();
		this.expect(fakeBuilder.addEntry).toHaveBeenCalled();
		const call = fakeBuilder.addEntry.mock.calls.find(([entryType, callData]) => {
			return entryType === type && Object.entries(data).every(([key, value]) => {
				return callData[key] === value;
			});
		});
		this.expect(call).toBeTruthy();
	}

	thenShouldHaveAddedJavaScriptEntry(...parameters) {
		this.thenShouldHaveAddedEntry('scss', ...parameters);
	}

}


module.exports = ScssHandlerTest;
