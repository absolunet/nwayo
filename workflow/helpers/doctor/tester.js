//-------------------------------------
//-- Tester
//-------------------------------------
'use strict';

const baseTests       = require('./tests/base');
const bundlesTests    = require('./tests/bundles');
const componentsTests = require('./tests/components');
const syncTests       = require('./tests/sync');
const vendorsTests    = require('./tests/vendors');
const workflowTests   = require('./tests/workflow');






class Tester {

	/*

	lint files (json / yaml / editorconfig)

	*/


	//-- Check if config files exists and are valid
	base(cb) {
		cb(null, { report:baseTests.run().list });
	}

	//-- Check if bundles are valid
	bundles(cb) {
		cb(null, { report:bundlesTests.run().list });
	}

	//-- Check if components are valid
	components(cb) {
		cb(null, { report:componentsTests.run().list });
	}

	//-- Check if the workflow needs an update
	workflowUpdates(cb) {
		workflowTests.run().then((reports) => {
			cb(null, reports);
		});
	}

	//-- Check if bower packages need an update
	bowerUpdates(cb) {
		cb(null, vendorsTests.run());
	}

	//-- Check if nwayo workflow and toolbox are at the same version
	syncWorkflowToolbox(cb) {
		cb(null, syncTests.run());
	}

}


module.exports = new Tester();
