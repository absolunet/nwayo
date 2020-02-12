//--------------------------------------------------------
//-- Watch
//--------------------------------------------------------
'use strict';

const cli  = require('@absolunet/cli');
const Task = require('../classes/task');
const util = require('../helpers/util');


class WatchTask extends Task {

	constructor() {
		super();
		this.filename = __filename;
	}

	cli(meowCli) {
		util.checkInstalledWorkflow();
		cli.refuseFlags(meowCli);

		if (meowCli.input.length <= 2) {
			const [, bundle] = meowCli.input;

			util.runWorkflowTask('watch', { bundle });

		} else {
			cli.showTaskUsage(meowCli);
		}
	}

}


module.exports = new WatchTask();
