//-------------------------------------
//-- Environment variables
//-------------------------------------
'use strict';

const chalk        = require('chalk');
const glob         = require('glob');
const flatten      = require('lodash.flatten');
const map          = require('lodash.map');
const property     = require('lodash.property');
const uniq         = require('lodash.uniq');
const emoji        = require('node-emoji');
const os           = require('os');
const fss          = require('@absolunet/fss');
const { terminal } = require('@absolunet/terminal');
const paths        = require('./paths');


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

			const scopedMatch = (/^(?<kebab1>@[a-z0-9-]+\/)(?<kebab2>[a-z0-9-]+)$/u).exec(name);
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

			extension.init({ options: CONFIG.extensions[name].options });

			enabled[extension.id] = extension;
		}
	});

	return enabled;
})();


const deployTier = {
	local:      Symbol('local'),
	production: Symbol('production')
};

const __ = {
	watching:   false,
	deployTier: deployTier.local
};





// eslint-disable-next-line unicorn/prevent-abbreviations
class Env {

	get packageConfig()     { return PACKAGE; }
	get workflowConfig()    { return WORKFLOW_PACKAGE; }
	get konstan()           { return __.konstan; }
	get bundles()           { return __.bundles; }
	get bundlesComponents() { return __.bundlesComponents; }
	get isScopeSubbundle()  { return __.scope === 'subbundle'; }
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
	get packageName() {
		return WORKFLOW_PACKAGE.name;
	}


	//-- Is deployment tier production
	get production() {
		return __.deployTier === deployTier.production;
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
	setToProduction() {
		__.deployTier = deployTier.production;
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
		if (requiredName === '*') {
			__.scope = 'all';
		} else if (requiredSubname === '*') {
			__.scope = 'bundle';
		} else {
			__.scope = 'subbundle';
		}

		const bundlesList = glob.sync(`${paths.directory.bundles}/${requiredName}/`);

		// Process bundles
		const data = {};
		if (bundlesList.length !== 0) {

			for (const folder of bundlesList) {
				const [, name] = folder.match(/\/(?<alphanum>[0-9a-zA-Z-]+)\/$/u);
				data[name] = fss.readYaml(`${folder}/${name}.${paths.extension.bundles}`);

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

				const subBundlesList = glob.sync(`${paths.directory.bundles}/${name}/_${requiredSubname}.${paths.extension.bundles}`);
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
		__.bundlesComponents = uniq(flatten(map(__.bundles, property('assets.components'))));
	}

}


module.exports = new Env();
