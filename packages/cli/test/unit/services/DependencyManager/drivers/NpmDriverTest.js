//--------------------------------------------------------
//-- Nwayo - Test - Unit - Services - Dependency Manager - Drivers - NPM Driver
//--------------------------------------------------------
'use strict';

const TestCase     = require('../../../../TestCase');
const NpmDriver    = require('../../../../../dist/node/app/services/DependencyManager/drivers/NpmDriver');
const fakeTerminal = require('./stubs/fakeTerminal');


class NpmDriverTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenFakeTerminal();
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

	givenFakeTerminal() {
		this.app.singleton('terminal', fakeTerminal);
	}

	givenFakeFolder() {
		this.folder = '/path/to/fake/folder';
	}

	givenNpmDriver() {
		this.driver = this.make(NpmDriver, { folder: this.folder });
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
		this.expect(fakeTerminal.spawn).toHaveBeenCalled();
		this.expect(fakeTerminal._spawnSpy).toHaveBeenCalled();
	}

	thenShouldHaveSpawnTimes(times) {
		this.thenShouldNotHaveThrown();
		this.expect(fakeTerminal.spawn).toHaveBeenCalledTimes(times);
		this.expect(fakeTerminal._spawnSpy).toHaveBeenCalledTimes(times);
	}

	thenShouldHaveNthCalledFromFakeFolder(nth) {
		this.thenShouldHaveSpawn();
		const spawnCall = fakeTerminal.spawn.mock.calls[nth - 1];
		this.expect(spawnCall).toBeTruthy();
		this.expect(spawnCall[2]).toHaveProperty('cwd', this.folder);
	}

	thenShouldHaveNthRunCommand(nth, binary, command) {
		this.thenShouldHaveSpawn();
		const spawnCall = fakeTerminal.spawn.mock.calls[nth - 1];
		this.expect(spawnCall).toBeTruthy();
		this.expect(spawnCall[0]).toBe(binary);
		this.expect(spawnCall[1]).toStrictEqual(command);
	}

	thenShouldHaveCalledFromFakeFolder() {
		this.thenShouldHaveNthCalledFromFakeFolder(1);
	}

	thenShouldHaveNthRunNpmCommand(nth, command) {
		this.thenShouldHaveNthRunCommand(nth, 'npm', command);
	}

	thenShouldHaveRunNpmCommand(command) {
		this.thenShouldHaveNthRunNpmCommand(1, command);
	}

}


module.exports = NpmDriverTest;
