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
const paths    = require('~/helpers/paths');


const NAME = 'nwayo';

//-- Existence validated by CLI
const WORKFLOW_PACKAGE = fss.readJson(paths.config.workflowPackage);
const PACKAGE          = fss.readJson(paths.config.projectPackage);
const CONFIG           = fss.readYaml(paths.config.main);

const EXTENSIONS = (() => {
	const enabled = {};
	const prefix = `${NAME}-extension-`;

	Object.keys(CONFIG.extensions || {}).forEach((name) => {
		if (CONFIG.extensions[name].enabled === true) {
			let normalizedName = '';

			const scopedMatch = (/^(@[a-z0-9-]+\/)([a-z0-9-]+)$/u).exec(name);
			if (scopedMatch !== null) {
				normalizedName = `${scopedMatch[1]}${prefix}${scopedMatch[2]}`;
			} else {
				const namedMatch = (/^[a-z0-9-]+$/u).exec(name);
				if (namedMatch !== null) {
					normalizedName = `${prefix}${name}`;
				} else {
					normalizedName = name;
				}
			}

			let extension;
			try {
				extension = require(normalizedName);  // eslint-disable-line global-require
			} catch (error) {
				terminal.exit(`Extension '${name}' not found`);
			}

			extension.init({ options:CONFIG.extensions[name].options });

			enabled[extension.id] = extension;
		}
	});

	return enabled;
})();



const __ = {
	watching:   false,
	deployTier: 'local'
};






class Env {

	get pkg()               { return PACKAGE; }
	get workflowPkg()       { return WORKFLOW_PACKAGE; }
	get konstan()           { return __.konstan; }
	get bundles()           { return __.bundles; }
	get bundlesComponents() { return __.bundlesComponents; }
	get watching()          { return __.watching; }
	get deployTier()        { return __.deployTier; }
	get isWindows()         { return os.platform() === 'win32'; }


	//-- Logo
	get logo() {
		return emoji.get('chestnut');  // 🌰;
	}


	//-- Id
	get id() {
		return NAME;
	}


	//-- Package name
	get pkgName() {
		return WORKFLOW_PACKAGE.name;
	}


	//-- Is deployment tier production
	get prod() {
		return __.deployTier === 'prod';
	}

	//-- Raw project config
	get configRaw() {
		return CONFIG;
	}

	//-- Project extensions config
	get extensions() {
		return EXTENSIONS;
	}

	//-- Set deployment tier to production
	setToProd() {
		__.deployTier = 'prod';
	}


	//-- Set to 'watch' mode
	setToWatching() {
		__.watching = true;
	}


	//-- Init workflow env
	initWorkflow({ bundle = '*' }) {

		// Load konstan
		__.konstan = fss.readYaml(paths.config.konstan);


		// Get bundle list
		const [requiredName, requiredSubname = '*'] = bundle.split(':');
		const bundlesList = glob.sync(`${paths.dir.bundles}/${requiredName}/`);

		// Process bundles
		const data = {};
		if (bundlesList.length !== 0) {

			for (const folder of bundlesList) {
				const [, name] = folder.match(/\/([0-9a-zA-Z-]+)\/$/u);
				data[name] = fss.readYaml(`${folder}/${name}.${paths.ext.bundles}`);

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

						const subBundleData = fss.readYaml(subBundleFile);
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

		__.bundles = data;
		__.bundlesComponents = _.uniq(_.flatten(_.map(__.bundles, _.property('assets.components'))));
	}

}


module.exports = new Env();
