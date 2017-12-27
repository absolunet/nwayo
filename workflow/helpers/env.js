//-------------------------------------
//-- Environment variables
//-------------------------------------
'use strict';

const events   = require('events');
const _        = require('lodash');
const glob     = require('glob');
const minimist = require('minimist');
const os       = require('os');

const PATH = global.nwayo.path;
const Util = global.nwayo.util;


//-- Package data
const pkg = (() => {
	return require(PATH.config.projectPackage); // eslint-disable-line global-require
})();


//-- Package data
const workflowPkg = (() => {
	return require(PATH.config.pkgPackage); // eslint-disable-line global-require
})();


//-- konstan data
const konstan = (() => {
	return Util.readYAML(PATH.config.konstan);
})();


//-- Load bundles
const bundles = (() => {

	// Get CLI flag
	const options = minimist(process.argv.slice(2), {
		'string':  'bundle',
		'default': { bundle:'*' }
	});

	const [requiredName, requiredSubname = '*'] = options.bundle.split(':');

	// Get list
	const bundlesList = glob.sync(`${PATH.dir.bundles}/${requiredName}/`);

	// Process bundles
	const data = {};
	if (bundlesList.length) {

		for (const folder of bundlesList) {
			const matches = folder.match(/\/([0-9a-zA-Z]+)\/$/);

			if (matches) {

				const [, name] = matches;
				data[name] = Util.readYAML(`${folder}/${name}.${PATH.ext.bundles}`);

				if (!data[name].assets) {
					data[name].assets = {};
				}

				if (!data[name].assets.components) {
					data[name].assets.components = [];
				}

				if (!data[name].scripts.collections) {
					data[name].scripts.collections = {};
				}

				if (!data[name].styles.collections) {
					data[name].styles.collections = {};
				}

				const subBundlesList = glob.sync(`${PATH.dir.bundles}/${name}/_${requiredSubname}.${PATH.ext.bundles}`);
				if (subBundlesList.length) {
					for (const subBundleFile of subBundlesList) {

						const subBundleData = Util.readYAML(subBundleFile);
						if (subBundleData.assets && subBundleData.assets.components) {
							data[name].assets.components = [...new Set([...data[name].assets.components, ...subBundleData.assets.components])];
						}

						if (subBundleData.scripts && subBundleData.scripts.collections) {
							Object.assign(data[name].scripts.collections, subBundleData.scripts.collections);
						}

						if (subBundleData.styles && subBundleData.styles.collections) {
							Object.assign(data[name].styles.collections, subBundleData.styles.collections);
						}
					}

				} else if (requiredSubname !== '*') {
					throw new Error(`No subbundle '${options.bundle}' found`.red);
				}
			}
		}
	} else {
		throw new Error(`No bundle ${
			requiredName !== '*' ? `'${options.bundle}' ` : ''
		}found`.red);
	}

	return data;
})();



//-- Extract bundles components
const bundlesComponents = (() => {
	return _.uniq(_.flatten(_.map(bundles, _.property('assets.components'))));
})();


//-- Is in 'watch' mode
let watching = false;


//-- Boost max listeners
events.EventEmitter.prototype._maxListeners = 100;




class Env {

	static get pkg()               { return pkg; }
	static get workflowPkg()       { return workflowPkg; }
	static get konstan()           { return konstan; }
	static get bundles()           { return bundles; }
	static get bundlesComponents() { return bundlesComponents; }
	static get watching()          { return watching; }
	static get isWindows()         { return os.platform() === 'win32'; }


	//-- Set to 'watch' mode
	static setToWatching() {
		watching = true;
	}

}

global.nwayo.env = Env;
