//--------------------------------------------------------
//-- Rebuild
//--------------------------------------------------------
'use strict';

const cli  = require('@absolunet/cli');
const util = require('../helpers/util');






module.exports = class {

	static cli(meowCli) {
		util.checkInstalledWorkflow();
		cli.refuseFlags(meowCli);
		// cli.acceptOnlyFlag(meowCli, 'prod');

		if (meowCli.input.length === 2) {
			const [, bundle] = meowCli.input;

			util.runWorkflowTask('rebuild', { bundle });

		} else {
			cli.showTaskUsage(meowCli);
		}
	}

};
