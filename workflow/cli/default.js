//--------------------------------------------------------
//-- Default
//--------------------------------------------------------
'use strict';

const spawn    = require('cross-spawn');
const cli      = require('@absolunet/cli');
const terminal = require('@absolunet/terminal');
const Task     = require('~/classes/task');
const { ow }   = cli;


class DefaultTask extends Task {

	constructor() {
		super();
		this.filename = __filename;
	}


	cli(meowCli) {

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

}


module.exports = new DefaultTask();
