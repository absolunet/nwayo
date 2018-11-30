//-------------------------------------
//-- Install
//-------------------------------------
'use strict';

const path     = require('path');
const fss      = require('@absolunet/fss');
const terminal = require('@absolunet/terminal');
const helper   = require('../helpers/cli');


//-- PUBLIC
module.exports = {

	//-- Run
	run: (context) => {

		if (context.target === 'vendors') {
			fss.del(`${context.cwd}/bower_components`);
			terminal.run(`cd ${context.cwd} && node ${path.dirname(require.resolve('bower'))}/../bin/bower install`);

		} else {
			helper.error(`Installation of '${context.target}' not supported`);
		}

	}
};
