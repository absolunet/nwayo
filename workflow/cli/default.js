//--------------------------------------------------------
//-- Default
//--------------------------------------------------------
'use strict';

const spawn    = require('cross-spawn');
const terminal = require('@absolunet/terminal');






module.exports = class {

	static cli(meowCli) {
		if (Object.keys(meowCli.flags).length === 1) {

			//-- Pronounce
			if (meowCli.flags.pronounce === true) {
				terminal.echo('/nwajo/');

				if (process.platform === 'darwin') {
					spawn('say', ['nwaw', 'yo']);
				}

				return;
			}

		}


		meowCli.showHelp();
	}

};
