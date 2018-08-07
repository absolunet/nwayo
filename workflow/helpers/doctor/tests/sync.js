//-------------------------------------
//-- Sync tests
//-------------------------------------
'use strict';

const fss      = require('@absolunet/fss');
const paths    = require('../../paths');
const env      = require('../../env');
const Reporter = require('../reporter');


const reports = new Reporter();






class SyncTests {

	run() {
		return new Promise((resolve) => {

			if (fss.exists(paths.config.bower)) {
				const bowerConfig     = require(paths.config.bower);  // eslint-disable-line global-require
				const workflowVersion = env.workflowPkg.version;
				const toolboxVersion  = bowerConfig.devDependencies['nwayo-toolbox'];

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
