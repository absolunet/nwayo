//-------------------------------------
//-- Workflow tests
//-------------------------------------
'use strict';

const lastestVersion = require('latest-version');
const semver         = require('semver');
const Reporter       = require('~/classes/reporter');
const Tests          = require('~/classes/tests');
const env            = require('~/helpers/env');


const reports = new Reporter();






class WorkflowTests extends Tests {

	async run() {

		const current = env.workflowPkg.version;
		const latest  = await lastestVersion(env.pkgName);

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

		return reports;
	}

}


module.exports = new WorkflowTests();
