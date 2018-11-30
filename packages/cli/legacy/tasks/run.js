//-------------------------------------
//-- Run
//-------------------------------------
'use strict';

const helper = require('../helpers/cli');


//-- PUBLIC
module.exports = {

	//-- Run
	run: (context) => {
		const task = context.target !== null ? context.target : 'default';

		if (context.targets[1]) {
			context.flags = {
				bundle: context.targets[1]
			};
		}

		return helper.run(task, context);
	}
};
