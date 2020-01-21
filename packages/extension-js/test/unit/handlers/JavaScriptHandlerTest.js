//--------------------------------------------------------
//-- Nwayo Extension - JS - Test - Unit - Handlers - JavaScript Handler
//--------------------------------------------------------
'use strict';

const TestCase                = require('../../TestCase');
const JavaScriptHandler       = require('../../../dist/node/handlers/JavaScriptHandler');
const fakeBuildTypeRepository = require('./stubs/fakeBuildTypeRepository');
const fakeBuilder             = require('./stubs/fakeBuilder');


class JavaScriptHandlerTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenFakeBuildTypeRepository();
		this.givenFakeBuilder();
		this.givenJavaScriptHandler();
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

	testAddJavaScriptEntryForSingleJsFileInKebabCaseInScriptsFolder() {
		this.givenFileInBundle('scripts/foo-bar.js');
		this.whenProcessing();
		this.thenShouldHaveAddedJavaScriptEntry({
			source: '/path/to/bundle/scripts/foo-bar.js',
			destination: '/path/to/output/scripts/foo-bar.js'
		});
	}

	testAddJavaScriptEntryForSingleVueFileInKebabCaseInScriptsFolder() {
		this.givenFileInBundle('scripts/foo-bar.vue');
		this.whenProcessing();
		this.thenShouldHaveAddedJavaScriptEntry({
			source: '/path/to/bundle/scripts/foo-bar.vue',
			destination: '/path/to/output/scripts/foo-bar.js'
		});
	}

	testAddJavaScriptEntryForSingleJsFileInPascalCaseInScriptsFolder() {
		this.givenFileInBundle('scripts/FooBar.js');
		this.whenProcessing();
		this.thenShouldHaveAddedJavaScriptEntry({
			source: '/path/to/bundle/scripts/FooBar.js',
			destination: '/path/to/output/scripts/FooBar.js'
		});
	}

	testAddJavaScriptEntryForSingleVueFileInPascalCaseInScriptsFolder() {
		this.givenFileInBundle('scripts/FooBar.vue');
		this.whenProcessing();
		this.thenShouldHaveAddedJavaScriptEntry({
			source: '/path/to/bundle/scripts/FooBar.vue',
			destination: '/path/to/output/scripts/FooBar.js'
		});
	}

	testAddNoEntryForSingleTsFileInScriptsFolder() {
		this.givenFileInBundle('scripts/foo.ts');
		this.whenProcessing();
		this.thenShouldHaveAddedNoEntry();
	}

	testAddNoEntryForSingleJsxFolderInScriptsFolder() {
		this.givenFileInBundle('scripts/foo.jsx');
		this.whenProcessing();
		this.thenShouldHaveAddedNoEntry();
	}

	testAddNoEntryForSingleJsFileInSomeFolder() {
		this.givenFileInBundle('some/foo.js');
		this.whenProcessing();
		this.thenShouldHaveAddedNoEntry();
	}

	testAddNoEntryForSingleJsFileInScriptsFolderInsideSomeFolder() {
		this.givenFileInBundle('some/scripts/foo.js');
		this.whenProcessing();
		this.thenShouldHaveAddedNoEntry();
	}


	//-- Given
	//--------------------------------------------------------

	givenFakeBuildTypeRepository() {
		this.app.singleton('nwayo.build.type', fakeBuildTypeRepository);
	}

	givenFakeBuilder() {
		this.builder = fakeBuilder;
	}

	givenJavaScriptHandler() {
		this.handler = this.make(JavaScriptHandler);
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


	//-- When
	//--------------------------------------------------------

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


	//-- Then
	//--------------------------------------------------------

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
		this.thenShouldHaveAddedEntry('javascript', ...parameters);
	}

}


module.exports = JavaScriptHandlerTest;
