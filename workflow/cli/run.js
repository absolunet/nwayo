//--------------------------------------------------------
//-- Run
//--------------------------------------------------------
'use strict';

const cli  = require('@absolunet/cli');
const util = require('../helpers/util');






module.exports = class {

	static cli(meowCli) {
		util.checkInstalledWorkflow();

		if (meowCli.input.length >= 2 && meowCli.input.length <= 3) {
			util.runWorkflowTask(meowCli.input[1], { bundle:meowCli.input[2] });

		} else {
			cli.showTaskUsage(meowCli);
		}
	}

};
