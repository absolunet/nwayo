//--------------------------------------------------------
//-- Nwayo - Test - Unit - Servies - Legacy - Nwayo Legacy Service
//--------------------------------------------------------
'use strict';

const TestCase           = require('../../../TestCase');
const NwayoLegacyService = require('../../../../dist/node/app/services/legacy/NwayoLegacyService');
const fakeFileManager    = require('./stubs/fakeFileManager');


class NwayoLegacyServiceTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenFakeFileManager();
		this.givenNwayoLegacyService();
		this.givenMockedProcessCwd();
	}

	afterEach() {
		super.afterEach();
		this.thenRestoreProcessCwd();
	}

	testShouldBeConsideredInApplicationIfInBasePath() {
		this.givenFakeBasePath();
		this.givenSameCurrentWorkingDirectoryAsBasePath();
		this.whenCheckingIfInApplication();
		this.thenResultShouldBe(true);
	}

	testShouldBeConsideredOutOfApplicationIfNotInBasePath() {
		this.givenFakeBasePath();
		this.givenDifferentCurrentWorkingDirectoryAsBasePath();
		this.whenCheckingIfInApplication();
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

	givenNwayoLegacyService() {
		this.nwayoLegacyService = this.app.make(NwayoLegacyService);
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

	whenCheckingIfInApplication() {
		this.attempt(() => {
			this.setResult(this.nwayoLegacyService.projectIsCurrentlyInApp());
		});
	}

	whenCheckingIfLegacy() {
		this.attempt(() => {
			this.setResult(this.nwayoLegacyService.projectIsLegacy());
		});
	}


	//-- Then
	//--------------------------------------------------------

	thenRestoreProcessCwd() {
		process.cwd = this.originalProcessCwd;
	}

}


module.exports = NwayoLegacyServiceTest;
