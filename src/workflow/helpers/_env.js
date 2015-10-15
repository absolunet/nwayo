//-------------------------------------
//-- Environment variables
//-------------------------------------
'use strict';

global.nwayo.env = (() => {
	const echo = console.log;
	const PATH = global.nwayo.path;
	const Util = global.nwayo.util;




	//-- Package data
	const pkg = require(`${__dirname}/../../package`);


	//-- konstan data
	const konstan = Util.readYAML(PATH.config.konstan);


	//-- Load bundles
	const bundles = (() => {
		let glob     = require('glob');
		let minimist = require('minimist');

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
	const bundlesComponents = (() => {
		let _ = require('lodash');
		return _.uniq( _.flatten( _.pluck(bundles, 'assets.components')));
	})();


	return { pkg, konstan, bundles, bundlesComponents, watching:false };
})();
