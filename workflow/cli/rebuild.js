//--------------------------------------------------------
//-- Rebuild
//--------------------------------------------------------
'use strict';

const cli  = require('@absolunet/cli');
const env  = require('../helpers/env');
const util = require('../helpers/util');






module.exports = class {

	static cli(meowCli) {
		util.checkInstalledWorkflow();

		// --prod
		if (cli.acceptOnlyFlag(meowCli, 'prod') === true) {
			env.setToProd();
		}

		if (meowCli.input.length <= 2) {
			const [, bundle] = meowCli.input;

			util.runWorkflowTask('rebuild', { bundle });

		} else {
			cli.showTaskUsage(meowCli);
		}
	}

};
