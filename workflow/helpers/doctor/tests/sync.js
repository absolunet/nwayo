//-------------------------------------
//-- Sync tests
//-------------------------------------
'use strict';

const fss   = require('@absolunet/fss');
const paths = require('../../paths');
const env   = require('../../env');






class SyncTests {

	run() {
		if (fss.exists(paths.config.bower)) {
			const bowerConfig     = require(paths.config.bower);  // eslint-disable-line global-require
			const workflowVersion = env.workflowPkg.version;
			const toolboxVersion  = bowerConfig.devDependencies['nwayo-toolbox'];

			if (workflowVersion !== toolboxVersion) {
				return { error:`Workflow ${workflowVersion} / Toolbox ${toolboxVersion} not in sync` };
			}

			return { message:`Workflow / Toolbox are at ${workflowVersion}` };
		}

		return { error:'No bower.json file found' };
	}

}


module.exports = new SyncTests();
