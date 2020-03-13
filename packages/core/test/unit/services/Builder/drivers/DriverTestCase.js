//--------------------------------------------------------
//-- Node IoC - Test - Unit - Services - Builder - Drivers - Driver Test Case
//--------------------------------------------------------
'use strict';

const { NotImplementedError } = require('@absolunet/ioc');
const TestCase                = require('../../../../TestCase');
const fakeProjectService      = require('./stubs/fakeProjectService');


class DriverTestCase extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenFakeProjectService();
		this.givenDriver();
		this.givenFakePathAsEntry();
	}

	testCanAddJavaScriptEntry() {
		this.givenSourceExtension('js');
		this.givenDestinationExtension('js');
		this.whenAddingEntry('javascript');
		this.thenJavaScriptEntryShouldHaveBeenAdded();
	}

	testCanAddScssEntry() {
		this.givenSourceExtension('scss');
		this.givenDestinationExtension('css');
		this.whenAddingEntry('scss');
		this.thenScssEntryShouldHaveBeenAdded();
	}

	testCanAddLessEntry() {
		this.givenSourceExtension('less');
		this.givenDestinationExtension('css');
		this.whenAddingEntry('less');
		this.thenLessEntryShouldHaveBeenAdded();
	}

	testCanAddStylusEntry() {
		this.givenSourceExtension('stylus');
		this.givenDestinationExtension('css');
		this.whenAddingEntry('stylus');
		this.thenStylusEntryShouldHaveBeenAdded();
	}

	testCanAddReactEntry() {
		this.givenSourceExtension('js');
		this.givenDestinationExtension('js');
		this.whenAddingEntry('react');
		this.thenReactEntryShouldHaveBeenAdded();
	}

	testCanAddTypeScriptEntry() {
		this.givenSourceExtension('ts');
		this.givenDestinationExtension('js');
		this.whenAddingEntry('typescript');
		this.thenTypeScriptEntryShouldHaveBeenAdded();
	}

	testCanAddCopyEntry() {
		this.givenSourceExtension('txt');
		this.givenDestinationExtension('txt');
		this.whenAddingEntry('copy');
		this.thenCopyEntryShouldHaveBeenAdded();
	}

	testCanAddCopyDirectoryEntry() {
		this.whenAddingEntry('copy');
		this.thenCopyDirectoryEntryShouldHaveBeenAdded();
	}


	//-- Given
	//--------------------------------------------------------

	givenFakeProjectService() {
		this.app.singleton('nwayo.project', fakeProjectService);
	}

	givenDriver() {
		this.driver = this.getDriver();
	}

	givenFakePathAsEntry() {
		this.entry = {
			source:      '/path/to/source',
			destination: '/path/to/destination'
		};
	}

	givenSourceExtension(extension) {
		this.entry.source += `.${extension}`;
	}

	givenDestinationExtension(extension) {
		this.entry.destination += `.${extension}`;
	}


	//-- When
	//--------------------------------------------------------

	whenAddingEntry(type) {
		this.attempt(() => {
			this.setResult(this.driver.addEntry(type, this.entry));
		});
	}


	//-- Then
	//--------------------------------------------------------

	/**
	 * @abstract
	 */
	thenJavaScriptEntryShouldHaveBeenAdded() {
		throw new NotImplementedError(this, 'thenJavaScriptEntryShouldHaveBeenAdded');
	}

	/**
	 * @abstract
	 */
	thenScssEntryShouldHaveBeenAdded() {
		throw new NotImplementedError(this, 'thenScssEntryShouldHaveBeenAdded');
	}

	/**
	 * @abstract
	 */
	thenLessEntryShouldHaveBeenAdded() {
		throw new NotImplementedError(this, 'thenLessEntryShouldHaveBeenAdded');
	}

	/**
	 * @abstract
	 */
	thenStylusEntryShouldHaveBeenAdded() {
		throw new NotImplementedError(this, 'thenStylusEntryShouldHaveBeenAdded');
	}

	/**
	 * @abstract
	 */
	thenReactEntryShouldHaveBeenAdded() {
		throw new NotImplementedError(this, 'thenReactEntryShouldHaveBeenAdded');
	}

	/**
	 * @abstract
	 */
	thenTypeScriptEntryShouldHaveBeenAdded() {
		throw new NotImplementedError(this, 'thenTypeScriptEntryShouldHaveBeenAdded');
	}

	/**
	 * @abstract
	 */
	thenCopyEntryShouldHaveBeenAdded() {
		throw new NotImplementedError(this, 'thenCopyEntryShouldHaveBeenAdded');
	}

	/**
	 * @abstract
	 */
	thenCopyDirectoryEntryShouldHaveBeenAdded() {
		throw new NotImplementedError(this, 'thenCopyDirectoryEntryShouldHaveBeenAdded');
	}


	//-- Helpers
	//--------------------------------------------------------

	/**
	 * @returns {nwayo.core.services.Builder.drivers.Driver} The driver to test.
	 * @abstract
	 */
	getDriver() {
		throw new NotImplementedError(this, 'getDriver', 'Driver');
	}

}


module.exports = DriverTestCase;
