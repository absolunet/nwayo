//--------------------------------------------------------
//-- Watch
//--------------------------------------------------------
'use strict';

const cli  = require('@absolunet/cli');
const util = require('../../helpers/util');


module.exports = class {

	static cli(meowCli) {

		util.initCLIProjectTask({
			bundle: meowCli.input[1]
		});


		if (meowCli.input.length <= 2) {

			util.runWorkflowTask('watch');

		} else {
			cli.showTaskUsage(meowCli);
		}
	}
};
