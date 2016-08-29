//-------------------------------------
//-- Environment variables
//-------------------------------------
'use strict';

const _        = require('lodash');
const glob     = require('glob');
const minimist = require('minimist');

const PATH = global.nwayo.path;
const Util = global.nwayo.util;


//-- Package data
const pkg = (() => {
	return require(`${__dirname}/../../package`); // eslint-disable-line global-require
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

	// Get list
	const bundlesList = glob.sync(`${PATH.dir.bundles}/${options.bundle}.${PATH.ext.bundles}`);

	// Process bundles
	const data = {};
	if (bundlesList.length) {
		for (let name of bundlesList) {
			name = name.match(/([^/]+).yaml/)[1];
			data[name] = Util.readYAML(`${PATH.dir.bundles}/${name}.${PATH.ext.bundles}`);
		}
	} else {
		throw new Error(`No bundle ${
			options.bundle !== '*' ? `'${options.bundle}' ` : ''
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




class Env {

	static get pkg()               { return pkg; }
	static get konstan()           { return konstan; }
	static get bundles()           { return bundles; }
	static get bundlesComponents() { return bundlesComponents; }
	static get watching()          { return watching; }


	//-- Set to 'watch' mode
	static setToWatching() {
		watching = true;
	}

}

global.nwayo.env = Env;
