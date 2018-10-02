//-------------------------------------
//-- Sync tests
//-------------------------------------
'use strict';

const fss      = require('@absolunet/fss');
const Reporter = require('~/classes/reporter');
const Tests    = require('~/classes/tests');
const env      = require('~/helpers/env');
const paths    = require('~/helpers/paths');


const reports = new Reporter();






class SyncTests extends Tests {

	run() {
		return new Promise((resolve) => {

			if (fss.exists(paths.config.bower)) {
				const bowerConfig     = fss.readJson(paths.config.bower);
				const workflowVersion = env.workflowPkg.version;
				const toolboxVersion  = bowerConfig.devDependencies[`${env.id}-toolbox`];

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
					message: `No bower.json file found`
				});
			}

			resolve(reports);

		});
	}

}


module.exports = new SyncTests();
