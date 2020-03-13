//--------------------------------------------------------
//-- Nwayo - Test - Unit - Services - Context Service
//--------------------------------------------------------
'use strict';

const TestCase           = require('../../TestCase');
const ContextService = require('../../../dist/node/app/services/ContextService');
const fakeFileManager    = require('./stubs/fakeFileManager');


class ContextServiceTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenFakeFileManager();
		this.givenContextService();
		this.givenMockedProcessCwd();
	}

	afterEach() {
		super.afterEach();
		this.thenRestoreProcessCwd();
	}

	testShouldBeConsideredInApplicationIfInBasePath() {
		this.givenFakeBasePath();
		this.givenSameCurrentWorkingDirectoryAsBasePath();
		this.whenCheckingIfInCliFolder();
		this.thenResultShouldBe(true);
	}

	testShouldBeConsideredOutOfApplicationIfNotInBasePath() {
		this.givenFakeBasePath();
		this.givenDifferentCurrentWorkingDirectoryAsBasePath();
		this.whenCheckingIfInCliFolder();
		this.thenResultShouldBe(false);
	}

	testShouldBeConsideredNotLegacyProjectIfHasNoNwayoYaml() {
		this.givenWorkingDirectory('/path/to/root');
		this.givenFile('/path/to/some/folder/nwayo.yaml', { root: './', legacy: true });
		this.whenCheckingIfLegacy();
		this.thenResultShouldBe(false);
	}

	testShouldBeConsideredLegacyProjectIfHasNwayoYamlWithLegacyOption() {
		this.givenWorkingDirectory('/path/to/root');
		this.givenFile('/path/to/root/nwayo.yaml', { root: './', legacy: true });
		this.whenCheckingIfLegacy();
		this.thenResultShouldBe(true);
	}

	testShouldBeConsideredNotLegacyProjectIfHasNwayoYamlWithoutLegacyOption() {
		this.givenWorkingDirectory('/path/to/root');
		this.givenFile('/path/to/root/nwayo.yaml', { root: './' });
		this.whenCheckingIfLegacy();
		this.thenResultShouldBe(false);
	}

	testShouldBeConsideredNotLegacyProjectIfInApplication() {
		this.givenWorkingDirectory('/path/to/root');
		this.givenFile('/path/to/root/nwayo.yaml', { root: './', legacy: false });
		this.whenCheckingIfLegacy();
		this.thenResultShouldBe(false);
	}


	//-- Given
	//--------------------------------------------------------

	givenFakeFileManager() {
		this.app.singleton('file', fakeFileManager);
		fakeFileManager._fakeFiles = {};
	}

	givenContextService() {
		this.contextService = this.app.make(ContextService);
	}

	givenMockedProcessCwd() {
		this.originalProcessCwd = process.cwd;
		process.cwd = jest.fn(() => {
			return this.currentDirectory;
		});
	}

	givenFakeBasePath() {
		this.app.useBasePath('/path/to/fake/basepath');
	}

	givenWorkingDirectory(directory) {
		this.currentDirectory = directory;
	}

	givenSameCurrentWorkingDirectoryAsBasePath() {
		this.givenWorkingDirectory('/path/to/fake/basepath');
	}

	givenDifferentCurrentWorkingDirectoryAsBasePath() {
		this.givenWorkingDirectory('/path/to/other/cwd');
	}

	givenFile(path, content) {
		fakeFileManager._fakeFiles[path] = content;
	}


	//-- When
	//--------------------------------------------------------

	whenCheckingIfInCliFolder() {
		this.attempt(() => {
			this.setResult(this.contextService.isInCliFolder());
		});
	}

	whenCheckingIfLegacy() {
		this.attempt(() => {
			this.setResult(this.contextService.projectIsLegacy());
		});
	}


	//-- Then
	//--------------------------------------------------------

	thenRestoreProcessCwd() {
		process.cwd = this.originalProcessCwd;
	}

}


module.exports = ContextServiceTest;
