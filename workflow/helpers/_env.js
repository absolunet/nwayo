//-------------------------------------
//-- Environment variables
//-------------------------------------
'use strict';

const _        = require('lodash');
const glob     = require('glob');
const minimist = require('minimist');

const echo = console.log;
const PATH = global.nwayo.path;
const Util = global.nwayo.util;


//-- Package data
let pkg = (() => require(`${__dirname}/../../package`))();


//-- konstan data
let konstan = (() => Util.readYAML(PATH.config.konstan))();


//-- Load bundles
let bundles = (() => {

	// Get CLI flag
	let options = minimist( process.argv.slice(2), {
		'string':  'bundle',
		'default': { bundle: '*' }
	});

	// Get list
	let bundles = glob.sync(`${PATH.dir.bundles}/${options.bundle}.${PATH.ext.bundles}`);

	// Process bundles
	let data = {};
	if (bundles.length) {
		for (let name of bundles) {
			name = name.match(/([^/]+).yaml/)[1];
			data[name] = Util.readYAML(`${PATH.dir.bundles}/${name}.${PATH.ext.bundles}`);
		}
	} else {
		echo(`No bundle ${options.bundle !== '*' ? '\''+options.bundle+'\' ' : ''}found`.red);
		if (process) { process.exit(1); }
	}

	return data;
})();



//-- Extract bundles components
let bundlesComponents = (() => {
	return _.uniq( _.flatten( _.map(bundles, _.property('assets.components'))));
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
