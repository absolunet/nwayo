//-------------------------------------
//-- Watch
//-------------------------------------
'use strict';

const helper = require('../helpers/cli');


//-- PUBLIC
module.exports = {

	//-- Run
	run: (context) => {

		if (context.targets[0]) {
			context.flags = {
				bundle: context.targets[0]
			};
		}

		return helper.run('watch', context);
	}
};
