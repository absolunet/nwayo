//--------------------------------------------------------
//-- Tests - Unit - Services - Stubs - Fake Builder
//--------------------------------------------------------
'use strict';


const fakeBuilder = {
	_watchSpy: jest.fn(),
	_buildSpy: jest.fn(),
	_afterBuild: [],
	run: jest.fn(() => {
		return new Promise((resolve) => {
			setTimeout(async () => {
				fakeBuilder._buildSpy();
				await Promise.all(fakeBuilder._afterBuild.map(async (action) => {
					await action({ _isMockedStat: true });
				}));
				resolve();
			});
		});
	}),
	watch: jest.fn(() => {
		return new Promise((resolve) => {
			setTimeout(() => {
				fakeBuilder._watchSpy();
				resolve();
			});
		});
	}),
	make: jest.fn(() => {
		return fakeBuilder;
	}),
	buildConfig: jest.fn(() => {
		return { _isMockedConfig: true };
	}),
	onAfterBuild: jest.fn((callback) => {
		fakeBuilder._afterBuild.push(callback);

		return fakeBuilder;
	})
};


module.exports = fakeBuilder;
