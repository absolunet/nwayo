//--------------------------------------------------------
//-- Install
//--------------------------------------------------------
'use strict';

const cli      = require('@absolunet/cli');
const fss      = require('@absolunet/fss');
const terminal = require('@absolunet/terminal');
const paths    = require('../helpers/paths');


const availableScopes = ['vendors'];


const bowerInstall = () => {
	terminal.print(`
		Installing vendors via Bower
	`);

	fss.del(paths.dir.bower);

	terminal.run(`
		cd ${paths.dir.root}
		node ${paths.config.bowerBin} install
	`);
};






module.exports = class {

	static cli(meowCli) {
		cli.refuseFlags(meowCli);

		if (meowCli.input.length <= 3) {

			// Get and validate scopes
			let [, scopes] = meowCli.input;

			if (scopes) {
				if (availableScopes.includes(scopes)) {
					scopes = [scopes];
				} else {
					cli.showTaskUsage(meowCli);
				}
			} else {
				scopes = availableScopes;
			}


			// Run installs
			scopes.forEach((scope) => {

				switch (scope) {

					case 'vendors': bowerInstall(); break;
					default: break;

				}
			});

		} else {
			cli.showTaskUsage(meowCli);
		}
	}

};
