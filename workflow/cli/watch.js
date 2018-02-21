//--------------------------------------------------------
//-- Watch
//--------------------------------------------------------
'use strict';

const cli     = require('@absolunet/cli');
const cliUtil = require('../helpers/cli-util');


module.exports = class {

	static cli(meowCli) {

		cliUtil.initProjectTask({
			bundle: meowCli.input[1]
		});


		if (meowCli.input.length <= 2) {

			cliUtil.runWorkflowTask('watch');

		} else {
			cli.showTaskUsage(meowCli);
		}
	}

};
