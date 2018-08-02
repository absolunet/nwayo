//--------------------------------------------------------
//-- Rebuild
//--------------------------------------------------------
'use strict';

const ow   = require('ow');
const cli  = require('@absolunet/cli');
const env  = require('../helpers/env');
const util = require('../helpers/util');






module.exports = class {

	static cli(meowCli) {
		util.checkInstalledWorkflow();

		const { prod } = cli.validateFlags(meowCli, {
			prod: ow.boolean
		});

		// --prod
		if (prod) {
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
