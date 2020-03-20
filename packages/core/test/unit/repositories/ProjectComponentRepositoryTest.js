//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Repositories - Project Component Repository
//--------------------------------------------------------
'use strict';

const TestCase                   = require('../../TestCase');
const ProjectComponentRepository = require('../../../dist/node/repositories/ProjectComponentRepository');
const fakeDependencyManager      = require('./stubs/fakeDependencyManager');
const fakePackageEnum            = require('./stubs/fakePackageEnum');
const fakeProjectService         = require('./stubs/fakeProjectService');
const fakeAsyncFileSystem        = require('./stubs/fakeAsyncFileSystem');


class ProjectComponentRepositoryTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenFakeDependencyManager();
		this.givenFakePackageEnum();
		this.givenFakeProjectService();
		this.givenFakeAsyncFileSystem();
		this.givenProjectComponentRepository();
		this.givenEmptyFileSystem();
		this.givenProjectRoot('/path/to/project');
	}

	async testCanGetEmptyObjectIfNoPackageJsonCanBeFound() {
		await this.whenGettingAllComponents();
		this.thenResultShouldEqual({});
	}

	async testCanGetSingleEntryIfOnePackageJsonIsFound() {
		this.givenFile('/path/to/project/src/components/foo/bar/package.json', {
			name: '@baz/qux'
		});
		await this.whenGettingAllComponents();
		this.thenResultShouldEqual({
			'@baz/qux': 'components/foo/bar'
		});
	}

	async testCanGetMultipleEntriesIfMultiplePackageJsonAreFound() {
		this.givenFile('/path/to/project/src/components/foo/bar/package.json', {
			name: '@baz/qux'
		});
		this.givenFile('/path/to/project/src/components/lorem/ipsum/package.json', {
			name: '@dolor/sit-amet'
		});
		await this.whenGettingAllComponents();
		this.thenResultShouldEqual({
			'@baz/qux': 'components/foo/bar',
			'@dolor/sit-amet': 'components/lorem/ipsum'
		});
	}

	async testThrowsIfTwoPackageJsonShareTheSameName() {
		this.givenFile('/path/to/project/src/components/foo/bar/package.json', {
			name: '@baz/qux'
		});
		this.givenFile('/path/to/project/src/components/baz/qux/package.json', {
			name: '@baz/qux'
		});
		await this.whenGettingAllComponents();
		this.thenShouldHaveThrownForDuplicates({
			'@baz/qux': [
				'components/foo/bar',
				'components/baz/qux'
			]
		});
	}

	async testThrowsIfMultipleDuplicates() {
		this.givenFile('/path/to/project/src/components/foo/bar/package.json', {
			name: '@baz/qux'
		});
		this.givenFile('/path/to/project/src/components/baz/qux/package.json', {
			name: '@baz/qux'
		});
		this.givenFile('/path/to/project/src/components/lorem/ipsum/package.json', {
			name: '@dolor/sit-amet'
		});
		this.givenFile('/path/to/project/src/components/dolor/sit/amet/package.json', {
			name: '@dolor/sit-amet'
		});
		await this.whenGettingAllComponents();
		this.thenShouldHaveThrownForDuplicates({
			'@baz/qux': [
				'components/foo/bar',
				'components/baz/qux'
			],
			'@dolor/sit-amet': [
				'components/lorem/ipsum',
				'components/dolor/sit/amet'
			]
		});
	}

	async testCanCheckIfComponentExists() {
		this.givenFile('/path/to/project/src/components/foo/bar/package.json', {
			name: '@baz/qux'
		});
		await this.whenCheckingIfComponentExists('@baz/qux');
		this.thenResultShouldBe(true);
	}

	async testCanCheckIfComponentDoesNotExist() {
		this.givenFile('/path/to/project/src/components/foo/bar/package.json', {
			name: '@baz/qux'
		});
		await this.whenCheckingIfComponentExists('@dolor/sit-amet');
		this.thenResultShouldBe(false);
	}

	async testThrowsWhenCheckingComponentWithDuplicates() {
		this.givenFile('/path/to/project/src/components/foo/bar/package.json', {
			name: '@baz/qux'
		});
		this.givenFile('/path/to/project/src/components/baz/qux/package.json', {
			name: '@baz/qux'
		});
		await this.whenCheckingIfComponentExists('@baz/qux');
		this.thenShouldHaveThrownForDuplicates({
			'@baz/qux': [
				'components/foo/bar',
				'components/baz/qux'
			]
		});
	}


	givenFakeDependencyManager() {
		this.app.singleton('dependency', fakeDependencyManager);
	}

	givenFakePackageEnum() {
		this.app.singleton('nwayo.constant.package', fakePackageEnum);
	}

	givenFakeProjectService() {
		this.app.singleton('nwayo.project', fakeProjectService);
	}

	givenFakeAsyncFileSystem() {
		this.app.singleton('file.system.async', fakeAsyncFileSystem);
	}

	givenProjectComponentRepository() {
		this.projectComponentRepository = this.make(ProjectComponentRepository);
	}

	givenEmptyFileSystem() {
		fakeAsyncFileSystem._files = {};
	}

	givenProjectRoot(projectRoot) {
		fakeProjectService._projectRoot = projectRoot;
	}

	givenFile(file, content) {
		fakeAsyncFileSystem._files[file] = content;
	}


	async whenGettingAllComponents() {
		await this.attemptAsync(async () => {
			const result = await this.projectComponentRepository.all();
			this.setResult(result);
		});
	}

	async whenCheckingIfComponentExists(component) {
		await this.attemptAsync(async () => {
			const result = await this.projectComponentRepository.has(component);
			this.setResult(result);
		});
	}


	thenShouldHaveThrownForDuplicates(duplicates) {
		this.thenShouldHaveThrown();
		Object.entries(duplicates).forEach(([name, paths]) => {
			this.expect(this.exception.message).toMatch(new RegExp(`\\[${name}\\]:\\n\\s+- ${paths.join(`\\n\\s+- `)}`, 'u'));
		});
	}

}


module.exports = ProjectComponentRepositoryTest;
