//--------------------------------------------------------
//-- Rebuild
//--------------------------------------------------------
'use strict';

const cli    = require('@absolunet/cli');
const Task   = require('~/classes/task');
const env    = require('~/helpers/env');
const util   = require('~/helpers/util');
const { ow } = cli;


class RebuildTask extends Task {

	constructor() {
		super();
		this.filename = __filename;
	}

	cli(meowCli) {
		util.checkInstalledWorkflow();

		const { prod } = cli.validateFlags(meowCli, {
			prod: ow.boolean  // eslint-disable-line unicorn/prevent-abbreviations
		});

		// --prod
		if (prod) {
			env.setToProduction();
		}

		if (meowCli.input.length <= 2) {
			const [, bundle] = meowCli.input;

			util.runWorkflowTask('rebuild', { bundle });

		} else {
			cli.showTaskUsage(meowCli);
		}
	}

}


module.exports = new RebuildTask();
