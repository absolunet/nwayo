//--------------------------------------------------------
//-- Nwayo - Test - Unit - Services - Dependency Manager - Drivers - Driver Test Case
//--------------------------------------------------------
'use strict';

const TestCase            = require('../../../../TestCase');
const fakeTerminal        = require('./stubs/fakeTerminal');
const fakeAsyncFileSystem = require('./stubs/fakeAsyncFileSystem');


class DriverTestCase extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenFakeTerminal();
		this.givenFakeFolder();
		this.givenFakeAsyncFileSystem();
		this.givenPackageJson();
	}

	async testCanGetAllDependencies() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', 'file:lorem/ipsum', 'dependencies');
		this.givenDependency('baz', '7.8.9', 'devDependencies');
		this.givenDependency('qux', 'file:dolor/sit/amet', 'devDependencies');
		await this.whenGettingAll();
		this.thenResultShouldEqual({
			foo: '1.2.3',
			bar: 'file:lorem/ipsum'
		});
	}

	async testCanGetAllDevelopmentDependencies() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', 'file:lorem/ipsum', 'dependencies');
		this.givenDependency('baz', '7.8.9', 'devDependencies');
		this.givenDependency('qux', 'file:dolor/sit/amet', 'devDependencies');
		await this.whenGettingAll('devDependencies');
		this.thenResultShouldEqual({
			baz: '7.8.9',
			qux: 'file:dolor/sit/amet'
		});
	}

	async testCanCheckIfHasDependency() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', '7.8.9', 'dependencies');
		await this.whenCheckingIfHas('foo');
		this.thenResultShouldBe(true);
	}

	async testCanCheckIfHasDevelopmentDependency() {
		this.givenDependency('foo', '1.2.3', 'devDependencies');
		this.givenDependency('bar', '7.8.9', 'devDependencies');
		await this.whenCheckingIfHas('foo', 'devDependencies');
		this.thenResultShouldBe(true);
	}

	async testCanCheckIfDoesNotHaveDependency() {
		this.givenDependency('foo', '1.2.3', 'devDependencies');
		this.givenDependency('bar', '7.8.9', 'devDependencies');
		await this.whenCheckingIfHas('foo');
		this.thenResultShouldBe(false);
	}

	async testCanCheckIfDoesNotHaveDevelopmentDependency() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', '7.8.9', 'dependencies');
		await this.whenCheckingIfHas('foo', 'devDependencies');
		this.thenResultShouldBe(false);
	}

	async testCanCheckIfDependencyIsLocal() {
		this.givenDependency('foo', 'file:bar/baz', 'dependencies');
		await this.whenCheckingIfIsLocal('foo');
		this.thenResultShouldBe(true);
	}

	async testCanCheckIfDependencyIsNotLocal() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		await this.whenCheckingIfIsLocal('foo');
		this.thenResultShouldBe(false);
	}

	async testCanCheckIfDependencyIsExternal() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		await this.whenCheckingIfIsExternal('foo');
		this.thenResultShouldBe(true);
	}

	async testCanCheckIfDependencyIsNotExternal() {
		this.givenDependency('foo', 'file:bar/baz', 'dependencies');
		await this.whenCheckingIfIsExternal('foo');
		this.thenResultShouldBe(false);
	}

	async testCanCheckIfDevelopmentDependencyIsLocal() {
		this.givenDependency('foo', 'file:bar/baz', 'devDependencies');
		await this.whenCheckingIfIsLocal('foo', 'devDependencies');
		this.thenResultShouldBe(true);
	}

	async testCanCheckIfDevelopmentDependencyIsNotLocal() {
		this.givenDependency('foo', '1.2.3', 'devDependencies');
		await this.whenCheckingIfIsLocal('foo', 'devDependencies');
		this.thenResultShouldBe(false);
	}

	async testCanCheckIfDevelopmentDependencyIsExternal() {
		this.givenDependency('foo', '1.2.3', 'devDependencies');
		await this.whenCheckingIfIsExternal('foo', 'devDependencies');
		this.thenResultShouldBe(true);
	}

	async testCanCheckIfDevelopmentDependencyIsNotExternal() {
		this.givenDependency('foo', 'file:bar/baz', 'devDependencies');
		await this.whenCheckingIfIsExternal('foo', 'devDependencies');
		this.thenResultShouldBe(false);
	}

	async testCanSaveDependency() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', '4.5.6', 'devDependencies');
		await this.whenSaving('baz', '7.8.9');
		this.thenShouldHaveDependencies({
			foo: '1.2.3',
			baz: '7.8.9'
		}, 'dependencies');
		this.thenShouldHaveDependencies({
			bar: '4.5.6'
		}, 'devDependencies');
	}

	async testCanSaveDevelopmentDependency() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', '4.5.6', 'devDependencies');
		await this.whenSaving('baz', '7.8.9', 'devDependencies');
		this.thenShouldHaveDependencies({
			foo: '1.2.3'
		}, 'dependencies');
		this.thenShouldHaveDependencies({
			bar: '4.5.6',
			baz: '7.8.9'
		}, 'devDependencies');
	}

	async testCanSaveExistingDependency() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', '4.5.6', 'devDependencies');
		await this.whenSaving('foo', '7.8.9', 'dependencies');
		this.thenShouldHaveDependencies({
			foo: '7.8.9'
		}, 'dependencies');
		this.thenShouldHaveDependencies({
			bar: '4.5.6'
		}, 'devDependencies');
	}

	async testCanSaveExistingDevelopmentDependency() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', '4.5.6', 'devDependencies');
		await this.whenSaving('bar', '7.8.9', 'devDependencies');
		this.thenShouldHaveDependencies({
			foo: '1.2.3'
		}, 'dependencies');
		this.thenShouldHaveDependencies({
			bar: '7.8.9'
		}, 'devDependencies');
	}

	async testCanSaveLocalDependency() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', '4.5.6', 'devDependencies');
		await this.whenSavingLocal('baz', 'lorem/ipsum');
		this.thenShouldHaveDependencies({
			foo: '1.2.3',
			baz: 'file:lorem/ipsum'
		}, 'dependencies');
		this.thenShouldHaveDependencies({
			bar: '4.5.6'
		}, 'devDependencies');
	}

	async testCanSaveLocalDevelopmentDependency() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', '4.5.6', 'devDependencies');
		await this.whenSavingLocal('baz', 'lorem/ipsum', 'devDependencies');
		this.thenShouldHaveDependencies({
			foo: '1.2.3'
		}, 'dependencies');
		this.thenShouldHaveDependencies({
			bar: '4.5.6',
			baz: 'file:lorem/ipsum'
		}, 'devDependencies');
	}

	async testCanSaveExistingLocalDependency() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', '4.5.6', 'devDependencies');
		await this.whenSavingLocal('foo', 'lorem/ipsum');
		this.thenShouldHaveDependencies({
			foo: 'file:lorem/ipsum'
		}, 'dependencies');
		this.thenShouldHaveDependencies({
			bar: '4.5.6'
		}, 'devDependencies');
	}

	async testCanSaveExistingLocalDevelopmentDependency() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', '4.5.6', 'devDependencies');
		await this.whenSavingLocal('bar', 'lorem/ipsum', 'devDependencies');
		this.thenShouldHaveDependencies({
			foo: '1.2.3'
		}, 'dependencies');
		this.thenShouldHaveDependencies({
			bar: 'file:lorem/ipsum'
		}, 'devDependencies');
	}

	async testCanSaveMultipleDependencies() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', '4.5.6', 'devDependencies');
		await this.whenSavingMultiple({
			baz: '7.8.9',
			qux: '1.0.1'
		});
		this.thenShouldHaveDependencies({
			foo: '1.2.3',
			baz: '7.8.9',
			qux: '1.0.1'
		}, 'dependencies');
		this.thenShouldHaveDependencies({
			bar: '4.5.6'
		}, 'devDependencies');
	}

	async testCanSaveMultipleDevelopmentDependencies() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', '4.5.6', 'devDependencies');
		await this.whenSavingMultiple({
			baz: '7.8.9',
			qux: '1.0.1'
		}, 'devDependencies');
		this.thenShouldHaveDependencies({
			foo: '1.2.3'
		}, 'dependencies');
		this.thenShouldHaveDependencies({
			bar: '4.5.6',
			baz: '7.8.9',
			qux: '1.0.1'
		}, 'devDependencies');
	}

	async testCanSaveMultipleExistingDependencies() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', '4.5.6', 'dependencies');
		this.givenDependency('permanent', '1.0.0', 'dependencies');
		this.givenDependency('baz', '7.8.9', 'devDependencies');
		await this.whenSavingMultiple({
			foo: '1.0.1',
			bar: '2.1.3'
		});
		this.thenShouldHaveDependencies({
			foo: '1.0.1',
			bar: '2.1.3',
			permanent: '1.0.0'
		}, 'dependencies');
		this.thenShouldHaveDependencies({
			baz: '7.8.9'
		}, 'devDependencies');
	}

	async testCanSaveMultipleExistingDevelopmentDependencies() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('permanent', '1.0.0', 'devDependencies');
		this.givenDependency('bar', '4.5.6', 'devDependencies');
		this.givenDependency('baz', '7.8.9', 'devDependencies');
		await this.whenSavingMultiple({
			bar: '1.0.1',
			baz: '2.1.3'
		}, 'devDependencies');
		this.thenShouldHaveDependencies({
			foo: '1.2.3'
		}, 'dependencies');
		this.thenShouldHaveDependencies({
			permanent: '1.0.0',
			bar: '1.0.1',
			baz: '2.1.3'
		}, 'devDependencies');
	}

	async testCanSaveMultipleLocalDependencies() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', '4.5.6', 'devDependencies');
		await this.whenSavingMultipleLocal({
			baz: 'lorem/ipsum',
			qux: 'dolor/sit/amet'
		});
		this.thenShouldHaveDependencies({
			foo: '1.2.3',
			baz: 'file:lorem/ipsum',
			qux: 'file:dolor/sit/amet'
		}, 'dependencies');
		this.thenShouldHaveDependencies({
			bar: '4.5.6'
		}, 'devDependencies');
	}

	async testCanSaveMultipleLocalDevelopmentDependencies() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', '4.5.6', 'devDependencies');
		await this.whenSavingMultipleLocal({
			baz: 'lorem/ipsum',
			qux: 'dolor/sit/amet'
		}, 'devDependencies');
		this.thenShouldHaveDependencies({
			foo: '1.2.3'
		}, 'dependencies');
		this.thenShouldHaveDependencies({
			bar: '4.5.6',
			baz: 'file:lorem/ipsum',
			qux: 'file:dolor/sit/amet'
		}, 'devDependencies');
	}

	async testCanSaveMultipleExistingLocalDependencies() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', '4.5.6', 'dependencies');
		this.givenDependency('baz', '7.8.9', 'devDependencies');
		await this.whenSavingMultipleLocal({
			foo: 'lorem/ipsum',
			bar: 'dolor/sit/amet'
		});
		this.thenShouldHaveDependencies({
			foo: 'file:lorem/ipsum',
			bar: 'file:dolor/sit/amet'
		}, 'dependencies');
		this.thenShouldHaveDependencies({
			baz: '7.8.9'
		}, 'devDependencies');
	}

	async testCanSaveMultipleExistingLocalDevelopmentDependencies() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', '4.5.6', 'devDependencies');
		this.givenDependency('baz', '7.8.9', 'devDependencies');
		await this.whenSavingMultipleLocal({
			bar: 'lorem/ipsum',
			baz: 'dolor/sit/amet'
		}, 'devDependencies');
		this.thenShouldHaveDependencies({
			foo: '1.2.3'
		}, 'dependencies');
		this.thenShouldHaveDependencies({
			bar: 'file:lorem/ipsum',
			baz: 'file:dolor/sit/amet'
		}, 'devDependencies');
	}

	async testCanClearDependencies() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', '4.5.6', 'dependencies');
		this.givenDependency('baz', '7.8.9', 'devDependencies');
		await this.whenClearingDependencies();
		this.thenShouldHaveDependencies(undefined, 'dependencies');
		this.thenShouldHaveDependencies({
			baz: '7.8.9'
		}, 'devDependencies');
	}

	async testCanClearDevelopmentDependencies() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', '4.5.6', 'devDependencies');
		this.givenDependency('baz', '7.8.9', 'devDependencies');
		await this.whenClearingDependencies('devDependencies');
		this.thenShouldHaveDependencies({
			foo: '1.2.3'
		}, 'dependencies');
		this.thenShouldHaveDependencies(undefined, 'devDependencies');
	}

	async testCanClearLocalDependencies() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', 'file:lorem/ipsum', 'dependencies');
		this.givenDependency('baz', '7.8.9', 'devDependencies');
		await this.whenClearingLocalDependencies();
		this.thenShouldHaveDependencies({
			foo: '1.2.3'
		}, 'dependencies');
		this.thenShouldHaveDependencies({
			baz: '7.8.9'
		}, 'devDependencies');
	}

	async testCanClearLocalDevelopmentDependencies() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', 'file:lorem/ipsum', 'devDependencies');
		this.givenDependency('baz', '7.8.9', 'devDependencies');
		await this.whenClearingLocalDependencies('devDependencies');
		this.thenShouldHaveDependencies({
			foo: '1.2.3'
		}, 'dependencies');
		this.thenShouldHaveDependencies({
			baz: '7.8.9'
		}, 'devDependencies');
	}

	async testCanClearExternalDependencies() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', 'file:lorem/ipsum', 'dependencies');
		this.givenDependency('baz', '7.8.9', 'devDependencies');
		this.givenDependency('qux', 'file:dolor/sit/amet', 'devDependencies');
		await this.whenClearingExternalDependencies();
		this.thenShouldHaveDependencies({
			bar: 'file:lorem/ipsum'
		}, 'dependencies');
		this.thenShouldHaveDependencies({
			baz: '7.8.9',
			qux: 'file:dolor/sit/amet'
		}, 'devDependencies');
	}

	async testCanClearExternalDevelopmentDependencies() {
		this.givenDependency('foo', '1.2.3', 'dependencies');
		this.givenDependency('bar', 'file:lorem/ipsum', 'dependencies');
		this.givenDependency('baz', '7.8.9', 'devDependencies');
		this.givenDependency('qux', 'file:dolor/sit/amet', 'devDependencies');
		await this.whenClearingExternalDependencies('devDependencies');
		this.thenShouldHaveDependencies({
			foo: '1.2.3',
			bar: 'file:lorem/ipsum'
		}, 'dependencies');
		this.thenShouldHaveDependencies({
			qux: 'file:dolor/sit/amet'
		}, 'devDependencies');
	}

	async testCanLoadPackageJson() {
		await this.whenLoadingPackageJson();
		this.thenShouldHaveReceivedPackageJson();
	}

	async testCanSavePackageJson() {
		this.givenOtherPackageJson();
		await this.whenSavingOtherPackageJson();
		this.thenShouldHaveSavedOtherPackageJson();
	}


	//-- Given
	//--------------------------------------------------------

	givenFakeTerminal() {
		this.app.singleton('terminal', fakeTerminal);
	}

	givenFakeFolder() {
		this.folder = '/path/to/fake/folder';
	}

	givenFakeAsyncFileSystem() {
		this.app.singleton('file.system.async', fakeAsyncFileSystem);
		fakeAsyncFileSystem._files = {};
	}

	givenDriver(Driver) {
		this.driver = this.make(Driver, { folder: this.folder });
	}

	givenPackageJson() {
		fakeAsyncFileSystem._files[`${this.folder}/package.json`] = {
			'private': true,
			'license': 'UNLICENSED'
		};
	}

	givenDependency(dependency, version, type) {
		this.packageJson[type] = this.packageJson[type] || {};
		this.packageJson[type][dependency] = version;
	}

	givenOtherPackageJson() {
		this.otherPackageJson = {
			'private': true,
			'license': 'OTHER_UNLICENSED'
		};
	}


	//-- When
	//--------------------------------------------------------

	async whenCalling(method, parameters = []) {
		await this.attemptAsync(async () => {
			const result = await this.driver[method](...parameters);
			this.setResult(result);
		});
	}

	async whenInstalling() {
		await this.whenCalling('install');
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

	async whenGettingAll(...parameters) {
		await this.whenCalling('all', parameters);
	}

	async whenCheckingIfHas(...parameters) {
		await this.whenCalling('has', parameters);
	}

	async whenCheckingIfIsLocal(...parameters) {
		await this.whenCalling('isLocal', parameters);
	}

	async whenCheckingIfIsExternal(...parameters) {
		await this.whenCalling('isExternal', parameters);
	}

	async whenSaving(...parameters) {
		await this.whenCalling('save', parameters);
	}

	async whenSavingLocal(...parameters) {
		await this.whenCalling('saveLocal', parameters);
	}

	async whenSavingMultiple(...parameters) {
		await this.whenCalling('saveMultiple', parameters);
	}

	async whenSavingMultipleLocal(...parameters) {
		await this.whenCalling('saveMultipleLocal', parameters);
	}

	async whenClearingDependencies(...parameters) {
		await this.whenCalling('clear', parameters);
	}

	async whenClearingLocalDependencies(...parameters) {
		await this.whenCalling('clearLocal', parameters);
	}

	async whenClearingExternalDependencies(...parameters) {
		await this.whenCalling('clearExternal', parameters);
	}

	async whenLoadingPackageJson() {
		await this.whenCalling('loadPackageJson');
	}

	async whenSavingOtherPackageJson() {
		await this.whenCalling('savePackageJson', [this.otherPackageJson]);
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

	thenShouldHaveDependencies(dependencies, type) {
		this.thenShouldNotHaveThrown();
		this.expect(this.packageJson[type]).toStrictEqual(dependencies);
	}

	thenShouldHaveReceivedPackageJson() {
		this.thenResultShouldEqual(this.packageJson);
	}

	thenShouldHaveSavedOtherPackageJson() {
		this.thenShouldNotHaveThrown();
		this.expect(this.packageJson).toStrictEqual(this.otherPackageJson);
	}

	get packageJson() {
		return fakeAsyncFileSystem._files[`${this.folder}/package.json`];
	}

}


module.exports = DriverTestCase;
