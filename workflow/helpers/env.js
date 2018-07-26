//-------------------------------------
//-- Environment variables
//-------------------------------------
'use strict';

const chalk    = require('chalk');
const glob     = require('glob');
const _        = require('lodash');
const emoji    = require('node-emoji');
const os       = require('os');
const fss      = require('@absolunet/fss');
const terminal = require('@absolunet/terminal');
const paths    = require('./paths');
const toolbox  = require('./toolbox');


//-- Static properties
const STATIC = global.___NwayoEnv___ ? global.___NwayoEnv___ : global.___NwayoEnv___ = {

	workflowPkg: require(paths.config.workflowPackage),  // eslint-disable-line global-require

	watching:    false,

	deployTier:  'local',

	isWindows:   os.platform() === 'win32',

	pkg:         (() => {
		if (fss.exists(paths.config.projectPackage)) {
			return require(paths.config.projectPackage);  // eslint-disable-line global-require
		}

		return terminal.exit('No package.json file found');
	})()

};






module.exports = class env {

	static get pkg()               { return STATIC.pkg; }
	static get workflowPkg()       { return STATIC.workflowPkg; }
	static get konstan()           { return STATIC.konstan; }
	static get bundles()           { return STATIC.bundles; }
	static get bundlesComponents() { return STATIC.bundlesComponents; }
	static get watching()          { return STATIC.watching; }
	static get deployTier()        { return STATIC.deployTier; }
	static get isWindows()         { return STATIC.isWindows; }


	//-- Logo
	static get logo() {
		return emoji.get('chestnut');  // 🌰;
	}


	//-- Name
	static get name() {
		return 'nwayo';
	}


	//-- Package name
	static get pkgName() {
		return '@absolunet/nwayo-workflow';
	}


	//-- Is deployment tier production
	static get prod() {
		return STATIC.deployTier === 'prod';
	}


	//-- Set deployment tier to production
	static setToProd() {
		STATIC.deployTier = 'prod';
	}


	//-- Set to 'watch' mode
	static setToWatching() {
		STATIC.watching = true;
	}


	//-- Init workflow env
	static initWorkflow({ bundle = '*' }) {

		// Load konstan
		STATIC.konstan = toolbox.readYAML(paths.config.konstan);


		// Get bundle list
		const [requiredName, requiredSubname = '*'] = bundle.split(':');
		const bundlesList = glob.sync(`${paths.dir.bundles}/${requiredName}/`);

		// Process bundles
		const data = {};
		if (bundlesList.length !== 0) {

			for (const folder of bundlesList) {
				const [, name] = folder.match(/\/([0-9a-zA-Z-]+)\/$/);
				data[name] = toolbox.readYAML(`${folder}/${name}.${paths.ext.bundles}`);

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
				if (subBundlesList.length !== 0) {
					for (const subBundleFile of subBundlesList) {

						const subBundleData = toolbox.readYAML(subBundleFile);
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
					terminal.exit(`Bundle ${chalk.underline(bundle)} does not exists`);
				}
			}
		} else {
			terminal.exit(`${requiredName !== '*' ? `Bundle ${chalk.underline(bundle)} does not exists` : `No bundle found`}`);
		}

		STATIC.bundles = data;
		STATIC.bundlesComponents = _.uniq(_.flatten(_.map(STATIC.bundles, _.property('assets.components'))));
	}

};
