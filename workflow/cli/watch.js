//--------------------------------------------------------
//-- Watch
//--------------------------------------------------------
'use strict';

const cli  = require('@absolunet/cli');
const util = require('../helpers/util');






module.exports = class {

	static cli(meowCli) {
		util.checkInstalledWorkflow();

		if (meowCli.input.length <= 2) {
			util.runWorkflowTask('watch', { bundle:meowCli.input[1] });

		} else {
			cli.showTaskUsage(meowCli);
		}
	}

};
