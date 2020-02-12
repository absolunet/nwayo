//-------------------------------------
//-- Sync tests
//-------------------------------------
'use strict';

const fss      = require('@absolunet/fss');
const Reporter = require('../../../classes/reporter');
const Tests    = require('../../../classes/tests');
const env      = require('../../env');
const paths    = require('../../paths');


const reports = new Reporter();






class SyncTests extends Tests {

	// eslint-disable-next-line require-await
	async run() {

		if (fss.exists(paths.config.vendors)) {
			const vendorsConfig   = fss.readJson(paths.config.vendors);
			const workflowVersion = env.workflowConfig.version;
			const toolboxVersion  = vendorsConfig.dependencies[`@absolunet/${env.id}-toolbox`];

			if (workflowVersion !== toolboxVersion) {
				reports.add({
					success: false,
					message: `Workflow / Toolbox are not in sync (${workflowVersion} vs ${toolboxVersion})`
				});
			} else {
				reports.add({
					success: true,
					message: `Workflow / Toolbox are in sync (${workflowVersion})`
				});
			}
		} else {
			reports.add({
				success: false,
				message: `No vendor/package.json file found`
			});
		}

		return reports;
	}

}


module.exports = new SyncTests();
