//--------------------------------------------------------
//-- Run
//--------------------------------------------------------
'use strict';

const cli  = require('@absolunet/cli');
const util = require('../helpers/util');






module.exports = class {

	static cli(meowCli) {
		util.checkInstalledWorkflow();
		cli.refuseFlags(meowCli);

		if (meowCli.input.length <= 3) {
			const [, task, bundle] = meowCli.input;

			if (task) {
				util.runWorkflowTask(task, { bundle });

			} else {
				cli.showTaskUsage(meowCli);
			}

		} else {
			cli.showTaskUsage(meowCli);
		}
	}

};
