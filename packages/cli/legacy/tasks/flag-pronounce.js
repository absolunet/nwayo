//-------------------------------------
//-- Pronounce
//-------------------------------------
'use strict';

const { spawn } = require('child_process');
const helper    = require('../helpers/cli');


//-- PUBLIC
module.exports = {

	//-- Run
	run: (/* context */) => {

		helper.echo('/nwajo/');

		return process.platform === 'darwin' ? spawn('say', ['nwaw', 'yo']) : undefined;
	}
};
