//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Services - Stubs - Fake File Manager
//--------------------------------------------------------
'use strict';


const fakeFileManager = {
	_files: {},
	_folders: [],
	exists: jest.fn((path) => {
		return fakeFileManager._folders.some((folder) => {
			return folder.includes(path.replace(/\/$/u, ''));
		}) || Boolean(fakeFileManager._files[path]);
	}),
	scandir: jest.fn((path, type = 'file', { recursive = false } = {}) => {
		return fakeFileManager._folders.concat(Object.keys(fakeFileManager._files))
			.filter((fullPath) => {
				if ((/\.\w+$/u).test(fullPath) === (type === 'dir')) {
					return false;
				}

				return fullPath.startsWith(path) && (recursive || !fullPath.replace(path, '').replace(/^\//u, '').includes('/'));
			})
			.map((fullPath) => {
				return fullPath.replace(new RegExp(`^${path}(\\/)?`, 'u'), '');
			});
	}),
	loadRecursivelyInFolder: jest.fn((folder) => {
		return Object.fromEntries(Object.entries(fakeFileManager._files)
			.filter(([fullPath]) => {
				return fullPath.startsWith(folder);
			})
			.map(([fullPath, content]) => {
				return [fullPath.replace(folder, '').replace(/^\//u, '').replace(/\.\w+$/u, ''), content];
			}));
	})
};


module.exports = fakeFileManager;
