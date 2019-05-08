//--------------------------------------------------------
//-- Install
//--------------------------------------------------------
'use strict';

const cli          = require('@absolunet/cli');
const fss          = require('@absolunet/fss');
const { terminal } = require('@absolunet/terminal');
const Task         = require('~/classes/task');
const paths        = require('~/helpers/paths');


const availableScopes = ['vendors'];


const vendorInstall = () => {
	terminal.print(`
		Installing vendors via npm
	`);

	fss.remove(paths.directory.vendorsDependencies);
	fss.remove(`${paths.directory.vendors}/package-lock.json`);

	terminal.run(`cd ${paths.directory.vendors} && npm install --no-audit`);
};






class InstallTask extends Task {

	constructor() {
		super();
		this.filename = __filename;
	}

	cli(meowCli) {
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

					case 'vendors': vendorInstall(); break;
					default: break;

				}
			});

		} else {
			cli.showTaskUsage(meowCli);
		}
	}

}


module.exports = new InstallTask();
