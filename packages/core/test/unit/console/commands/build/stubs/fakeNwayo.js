//--------------------------------------------------------
//-- Tests - Unit - Console - Commands - Build - Stubs - Fake Nwayo
//--------------------------------------------------------
'use strict';

const fakeBuilder = require('./fakeBuilder');


const wait = async (time) => {
	await new Promise((r) => {
		setTimeout(r, time);
	});
};

const handle = (hook = [], ...data) => {
	hook.forEach((handler) => {
		handler(...data);
	});
};

const fakeNwayo = {
	_buildAsyncSpy: jest.fn(),
	build: jest.fn(async (...parameters) => {
		await wait(0);
		fakeNwayo._buildAsyncSpy();
		const { _hooks: { start, preparing, prepared, progress, writing, wrote, afterBuild, watchReady, error, completed } } = fakeBuilder;
		handle(start, { bundleName: 'bundle-name' });
		handle(preparing);
		handle(prepared);

		await wait(50);
		handle(progress, { percent: 0.25 });
		await wait(50);
		handle(progress, { percent: 0.5 });
		await wait(50);
		handle(progress, { percent: 0.75 });
		await wait(50);
		handle(progress, { percent: 1 });

		handle(writing, { path: 'path/to/file.js' });
		handle(wrote, { path: 'path/to/file.js' });
		handle(afterBuild);

		if (parameters[2] && parameters[2].watch) {
			handle(watchReady);
		}

		if (fakeNwayo._shouldThrow) {
			handle(error, new Error('An error occurred'));
		} else if (!parameters[2] || !parameters[2].watch) {
			handle(completed);
		}
	})
};


module.exports = fakeNwayo;
