//--------------------------------------------------------
//-- Nwayo - Test - Unit - Services - Dependency Manager
//--------------------------------------------------------
'use strict';

const TestCase          = require('../../../TestCase');
const DependencyManager = require('../../../../dist/node/app/services/DependencyManager');
const FakeDriver        = require('./stubs/FakeDriver');
const FakeOtherDriver   = require('./stubs/FakeOtherDriver');


class DependencyManagerTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenDependencyManager();
		this.givenFakeDriverClassAsDefault();
		this.givenOtherDriverClass();
		this.givenNoFolder();
		this.givenMockedProcessCwd();
	}

	afterEach() {
		this.thenRestoreProcessCwd();
	}

	testHasNpmDriver() {
		this.whenCheckingForDriver('npm');
		this.thenResultShouldBe(true);
	}

	testCanInvokeDefaultDriverInCurrentWorkingDirectory() {
		this.whenGettingDriver();
		this.thenShouldHaveReceivedFakeDriverInstance();
		this.thenResultShouldHaveCurrentWorkingDirectoryAsFolder();
	}

	testCanInvokeDefaultDriverInSpecificFolder() {
		this.givenFakeFolder();
		this.whenGettingDriverInFolder();
		this.thenShouldHaveReceivedFakeDriverInstance();
		this.thenResultShouldHaveFakeFolderAsFolder();
	}

	testCanInvokeSpecificDriverInCurrentWorkingDirectory() {
		this.whenGettingOtherDriver();
		this.thenShouldHaveReceivedOtherDriverInstance();
		this.thenResultShouldHaveCurrentWorkingDirectoryAsFolder();
	}

	testCanInvokeSpecificDriverInSpecificWorkingDirectory() {
		this.givenFakeFolder();
		this.whenGettingOtherDriverInFolder();
		this.thenShouldHaveReceivedOtherDriverInstance();
		this.thenResultShouldHaveFakeFolderAsFolder();
	}

	testCanForwardCallToDefaultDriver() {
		this.whenGettingProperty('foo');
		this.thenShouldHaveReceivedFakeDriverFooValue();
	}


	//-- Given
	//--------------------------------------------------------

	givenDependencyManager() {
		this.dependencyManager = this.app.make(DependencyManager);
	}

	givenFakeDriverClassAsDefault() {
		this.dependencyManager.addDriver('fake', FakeDriver);
		this.dependencyManager.setDefaultDriver('fake');
	}

	givenOtherDriverClass() {
		this.dependencyManager.addDriver('other', FakeOtherDriver);
	}

	givenNoFolder() {
		this.folder = undefined;
	}

	givenFakeFolder() {
		this.folder = '/path/to/fake/folder';
	}

	givenMockedProcessCwd() {
		this.originalProcessCwd = process.cwd;
		this.cwd = '/path/to/current/working/directory';
		process.cwd = jest.fn(() => {
			return this.cwd;
		});
	}


	//-- When
	//--------------------------------------------------------

	whenCheckingForDriver(driver) {
		this.attempt(() => {
			this.setResult(this.dependencyManager.hasDriver(driver));
		});
	}

	whenGettingDriver() {
		this.attempt(() => {
			this.setResult(this.dependencyManager.driver());
		});
	}

	whenGettingDriverInFolder() {
		this.attempt(() => {
			this.setResult(this.dependencyManager.inFolder(this.folder));
		});
	}

	whenGettingOtherDriver() {
		this.attempt(() => {
			this.setResult(this.dependencyManager.driver('other'));
		});
	}

	whenGettingOtherDriverInFolder() {
		this.attempt(() => {
			this.setResult(this.dependencyManager.inFolderForDriver(this.folder, 'other'));
		});
	}

	whenGettingProperty(property) {
		this.attempt(() => {
			this.setResult(this.dependencyManager[property]);
		});
	}


	//-- Then
	//--------------------------------------------------------

	thenRestoreProcessCwd() {
		process.cwd = this.originalProcessCwd;
	}

	thenShouldHaveReceivedFakeDriverInstance() {
		this.thenResultShouldBeInstanceOf(FakeDriver);
	}

	thenShouldHaveReceivedOtherDriverInstance() {
		this.thenResultShouldBeInstanceOf(FakeOtherDriver);
	}

	thenResultShouldHaveCurrentWorkingDirectoryAsFolder() {
		this.thenResultShouldHaveProperty('folder', this.cwd);
	}

	thenResultShouldHaveFakeFolderAsFolder() {
		this.thenResultShouldHaveProperty('folder', this.folder);
	}

	thenShouldHaveReceivedFakeDriverFooValue() {
		this.thenResultShouldBe(FakeDriver.prototype.foo);
	}

}


module.exports = DependencyManagerTest;
