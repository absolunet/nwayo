//--------------------------------------------------------
//-- Node IoC - Test - Integration - Services - Builder - Drivers - Laravel Mix Driver
//--------------------------------------------------------
'use strict';

const TestCase = require('../../../../../TestCase');


class LaravelMixDriverTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		jest.resetModules();
		this.givenLocalDependencies();
		this.givenFakeProjectService();
		this.givenSpiedEventDispatcher();
		this.givenLaravelMixDriver();
		this.givenFakeAppNameInConfigRepository();
	}

	afterAll() {
		// this.thenDeleteDistributionFiles();
	}

	async testCanCompileScssFile() {
		await this.compile('scss', '.scss', '.css');
	}

	async testCanCompileLessFile() {
		await this.compile('less', '.less', '.css');
	}

	async testCanCompileStylusFile() {
		await this.compile('stylus', '.styl', '.css');
	}

	async testCanCompileJavascriptFile() {
		await this.compile('javascript', '.js', '.js');
	}

	async testCanCompileTypescriptFile() {
		await this.compile('typescript', '.ts', '.js');
	}

	async testCanCompileReactFile() {
		await this.compile('react', '.js', '.js');
	}

	async testCanCompileVueFile() {
		await this.compile('vue', '.vanilla.js', '.vanilla.js');
	}

	async testCanCompileVueScssFile() {
		await this.compile('vue', '.scss.js', '.scss.js');
	}

	async testCanCompileVueLessFile() {
		await this.compile('vue', '.less.js', '.less.js');
	}

	async testCanCompileVueStylusFile() {
		await this.compile('vue', '.stylus.js', '.stylus.js');
	}

	async testCanCopyFile() {
		await this.compile('copy', '.txt', '.txt');
	}

	async testCanCopyDirectory() {
		await this.compileWithoutMatch('copy', '', '');
		['foo/bar.txt', 'baz/qux.txt'].forEach((file) => {
			this.thenFilesShouldMatch(
				this.inDistribution(`copy/${file}`),
				this.inSnapshot(`copy/${file}`)
			);
		});
	}


	givenLocalDependencies() {
		this.app.setEnvironment('test');
		this.fileManager = this.make('file');
		this.fixturePath = this.app.formatPath(__dirname, 'fixture');
		this.sourcePath = this.app.formatPath(this.fixturePath, 'src');
		this.distributionPath = this.app.formatPath(this.fixturePath, 'dist');
		this.snapshotPath = this.app.formatPath(this.fixturePath, 'snapshots');
	}

	givenFakeProjectService() {
		this.app.singleton('nwayo.project', require('./stubs/fakeProjectService')); // eslint-disable-line global-require
	}

	givenSpiedEventDispatcher() {
		this.app.decorate('event', (event) => {
			Object.getOwnPropertyNames(event.constructor.prototype).forEach((name) => {
				jest.spyOn(event, name);
			});

			return event;
		});
	}

	givenLaravelMixDriver() {
		this.driver = this.app.make(require('../../../../../../dist/node/services/Builder/drivers/LaravelMixDriver')); // eslint-disable-line global-require
	}

	givenFakeAppNameInConfigRepository() {
		this.make('config').set('app.name', 'Fake app name');
	}

	givenEntry(...parameters) {
		this.driver.addEntry(...parameters);
	}

	async whenCompiling() {
		await this.attemptAsync(async () => {
			const config = this.driver.buildConfig();
			await this.driver.run(config);
		});
	}

	thenFilesShouldMatch(a, b) {
		this.thenShouldNotHaveThrown();
		this.expect(this.fileManager.driver('text').load(a)).toBe(this.fileManager.driver('text').load(b));
	}

	thenDeleteDistributionFiles() {
		this.app.make('file.system.sync').emptyDir(this.distributionPath);
	}

	inSource(path) {
		return this.app.formatPath(this.sourcePath, path);
	}

	inDistribution(path) {
		return this.app.formatPath(this.distributionPath, path);
	}

	inSnapshot(path) {
		return this.app.formatPath(this.snapshotPath, path);
	}

	async compile(type, sourceExtension, destinationExtension) {
		await this.compileWithoutMatch(type, sourceExtension, destinationExtension);
		this.thenFilesShouldMatch(
			this.inDistribution(`${type}${destinationExtension}`),
			this.inSnapshot(`${type}${destinationExtension}`)
		);
	}

	async compileWithoutMatch(type, sourceExtension, destinationExtension) {
		this.givenEntry(type, {
			source: this.inSource(`${type}${sourceExtension}`),
			destination: this.inDistribution(`${type}${destinationExtension}`)
		});
		await this.whenCompiling();
	}

}


module.exports = LaravelMixDriverTest;
