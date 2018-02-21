//-------------------------------------
//-- Environment variables
//-------------------------------------
'use strict';

const glob     = require('glob');
const yaml     = require('js-yaml');
const _        = require('lodash');
const minimist = require('minimist');
const os       = require('os');
const fss      = require('@absolunet/fss');
const terminal = require('@absolunet/terminal');
const paths    = require('../helpers/paths');


const readYAML = (file) => {
	return yaml.safeLoad(fss.readFile(file, 'utf8'));
};






//-- Static properties
const STATIC = global.___NwayoEnv___ ? global.___NwayoEnv___ : global.___NwayoEnv___ = {
	workflowPkg: require(paths.config.workflowPackage),  // eslint-disable-line global-require
	watching:    false,
	isWindows:   os.platform() === 'win32'
};


//-- Project package
if (!STATIC.pkg) {
	if (fss.exists(paths.config.projectPackage)) {
		STATIC.pkg = require(paths.config.projectPackage);  // eslint-disable-line global-require
	} else {
		terminal.exit('No package.json file found');
	}
}






module.exports = class {

	static get pkg()               { return STATIC.pkg; }
	static get workflowPkg()       { return STATIC.workflowPkg; }
	static get konstan()           { return STATIC.konstan; }
	static get bundles()           { return STATIC.bundles; }
	static get bundlesComponents() { return STATIC.bundlesComponents; }
	static get watching()          { return STATIC.watching; }
	static get isWindows()         { return STATIC.isWindows; }


	//-- Set to 'watch' mode
	static setToWatching() {
		STATIC.watching = true;
	}


	//-- Init workflow env
	static initWorkflow() {

		// Load konstan
		STATIC.konstan = readYAML(paths.config.konstan);



		// Get CLI flag
		const options = minimist(process.argv.slice(2), {
			'string':  'bundle',
			'default': { bundle:'*' }
		});

		const [requiredName, requiredSubname = '*'] = options.bundle.split(':');

		// Get list
		const bundlesList = glob.sync(`${paths.dir.bundles}/${requiredName}/`);

		// Process bundles
		const data = {};
		if (bundlesList.length) {

			for (const folder of bundlesList) {
				const [, name] = folder.match(/\/([0-9a-zA-Z-]+)\/$/);
				data[name] = readYAML(`${folder}/${name}.${paths.ext.bundles}`);

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

				const subBundlesList = glob.sync(`${paths.dir.bundles}/${name}/_${requiredSubname}.${paths.ext.bundles}`);
				if (subBundlesList.length) {
					for (const subBundleFile of subBundlesList) {

						const subBundleData = readYAML(subBundleFile);
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
		} else {
			throw new Error(`No bundle ${
				requiredName !== '*' ? `'${options.bundle}' ` : ''
			}found`.red);
		}

		STATIC.bundles = data;
		STATIC.bundlesComponents = _.uniq(_.flatten(_.map(STATIC.bundles, _.property('assets.components'))));
	}

};
