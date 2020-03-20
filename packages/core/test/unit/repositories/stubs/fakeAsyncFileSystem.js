//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Repositories - Stubs - Fake Async File System
//--------------------------------------------------------
'use strict';


const fakeAsyncFileSystem = {
	_files: {},
	scandir: jest.fn(async (folder, type, { recursive = false, fullPath = false }) => {
		await new Promise(setTimeout);

		return Object.keys(fakeAsyncFileSystem._files).filter((path) => {
			if (!path.startsWith(folder)) {
				return false;
			}

			if ((/\.\w+$/u).test(path) !== (type === 'file')) {
				return false;
			}

			return recursive || path.split('/').length - 1 === folder.split('/').length;
		}).map((path) => {
			return fullPath ? path : path.replace(folder, '').replace(/^\//u, '');
		});
	}),
	readJson: jest.fn(async (file) => {
		await new Promise(setTimeout);
		const content = fakeAsyncFileSystem._files[file];

		if (!content) {
			throw new Error('File not found.');
		}

		return content;
	})
};


module.exports = fakeAsyncFileSystem;
