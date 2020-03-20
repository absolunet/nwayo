//--------------------------------------------------------
//-- Nwayo - Test - Unit - Services - Dependency Manager - Drivers - Stubs - Fake Async File System
//--------------------------------------------------------
'use strict';


const fakeAsyncFileSystem = {
	_files: {},
	_readJsonSpy: jest.fn(),
	readJson: jest.fn(async (path) => {
		await new Promise(setTimeout);

		if (!Object.prototype.hasOwnProperty.call(fakeAsyncFileSystem._files, path)) {
			throw new Error('File not found.');
		}

		return fakeAsyncFileSystem._files[path];
	}),
	_writeJsonSpy: jest.fn(),
	writeJson: jest.fn(async (path, content) => {
		await new Promise(setTimeout);
		fakeAsyncFileSystem._files[path] = content;
	})
};


module.exports = fakeAsyncFileSystem;
