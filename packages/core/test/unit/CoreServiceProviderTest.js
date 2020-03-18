//--------------------------------------------------------
//-- Node IoC - Test - Unit - Service Provider
//--------------------------------------------------------
'use strict';

const path     = require('path');
const TestCase = require('../TestCase');

const fakeGate                = require('./stubs/fakeGate');
const fakeCommandRepository   = require('./stubs/fakeCommandRepository');
const fakeBuildTypeRepository = require('./stubs/fakeBuildTypeRepository');
const fakePathEnum            = require('./stubs/fakePathEnum');

const InstallComponentsCommand = require('../../dist/node/console/commands/install/InstallComponentsCommand');
const BuildAllCommand          = require('../../dist/node/console/commands/build/BuildAllCommand');
const BuildAssetsCommand       = require('../../dist/node/console/commands/build/BuildAssetsCommand');
const BuildScriptsCommand      = require('../../dist/node/console/commands/build/BuildScriptsCommand');
const BuildStylesCommand       = require('../../dist/node/console/commands/build/BuildStylesCommand');
const BuildWatchCommand        = require('../../dist/node/console/commands/build/BuildWatchCommand');

const NwayoBuildPolicy = require('../../dist/node/policies/NwayoBuildPolicy');


class CoreServiceProviderTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenFakeGate();
		this.givenFakeCommandRepository();
		this.givenFakePathEnum();
		this.givenCoreServiceProvider();
	}

	testBindNwayo() {
		this.whenRegisteringProvider();
		this.thenShouldHaveBoundNwayo();
	}

	testBindNwayoBuildTypeRepository() {
		this.whenRegisteringProvider();
		this.thenShouldHaveBoundBuildTypeRepository();
	}

	testBindBuilder() {
		this.whenRegisteringProvider();
		this.thenShouldHaveBoundBuilder();
	}

	testBindProjectService() {
		this.whenRegisteringProvider();
		this.thenShouldHaveBoundProjectService();
	}

	testRegisterNwayoBuildPolicy() {
		this.whenRegisteringProvider();
		this.thenShouldHaveRegisteredNwayoBuildPolicy();
	}

	testAddDefaultBuildTypes() {
		this.givenFakeBuildTypeRepository();
		this.whenRegisteringProvider();
		this.thenShouldHaveAddedBuiltType('SCRIPTS', 'scripts');
		this.thenShouldHaveAddedBuiltType('STYLES',  'styles');
		this.thenShouldHaveAddedBuiltType('ASSETS',  'assets');
	}

	testAddInstallComponentsCommand() {
		this.whenRegisteringProvider();
		this.thenShouldHaveAddedCommand(InstallComponentsCommand);
	}

	testAddBuildAllCommand() {
		this.whenRegisteringProvider();
		this.thenShouldHaveAddedCommand(BuildAllCommand);
	}

	testAddBuildWatchCommand() {
		this.whenRegisteringProvider();
		this.thenShouldHaveAddedCommand(BuildWatchCommand);
	}

	testAddBuildScriptsCommand() {
		this.whenRegisteringProvider();
		this.thenShouldHaveAddedCommand(BuildScriptsCommand);
	}

	testAddBuildStylesCommand() {
		this.whenRegisteringProvider();
		this.thenShouldHaveAddedCommand(BuildStylesCommand);
	}

	testAddBuildAssetsCommand() {
		this.whenRegisteringProvider();
		this.thenShouldHaveAddedCommand(BuildAssetsCommand);
	}


	//-- Given
	//--------------------------------------------------------

	givenFakeGate() {
		this.app.singleton('gate', fakeGate);
	}

	givenFakeCommandRepository() {
		this.app.singleton('command', fakeCommandRepository);
	}

	givenFakePathEnum() {
		this.app.singleton('nwayo.constant.path', fakePathEnum);
	}

	givenFakeBuildTypeRepository() {
		this.app.decorate('nwayo.build.type', () => {
			return fakeBuildTypeRepository;
		});
	}

	givenCoreServiceProvider() {
		this.provider = path.join(__dirname, '..', '..');
	}


	//-- When
	//--------------------------------------------------------

	whenRegisteringProvider() {
		this.attempt(() => {
			this.app.register(this.provider);
		});
	}


	//-- Then
	//--------------------------------------------------------

	thenShouldHaveBoundNwayo() {
		this.thenShouldNotHaveThrown();
		this.expect(this.app.isBound('nwayo')).toBe(true);
		this.expect(() => {
			this.make('nwayo');
		}).not.toThrow();
	}

	thenShouldHaveBoundBuildTypeRepository() {
		this.thenShouldNotHaveThrown();
		this.expect(this.app.isBound('nwayo.build.type')).toBe(true);
		this.expect(() => {
			this.make('nwayo.build.type');
		}).not.toThrow();
	}

	thenShouldHaveBoundBuilder() {
		this.thenShouldNotHaveThrown();
		this.expect(this.app.isBound('nwayo.builder')).toBe(true);
		this.expect(() => {
			this.make('nwayo.builder');
		}).not.toThrow();
	}

	thenShouldHaveBoundProjectService() {
		this.thenShouldNotHaveThrown();
		this.expect(this.app.isBound('nwayo.project')).toBe(true);
		this.expect(() => {
			this.make('nwayo.project');
		}).not.toThrow();
	}

	thenShouldHaveRegisteredNwayoBuildPolicy() {
		this.thenShouldNotHaveThrown();
		this.expect(fakeGate.register).toHaveBeenCalledWith(NwayoBuildPolicy);
	}

	thenShouldHaveAddedBuiltType(key, value) {
		this.thenShouldNotHaveThrown();
		this.expect(fakeBuildTypeRepository.add).toHaveBeenCalled();
		const call = fakeBuildTypeRepository.add.mock.calls.find(([id]) => {
			return id === key;
		});
		this.expect(call).toBeTruthy();
		this.expect(call[1]).toBe(value);
	}

	thenShouldHaveAddedCommand(command) {
		this.thenShouldNotHaveThrown();
		this.expect(fakeCommandRepository.add).toHaveBeenCalled();
		this.expect(fakeCommandRepository.add.mock.calls.some(([commandClass]) => {
			return commandClass === command;
		})).toBe(true);
	}

}


module.exports = CoreServiceProviderTest;
