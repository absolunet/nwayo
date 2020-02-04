//-------------------------------------
//-- Install
//-------------------------------------
'use strict';

const path         = require('path');
const fss          = require('@absolunet/fss');
const { terminal } = require('@absolunet/terminal');
const helper       = require('../helpers/cli');


//-- PUBLIC
module.exports = {

	//-- Run
	run: (context) => {

		if (context.target === 'vendors') {
			fss.remove(`${context.cwd}/bower_components`);
			terminal.process.run(`node ${path.dirname(require.resolve('bower'))}/../bin/bower install`, { directory: context.cwd });

		} else {
			helper.error(`Installation of '${context.target}' not supported`);
		}

	}
};
