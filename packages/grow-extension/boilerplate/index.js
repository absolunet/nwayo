//--------------------------------------------------------
//-- nwayo extension - My Extension
//--------------------------------------------------------
'use strict';

const fss   = require('@absolunet/fss');
const nwayo = require('@absolunet/nwayo-workflow');

const NwayoExtension = nwayo.classes.extension;
const { paths }      = nwayo.helpers;


class NwayoMyExtensionExtension extends NwayoExtension {

	get id() {
		return 'my-extension';
	}


	get version() {
		const pkg = fss.readJson(`${__dirname}/package.json`);

		return pkg.version;
	}


	init({ options }) {
		Object.keys(options).forEach((name) => {
			options[name].output = `${paths.dir.root}/${options[name].output}`;
		});

		this.options = options;
	}


	taskExists(name) {
		try {
			return Boolean(require.resolve(`./tasks/${name}`));
		} catch (error) {
			return false;
		}
	}


	requireTask(name) {
		require(`./tasks/${name}`)(this);  // eslint-disable-line global-require
	}

}


module.exports = new NwayoMyExtensionExtension();
