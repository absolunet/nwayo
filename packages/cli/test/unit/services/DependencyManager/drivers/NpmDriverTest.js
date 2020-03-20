//--------------------------------------------------------
//-- Nwayo - Test - Unit - Services - Dependency Manager - Drivers - NPM Driver
//--------------------------------------------------------
'use strict';

const DriverTestCase = require('./DriverTestCase');
const NpmDriver      = require('../../../../../dist/node/app/services/DependencyManager/drivers/NpmDriver');


class NpmDriverTest extends DriverTestCase {

	beforeEach() {
		super.beforeEach();
		this.givenNpmDriver();
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

	givenNpmDriver() {
		this.givenDriver(NpmDriver);
	}

	givenPackageName(name) {
		this.package = name;
	}

	givenPackageVersion(version) {
		this.version = version;
	}


	//-- Then
	//--------------------------------------------------------

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
