//-------------------------------------
//-- Workflow tests
//-------------------------------------
'use strict';

const lastestVersion = require('latest-version');
const semver         = require('semver');
const Reporter       = require('../../../classes/reporter');
const Tests          = require('../../../classes/tests');
const env            = require('../../env');


const reports = new Reporter();






class WorkflowTests extends Tests {

	async run() {

		const current = env.workflowConfig.version;
		const latest  = await lastestVersion(env.packageName);

		if (semver.gt(latest, current)) {
			reports.add({
				success: false,
				message: 'Workflow is outdated:',
				outdated: { current, latest }
			});

		} else {
			reports.add({
				success: true,
				message: `Workflow is cutting edge (${latest})`
			});
		}

		return reports;
	}

}


module.exports = new WorkflowTests();
