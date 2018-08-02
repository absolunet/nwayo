//-------------------------------------
//-- Workflow tests
//-------------------------------------
'use strict';

const lastestVersion = require('latest-version');
const semver         = require('semver');
const env            = require('../../env');






class WorkflowTests {

	run() {

		return new Promise((resolve) => {
			const current = env.workflowPkg.version;

			lastestVersion(env.pkgName).then((latest) => {
				if (semver.gt(latest, current)) {
					resolve({
						outdated: [{
							current: current,
							latest:  latest,
							name:    env.pkgName
						}]
					});
				} else {
					resolve({ message:`Latest version is ${latest}` });
				}
			});
		});
	}

}


module.exports = new WorkflowTests();
