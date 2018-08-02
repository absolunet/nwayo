//--------------------------------------------------------
//-- Default
//--------------------------------------------------------
'use strict';

const ow       = require('ow');
const spawn    = require('cross-spawn');
const cli      = require('@absolunet/cli');
const terminal = require('@absolunet/terminal');






module.exports = class {

	static cli(meowCli) {

		const { pronounce } = cli.validateFlags(meowCli, {
			pronounce: ow.boolean
		});


		//-- Pronounce
		if (pronounce) {
			terminal.echo('/nwajo/');

			if (process.platform === 'darwin') {
				spawn('say', ['nwaw', 'yo']);
			}

			terminal.exit();
		}

		meowCli.showHelp();
	}

};
