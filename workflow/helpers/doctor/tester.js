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

	//-- General checks (kebabCase, useless files)
	general(cb) {
		generalTests.run().then((reports) => {
			cb(null, reports);
		});
	}

	//-- Check if root structure and config files exists and are valid
	root(cb) {
		rootTests.run().then((reports) => {
			cb(null, reports);
		});
	}

	//-- Check if bundles are valid
	bundles(cb) {
		bundlesTests.run().then((reports) => {
			cb(null, reports);
		});
	}

	//-- Check if components are valid
	components(cb) {
		componentsTests.run().then((reports) => {
			cb(null, reports);
		});
	}

	//-- Check if the workflow needs an update
	workflowUpdates(cb) {
		workflowTests.run().then((reports) => {
			cb(null, reports);
		});
	}

	//-- Check if vendor packages need an update
	vendorsUpdates(cb) {
		vendorsTests.run().then((reports) => {
			cb(null, reports);
		});
	}

	//-- Check if nwayo workflow and toolbox are at the same version
	syncWorkflowToolbox(cb) {
		syncTests.run().then((reports) => {
			cb(null, reports);
		});
	}

}


module.exports = new Tester();
