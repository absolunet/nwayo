//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Repositories - Build Type Repository
//--------------------------------------------------------
'use strict';

const TestCase = require('../../TestCase');
const BuildTypeRepository = require('../../../dist/node/repositories/BuildTypeRepository');


class BuildTypeRepositoryTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenBuildTypeRepository();
	}

	testCanGetAllConstantDirectly() {
		this.whenGettingProperty('ALL');
		this.thenResultShouldBe('all');
	}

	testCanGetAllConstantFromGetMethod() {
		this.whenGetting('ALL');
		this.thenResultShouldBe('all');
	}

	testCanGetWatchConstantDirectly() {
		this.whenGettingProperty('WATCH');
		this.thenResultShouldBe('watch');
	}

	testCanGetWatchConstantFromGetMethod() {
		this.whenGetting('WATCH');
		this.thenResultShouldBe('watch');
	}

	testCanGetAllTypesWithoutAllAndWatch() {
		this.whenGettingAll();
		this.thenResultShouldEqual({});
	}

	testCanGetUndefinedType() {
		this.whenGetting('FOO');
		this.thenResultShouldBe(null);
	}

	testCanGetUndefinedTypeByConstant() {
		this.whenGettingProperty('FOO');
		this.thenResultShouldBe(null);
	}

	testCanAddTypeAndGetIt() {
		this.givenType('FOO', 'foo');
		this.whenGetting('FOO');
		this.thenResultShouldBe('foo');
	}

	testCanAddTypeAndGetItAsConstant() {
		this.givenType('FOO', 'foo');
		this.whenGettingProperty('FOO');
		this.thenResultShouldBe('foo');
	}

	testCanAddTypeAndGetItInAll() {
		this.givenType('FOO', 'foo');
		this.whenGettingAll();
		this.thenResultShouldEqual({ FOO: 'foo' });
	}

	testCannotAddExistingType() {
		this.givenType('FOO', 'foo');
		this.whenAddingType('FOO', 'foo');
		this.thenShouldHaveThrown();
	}

	testCanCheckIfTypeExists() {
		this.givenType('FOO', 'foo');
		this.whenCheckingIfHas('FOO');
		this.thenResultShouldBe(true);
	}

	testCanCheckIfTypeDoesNotExist() {
		this.whenCheckingIfHas('FOO');
		this.thenResultShouldBe(false);
	}

	testCanGetTypeByLabel() {
		this.givenType('FOO', 'foo');
		this.whenGettingByLabel('foo');
		this.thenResultShouldBe('FOO');
	}

	testCanGetAllByLabel() {
		this.whenGettingByLabel('all');
		this.thenResultShouldBe('ALL');
	}

	testCanGetWatchByLabel() {
		this.whenGettingByLabel('watch');
		this.thenResultShouldBe('WATCH');
	}

	testCanGetNullIfLabelDoesNotExist() {
		this.whenGettingByLabel('foo');
		this.thenResultShouldBe(null);
	}


	//-- Given
	//--------------------------------------------------------

	givenBuildTypeRepository() {
		this.buildTypeRepository = this.make(BuildTypeRepository);
	}

	givenType(id, label) {
		this.buildTypeRepository.add(id, label);
	}

	whenGettingProperty(property) {
		this.attempt(() => {
			this.setResult(this.buildTypeRepository[property]);
		});
	}


	//-- When
	//--------------------------------------------------------

	whenGetting(id) {
		this.attempt(() => {
			this.setResult(this.buildTypeRepository.get(id));
		});
	}

	whenGettingAll() {
		this.attempt(() => {
			this.setResult(this.buildTypeRepository.all());
		});
	}

	whenAddingType(id, label) {
		this.attempt(() => {
			this.buildTypeRepository.add(id, label);
		});
	}

	whenCheckingIfHas(id) {
		this.attempt(() => {
			this.setResult(this.buildTypeRepository.has(id));
		});
	}

	whenGettingByLabel(label) {
		this.attempt(() => {
			this.setResult(this.buildTypeRepository.getIdByLabel(label));
		});
	}

}


module.exports = BuildTypeRepositoryTest;
