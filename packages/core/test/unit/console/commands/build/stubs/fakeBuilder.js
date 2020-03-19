//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Console - Commands - Build - Stubs - Fake Builder
//--------------------------------------------------------
'use strict';


const fakeBuilder = {
	events: {
		start: 'nwayo.builder.start',
		preparing: 'nwayo.builder.preparing',
		prepared: 'nwayo.builder.prepared',
		progress: 'nwayo.builder.progress',
		writing: 'nwayo.builder.writing',
		wrote: 'nwayo.builder.wrote',
		afterBuild: 'nwayo.builder.afterBuild',
		watchReady: 'nwayo.builder.watchReady',
		error: 'nwayo.builder.error',
		completed: 'nwayo.builder.completed'
	},
	onStart: jest.fn((handler) => {
		fakeBuilder._hooks.start = fakeBuilder._hooks.start || [];
		fakeBuilder._hooks.start.push(handler);
	}),
	onPreparing: jest.fn((handler) => {
		fakeBuilder._hooks.preparing = fakeBuilder._hooks.preparing || [];
		fakeBuilder._hooks.preparing.push(handler);
	}),
	onPrepared: jest.fn((handler) => {
		fakeBuilder._hooks.prepared = fakeBuilder._hooks.prepared || [];
		fakeBuilder._hooks.prepared.push(handler);
	}),
	onProgress: jest.fn((handler) => {
		fakeBuilder._hooks.progress = fakeBuilder._hooks.progress || [];
		fakeBuilder._hooks.progress.push(handler);
	}),
	onWriting: jest.fn((handler) => {
		fakeBuilder._hooks.writing = fakeBuilder._hooks.writing || [];
		fakeBuilder._hooks.writing.push(handler);
	}),
	onWrote: jest.fn((handler) => {
		fakeBuilder._hooks.wrote = fakeBuilder._hooks.wrote || [];
		fakeBuilder._hooks.wrote.push(handler);
	}),
	onAfterBuild: jest.fn((handler) => {
		fakeBuilder._hooks.afterBuild = fakeBuilder._hooks.afterBuild || [];
		fakeBuilder._hooks.afterBuild.push(handler);
	}),
	onWatchReady: jest.fn((handler) => {
		fakeBuilder._hooks.watchReady = fakeBuilder._hooks.watchReady || [];
		fakeBuilder._hooks.watchReady.push(handler);
	}),
	onError: jest.fn((handler) => {
		fakeBuilder._hooks.error = fakeBuilder._hooks.error || [];
		fakeBuilder._hooks.error.push(handler);
	}),
	onCompleted: jest.fn((handler) => {
		fakeBuilder._hooks.completed = fakeBuilder._hooks.completed || [];
		fakeBuilder._hooks.completed.push(handler);
	}),
	_hooks: {}
};


module.exports = fakeBuilder;
