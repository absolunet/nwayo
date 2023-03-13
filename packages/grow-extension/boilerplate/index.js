//--------------------------------------------------------
//-- nwayo extension - My Extension
//--------------------------------------------------------
'use strict';

const path       = require('node:path');
const nwayo      = require('@absolunet/nwayo-workflow'); // eslint-disable-line node/no-missing-require
const { fsSync } = require('@valtech-commerce/fs');

const NwayoExtension = nwayo.classes.extension;
const { paths }      = nwayo.helpers;


class NwayoMyExtensionExtension extends NwayoExtension {

	get id() {
		return 'my-extension';
	}


	get version() {
		const packageConfig = fsSync.readJson(path.join(__dirname, 'package.json'));

		return packageConfig.version;
	}


	init({ options }) {
		Object.keys(options).forEach((name) => {
			options[name].output = `${paths.directory.root}/${options[name].output}`;
		});

		this.options = options;
	}


	taskExists(name) {
		try {
			return Boolean(require.resolve(path.join('.', 'tasks', name)));
		} catch {
			return false;
		}
	}


	requireTask(name) {
		require(path.join('.', 'tasks', name))(this); // eslint-disable-line node/global-require
	}

}


module.exports = new NwayoMyExtensionExtension();
