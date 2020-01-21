//--------------------------------------------------------
//-- Node IoC - Test - Unit - Services - Project Service
//--------------------------------------------------------
'use strict';

const TestCase = require('../../TestCase');
const ProjectService = require('../../../dist/node/services/ProjectService');
const fakeFileManager = require('./stubs/fakeFileManager');


class ProjectServiceTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenMockedProcessCwd();
		this.givenFakeFileManager();
		this.givenProjectService();
	}

	afterEach() {
		this.thenRestoreProcessCwd();
	}

	testCanGetRootPath() {
		this.whenGettingRootPath();
		this.thenResultShouldBe('/path/to/current/working/directory');
	}

	testCanGetSourcesPath() {
		this.whenGettingSourcePath();
		this.thenResultShouldBe('/path/to/current/working/directory/src');
	}

	testCanGetBundlesPath() {
		this.whenGettingBundlesPath();
		this.thenResultShouldBe('/path/to/current/working/directory/src/bundles');
	}

	testCanGetSingleBundlePath() {
		this.whenGettingBundlePath('my-bundle');
		this.thenResultShouldBe('/path/to/current/working/directory/src/bundles/my-bundle');
	}

	testCanGetComponentsPath() {
		this.whenGettingComponentsPath();
		this.thenResultShouldBe('/path/to/current/working/directory/src/components');
	}

	testCanGetSingleLocalComponentPath() {
		this.whenGettingComponentPath('my-component');
		this.thenResultShouldBe('/path/to/current/working/directory/src/components/my-component');
	}

	testCanGetSingleNwayoComponentPath() {
		this.givenFolder('/path/to/current/working/directory/src/node_modules/@nwayo/component-my-component');
		this.whenGettingComponentPath('my-component');
		this.thenResultShouldBe('/path/to/current/working/directory/src/node_modules/@nwayo/component-my-component');
	}

	testCanGetSingleNwayoComponentsComponentPath() {
		this.givenFolder('/path/to/current/working/directory/src/node_modules/@nwayo-components/my-component');
		this.whenGettingComponentPath('my-component');
		this.thenResultShouldBe('/path/to/current/working/directory/src/node_modules/@nwayo-components/my-component');
	}

	testCanGetSingleNamespacedComponentPath() {
		this.givenNamespace('@some-namespace/');
		this.givenFolder('/path/to/current/working/directory/src/node_modules/@some-namespace/my-component');
		this.whenGettingComponentPath('my-component');
		this.thenResultShouldBe('/path/to/current/working/directory/src/node_modules/@some-namespace/my-component');
	}

	testCanGetSingleLocalComponentPathIfExistingInNodeModulesButWithoutExplicitNamespace() {
		this.givenNamespace('@some-namespace/');
		this.whenGettingComponentPath('my-component');
		this.thenResultShouldBe('/path/to/current/working/directory/src/components/my-component');
	}

	testCanGetListOfExistingBundles() {
		this.givenFolder('/path/to/current/working/directory/src/bundles/foo');
		this.givenFolder('/path/to/current/working/directory/src/bundles/bar');
		this.whenGettingBundles();
		this.thenResultShouldEqual(['foo', 'bar']);
	}

	testThrowsWhenGettingEmptyBundle() {
		this.givenFolder('/path/to/current/working/directory/src/bundles/foo');
		this.whenLoadingBundleData('foo');
		this.thenShouldHaveThrown();
	}

	testCanGetEmptyBundleData() {
		this.givenFolder('/path/to/current/working/directory/src/bundles/foo');
		this.givenFile('/path/to/current/working/directory/src/bundles/foo/config/bundle.yaml', {
			name: 'Foo',
			description: 'Foo description',
			output: '../../../dist',
			url: '/dist'
		});

		this.whenLoadingBundleData('foo');

		this.thenShouldHaveReceivedConfigFrom({
			bundle: '/path/to/current/working/directory/src/bundles/foo/config/bundle.yaml'
		});
		this.thenShouldHaveReceivedBundlePath('/path/to/current/working/directory/src/bundles/foo');
		this.thenShouldHaveReceivedBundleName('foo');
		this.thenShouldHaveReceivedOutputPath('/path/to/current/working/directory/dist');
		this.thenShouldHaveReceivedNoFiles();
	}

	testCanGetConfigOnlyBundleData() {
		this.givenFolder('/path/to/current/working/directory/src/bundles/foo');
		this.givenFile('/path/to/current/working/directory/src/bundles/foo/config/bundle.yaml', {
			name: 'Foo',
			description: 'Foo description',
			output: '../../../dist',
			url: '/dist'
		});
		this.givenFile('/path/to/current/working/directory/src/bundles/foo/config/foo.yaml', {
			bar: 'baz'
		});

		this.whenLoadingBundleData('foo');

		this.thenShouldHaveReceivedConfigFrom({
			bundle: '/path/to/current/working/directory/src/bundles/foo/config/bundle.yaml',
			foo: '/path/to/current/working/directory/src/bundles/foo/config/foo.yaml'
		});
		this.thenShouldHaveReceivedBundlePath('/path/to/current/working/directory/src/bundles/foo');
		this.thenShouldHaveReceivedBundleName('foo');
		this.thenShouldHaveReceivedOutputPath('/path/to/current/working/directory/dist');
		this.thenShouldHaveReceivedNoFiles();
	}

	testCanGetScriptsOnlyBundleData() {
		this.givenFolder('/path/to/current/working/directory/src/bundles/foo');
		this.givenFile('/path/to/current/working/directory/src/bundles/foo/config/bundle.yaml', {
			name: 'Foo',
			description: 'Foo description',
			output: '../../../dist',
			url: '/dist'
		});
		this.givenFile('/path/to/current/working/directory/src/bundles/foo/scripts/main.js', `console.log('main');\n`);
		this.givenFile('/path/to/current/working/directory/src/bundles/foo/scripts/some/other.js', `console.log('other');\n`);

		this.whenLoadingBundleData('foo');

		this.thenShouldHaveReceivedConfigFrom({
			bundle: '/path/to/current/working/directory/src/bundles/foo/config/bundle.yaml'
		});
		this.thenShouldHaveReceivedBundlePath('/path/to/current/working/directory/src/bundles/foo');
		this.thenShouldHaveReceivedBundleName('foo');
		this.thenShouldHaveReceivedOutputPath('/path/to/current/working/directory/dist');
		this.thenShouldHaveReceivedFiles([
			{
				localPath: 'scripts/main.js',
				name: 'main.js',
				path: '/path/to/current/working/directory/src/bundles/foo/scripts/main.js'
			},
			{
				localPath: 'scripts/some/other.js',
				name: 'other.js',
				path: '/path/to/current/working/directory/src/bundles/foo/scripts/some/other.js'
			}
		]);
	}

	testCanGetStylesOnlyBundleData() {
		this.givenFolder('/path/to/current/working/directory/src/bundles/foo');
		this.givenFile('/path/to/current/working/directory/src/bundles/foo/config/bundle.yaml', {
			name: 'Foo',
			description: 'Foo description',
			output: '../../../dist',
			url: '/dist'
		});
		this.givenFile('/path/to/current/working/directory/src/bundles/foo/styles/main.scss', `@include 'config';\n\nbody {\n\tcolor: $red;\n}\n`);
		this.givenFile('/path/to/current/working/directory/src/bundles/foo/styles/_config.scss', `red: red;\n`);
		this.givenFile('/path/to/current/working/directory/src/bundles/foo/styles/some/other.scss', `body {\n\tcolor: blue;\n}\n`);

		this.whenLoadingBundleData('foo');

		this.thenShouldHaveReceivedConfigFrom({
			bundle: '/path/to/current/working/directory/src/bundles/foo/config/bundle.yaml'
		});
		this.thenShouldHaveReceivedBundlePath('/path/to/current/working/directory/src/bundles/foo');
		this.thenShouldHaveReceivedBundleName('foo');
		this.thenShouldHaveReceivedOutputPath('/path/to/current/working/directory/dist');
		this.thenShouldHaveReceivedFiles([
			{
				localPath: 'styles/main.scss',
				name: 'main.scss',
				path: '/path/to/current/working/directory/src/bundles/foo/styles/main.scss'
			},
			{
				localPath: 'styles/some/other.scss',
				name: 'other.scss',
				path: '/path/to/current/working/directory/src/bundles/foo/styles/some/other.scss'
			}
		]);
	}

	testCanGetCompleteBundleData() {
		this.givenFolder('/path/to/current/working/directory/src/bundles/foo');
		this.givenFile('/path/to/current/working/directory/src/bundles/foo/config/bundle.yaml', {
			name: 'Foo',
			description: 'Foo description',
			output: '../../../dist',
			url: '/dist'
		});
		this.givenFile('/path/to/current/working/directory/src/bundles/foo/config/foo.yaml', {
			bar: 'baz'
		});
		this.givenFile('/path/to/current/working/directory/src/bundles/foo/styles/main.scss', `@include 'config';\n\nbody {\n\tcolor: $red;\n}\n`);
		this.givenFile('/path/to/current/working/directory/src/bundles/foo/styles/_config.scss', `red: red;\n`);
		this.givenFile('/path/to/current/working/directory/src/bundles/foo/styles/some/other.scss', `body {\n\tcolor: blue;\n}\n`);
		this.givenFile('/path/to/current/working/directory/src/bundles/foo/scripts/main.js', `console.log('main');\n`);
		this.givenFile('/path/to/current/working/directory/src/bundles/foo/scripts/some/other.js', `console.log('other');\n`);

		this.whenLoadingBundleData('foo');

		this.thenShouldHaveReceivedConfigFrom({
			bundle: '/path/to/current/working/directory/src/bundles/foo/config/bundle.yaml',
			foo: '/path/to/current/working/directory/src/bundles/foo/config/foo.yaml'
		});
		this.thenShouldHaveReceivedBundlePath('/path/to/current/working/directory/src/bundles/foo');
		this.thenShouldHaveReceivedBundleName('foo');
		this.thenShouldHaveReceivedOutputPath('/path/to/current/working/directory/dist');
		this.thenShouldHaveReceivedFiles([
			{
				localPath: 'styles/main.scss',
				name: 'main.scss',
				path: '/path/to/current/working/directory/src/bundles/foo/styles/main.scss'
			},
			{
				localPath: 'styles/some/other.scss',
				name: 'other.scss',
				path: '/path/to/current/working/directory/src/bundles/foo/styles/some/other.scss'
			},
			{
				localPath: 'scripts/main.js',
				name: 'main.js',
				path: '/path/to/current/working/directory/src/bundles/foo/scripts/main.js'
			},
			{
				localPath: 'scripts/some/other.js',
				name: 'other.js',
				path: '/path/to/current/working/directory/src/bundles/foo/scripts/some/other.js'
			}
		]);
	}


	//-- Given
	//--------------------------------------------------------

	givenMockedProcessCwd() {
		this.originalProcessCwd = process.cwd;
		this.cwd = '/path/to/current/working/directory';
		process.cwd = jest.fn(() => {
			return this.cwd;
		});
	}

	givenFakeFileManager() {
		this.app.singleton('file', fakeFileManager);
		fakeFileManager._files = {};
		fakeFileManager._folders = [];
	}

	givenProjectService() {
		this.projectService = this.make(ProjectService);
	}

	givenFolder(folder) {
		fakeFileManager._folders.push(folder);
	}

	givenFile(file, content) {
		fakeFileManager._files[file] = content;
	}

	givenNamespace(namespace) {
		this.projectService.addComponentNamespace(namespace);
	}


	//-- When
	//--------------------------------------------------------

	whenGettingRootPath() {
		this.attempt(() => {
			this.setResult(this.projectService.getRootPath());
		});
	}

	whenGettingSourcePath() {
		this.attempt(() => {
			this.setResult(this.projectService.getSourcePath());
		});
	}

	whenGettingBundlesPath() {
		this.attempt(() => {
			this.setResult(this.projectService.getBundlesPath());
		});
	}

	whenGettingBundlePath(bundleName) {
		this.attempt(() => {
			this.setResult(this.projectService.getBundlePath(bundleName));
		});
	}

	whenGettingComponentsPath() {
		this.attempt(() => {
			this.setResult(this.projectService.getComponentsPath());
		});
	}

	whenGettingComponentPath(componentName) {
		this.attempt(() => {
			this.setResult(this.projectService.getComponentPath(componentName));
		});
	}

	whenGettingBundles() {
		this.attempt(() => {
			this.setResult(this.projectService.getBundles());
		});
	}

	whenLoadingBundleData(bundleName) {
		this.attempt(() => {
			this.setResult(this.projectService.loadBundleData(bundleName));
		});
	}


	//-- Then
	//--------------------------------------------------------

	thenRestoreProcessCwd() {
		process.cwd = this.originalProcessCwd;
	}

	thenShouldHaveReceivedConfigFrom(files) {
		const config = Object.fromEntries(Object.entries(files).map(([key, path]) => {
			return [key, fakeFileManager._files[path]];
		}));
		this.expect(this.result).toHaveProperty('config', config);
	}


	thenShouldHaveReceivedBundlePath(bundlePath) {
		this.expect(this.result).toHaveProperty('bundlePath', bundlePath);
	}

	thenShouldHaveReceivedBundleName(bundleName) {
		this.expect(this.result).toHaveProperty('bundleName', bundleName);
	}

	thenShouldHaveReceivedOutputPath(outputPath) {
		this.expect(this.result).toHaveProperty('outputPath', outputPath);
	}

	thenShouldHaveReceivedNoFiles() {
		this.thenShouldHaveReceivedFiles([]);
	}

	thenShouldHaveReceivedFiles(files) {
		this.expect(this.result).toHaveProperty('files', files);
	}

}


module.exports = ProjectServiceTest;
