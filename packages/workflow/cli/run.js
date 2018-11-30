//--------------------------------------------------------
//-- Run
//--------------------------------------------------------
'use strict';

const cli  = require('@absolunet/cli');
const Task = require('~/classes/task');
const util = require('~/helpers/util');


class RunTask extends Task {

	constructor() {
		super();
		this.filename = __filename;
	}

	cli(meowCli) {
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

}


module.exports = new RunTask();
