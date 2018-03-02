//--------------------------------------------------------
//-- Watch
//--------------------------------------------------------
'use strict';

const cli  = require('@absolunet/cli');
const util = require('../helpers/util');






module.exports = class {

	static cli(meowCli) {
		util.checkInstalledWorkflow();
		cli.refuseFlags(meowCli);

		if (meowCli.input.length === 2) {
			const [, bundle] = meowCli.input;

			util.runWorkflowTask('watch', { bundle });

		} else {
			cli.showTaskUsage(meowCli);
		}
	}

};
