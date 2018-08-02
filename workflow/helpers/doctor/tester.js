//-------------------------------------
//-- Tester
//-------------------------------------
'use strict';

const bundlesTests    = require('./tests/bundles');
const componentsTests = require('./tests/components');
const generalTests    = require('./tests/general');
const rootTests       = require('./tests/root');
const syncTests       = require('./tests/sync');
const vendorsTests    = require('./tests/vendors');
const workflowTests   = require('./tests/workflow');






class Tester {

	/*

	lint files (json / yaml / editorconfig)

	*/


	//-- Check if config files exists and are valid
	general(cb) {
		cb(null, { report:generalTests.run() });
	}

	//-- Check if config files exists and are valid
	root(cb) {
		cb(null, { report:rootTests.run() });
	}

	//-- Check if bundles are valid
	bundles(cb) {
		cb(null, { report:bundlesTests.run() });
	}

	//-- Check if components are valid
	components(cb) {
		cb(null, { report:componentsTests.run() });
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
