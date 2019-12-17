//--------------------------------------------------------
//-- Nwayo - Test - Unit - Handlers - Legacy - Legacy Handler
//--------------------------------------------------------
'use strict';

const TestCase        = require('../../../TestCase');
const LegacyHandler   = require('../../../../dist/node/app/handlers/legacy/LegacyHandler');
const fakeFileManager = require('./stubs/fakeFileManager');
const fakeTerminal    = require('./stubs/fakeTerminal');


class LegacyHandlerTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenFakeFileManager();
		this.givenFakeTerminal();
		this.givenMockedSpawn();
		this.givenLegacyHandler();
	}

	afterEach() {
		this.thenResetFakeTerminal();
	}

	async testCanHandleExistingCommand() {
		this.givenPackageJsonBinary();
		this.givenSuccessCode();
		this.givenArgv(['install', 'workflow']);
		await this.whenHandling();
		this.thenShouldNotHaveThrown();
		this.thenCommandShouldHaveBeenExecuted();
	}

	async testThrowsWhenHandlingNonExistingCommand() {
		this.givenPackageJsonBinary();
		this.givenErrorCode();
		this.givenArgv(['install', 'nonexisting']);
		await this.whenHandling();
		this.thenShouldHaveThrown();
		this.thenCommandShouldHaveBeenExecuted();
	}

	async testCanHandleNoArguments() {
		this.givenPackageJsonBinary();
		this.givenErrorCode();
		this.givenArgv([]);
		await this.whenHandling();
		this.thenShouldNotHaveThrown();
		this.thenCommandShouldHaveBeenExecuted();
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

	givenFakeTerminal() {
		this.app.singleton('terminal', fakeTerminal);
	}

	givenFakeFileManager() {
		this.app.singleton('file', fakeFileManager);
	}

	givenLegacyHandler() {
		this.legacyHandler = this.app.make(LegacyHandler);
	}

	givenCode(code) {
		this.code = code;
	}

	givenSuccessCode() {
		this.givenCode(0);
	}

	givenErrorCode() {
		this.givenCode(2);
	}

	givenArgv(argv) {
		fakeTerminal.argv = argv;
	}

	givenPackageJsonBinary() {
		this.packageJsonBinary = fakeFileManager._fakePackageJson.bin.nwayo;
	}


	//-- When
	//--------------------------------------------------------

	async whenHandling() {
		await this.attemptAsync(async () => {
			await this.legacyHandler.handle();
		});
	}


	//-- Then
	//--------------------------------------------------------

	thenResetFakeTerminal() {
		fakeTerminal.argv = [];
	}

	thenCommandShouldHaveBeenExecuted() {
		this.expect(this.spiedSpawn).toHaveBeenCalled();
		const [[binary, argv, options]] = this.spiedSpawn.mock.calls;
		this.expect(binary).toBe('node');
		this.expect(argv[0].endsWith(this.packageJsonBinary)).toBe(true);
		this.expect(argv.slice(1)).toStrictEqual(fakeTerminal.argv);
		this.expect(options).toMatchObject({ stdio: 'inherit' });
	}

}


module.exports = LegacyHandlerTest;
