//-------------------------------------
//-- Workflow tests
//-------------------------------------
'use strict';

const lastestVersion = require('latest-version');
const semver         = require('semver');
const env            = require('../../env');
const Reporter            = require('../reporter');


const reports = new Reporter();






class WorkflowTests {

	run() {

		return new Promise((resolve) => {
			const current = env.workflowPkg.version;

			lastestVersion(env.pkgName).then((latest) => {
				if (semver.gt(latest, current)) {
					reports.add({
						success: false,
						message: 'Workflow is outdated:',
						outdated: {
							current: current,
							latest:  latest
						}
					});
				} else {

					reports.add({
						success: true,
						message: `Workflow is cutting edge (${latest})`
					});
				}

				resolve({ report:reports });
			});
		});
	}

}


module.exports = new WorkflowTests();
