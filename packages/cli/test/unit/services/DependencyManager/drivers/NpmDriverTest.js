//--------------------------------------------------------
//-- nwayo - Test - Unit - Services - Dependency Manager - Drivers - NPM Driver
//--------------------------------------------------------
'use strict';

const TestCase  = require('../../../../TestCase');
const NpmDriver = require('../../../../../dist/node/app/services/DependencyManager/drivers/NpmDriver');


class NpmDriverTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenMockedSpawn();
		this.givenFakeFolder();
		this.givenNpmDriver();
		this.givenExitCode(0);
		this.givenPackageName(undefined);
		this.givenPackageVersion(undefined);
	}

	async testCanInstallPackages() {
		await this.whenInstalling();
		this.thenShouldHaveCalledFromFakeFolder();
		this.thenShouldHaveRunNpmCommand(['install']);
	}

	async testCanAddPackage() {
		this.givenPackageName('@nwayo/core');
		await this.whenAdding();
		this.thenShouldHaveCalledFromFakeFolder();
		this.thenShouldHaveRunNpmCommand(['install', '@nwayo/core']);
	}

	async testCanAddPackageWithSpecificVersion() {
		this.givenPackageName('@nwayo/core');
		this.givenPackageVersion('4.0.0');
		await this.whenAdding();
		this.thenShouldHaveCalledFromFakeFolder();
		this.thenShouldHaveRunNpmCommand(['install', '@nwayo/core@4.0.0']);
	}

	async testCanUpdatePackage() {
		this.givenPackageName('@nwayo/core');
		await this.whenUpdating();
		this.thenShouldHaveCalledFromFakeFolder();
		this.thenShouldHaveRunNpmCommand(['update', '@nwayo/core']);
	}

	async testCanUpdatePackageToSpecificVersion() {
		this.givenPackageName('@nwayo/core');
		this.givenPackageVersion('4.0.0');
		await this.whenUpdating();
		this.thenShouldHaveCalledFromFakeFolder();
		this.thenShouldHaveNthRunNpmCommand(1, ['uninstall', '@nwayo/core']);
		this.thenShouldHaveNthRunNpmCommand(2, ['install', '@nwayo/core@4.0.0']);
	}

	async testCanRemovePackage() {
		this.givenPackageName('@nwayo/core');
		await this.whenRemoving();
		this.thenShouldHaveCalledFromFakeFolder();
		this.thenShouldHaveRunNpmCommand(['uninstall', '@nwayo/core']);
	}


	//-- Given
	//--------------------------------------------------------

	givenMockedSpawn() {
		jest.mock('child_process', () => {
			this.fakeSpawnProcess = {
				on: jest.fn((name, callback) => {
					callback(this.code);
				})
			};
			const spawn     = jest.fn(() => { return this.fakeSpawnProcess; });
			this.spiedSpawn = spawn;

			return { spawn };
		});
	}

	givenFakeFolder() {
		this.folder = '/path/to/fake/folder';
	}

	givenNpmDriver() {
		this.driver = this.app.make(NpmDriver, { folder: this.folder });
	}

	givenExitCode(code) {
		this.code = code;
	}

	givenPackageName(name) {
		this.package = name;
	}

	givenPackageVersion(version) {
		this.version = version;
	}


	//-- When
	//--------------------------------------------------------

	async whenCalling(method, parameters) {
		await this.attemptAsync(async () => {
			await this.driver[method](...parameters);
		});
	}

	async whenInstalling() {
		await this.whenCalling('install', []);
	}

	async whenAdding() {
		await this.whenCalling('add', [this.package, this.version]);
	}

	async whenUpdating() {
		await this.whenCalling('update', [this.package, this.version]);
	}

	async whenRemoving() {
		await this.whenCalling('remove', [this.package]);
	}


	//-- Then
	//--------------------------------------------------------

	thenShouldHaveSpawn() {
		this.thenShouldNotHaveThrown();
		this.expect(this.spiedSpawn).toHaveBeenCalled();
	}

	thenShouldHaveSpawnTimes(times) {
		this.thenShouldNotHaveThrown();
		this.expect(this.spiedSpawn).toHaveBeenCalledTimes(times);
	}

	thenShouldHaveNthCalledFromFakeFolder(nth) {
		this.thenShouldHaveSpawn();
		const spawnCall = this.spiedSpawn.mock.calls[nth - 1];
		this.expect(spawnCall).toBeTruthy();
		this.expect(spawnCall[2]).toHaveProperty('cwd', this.folder);
	}

	thenShouldHaveNthRunCommand(nth, binary, command) {
		this.thenShouldHaveSpawn();
		const spawnCall = this.spiedSpawn.mock.calls[nth - 1];
		this.expect(spawnCall).toBeTruthy();
		this.expect(spawnCall[0]).toBe(binary);
		this.expect(spawnCall[1]).toStrictEqual(command);
	}

	thenShouldHaveCalledFromFakeFolder() {
		this.thenShouldHaveNthCalledFromFakeFolder(1);
	}

	thenShouldHaveRunCommand(binary, command) {
		this.thenShouldHaveNthRunCommand(1, binary, command);
	}

	thenShouldHaveNthRunNpmCommand(nth, command) {
		this.thenShouldHaveNthRunCommand(nth, 'npm', command);
	}

	thenShouldHaveRunNpmCommand(command) {
		this.thenShouldHaveNthRunNpmCommand(1, command);
	}

}


module.exports = NpmDriverTest;
