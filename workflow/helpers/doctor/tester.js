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
	get general() {
		return generalTests.run;
	}

	//-- Check if root structure and config files exists and are valid
	get root() {
		return rootTests.run;
	}

	//-- Check if bundles are valid
	get bundles() {
		return bundlesTests.run;
	}

	//-- Check if components are valid
	get components() {
		return componentsTests.run;
	}

	//-- Check if the workflow needs an update
	get workflowUpdates() {
		return workflowTests.run;
	}

	//-- Check if vendor packages need an update
	get vendorsUpdates() {
		return vendorsTests.run;
	}

	//-- Check if workflow and toolbox are at the same version
	get syncWorkflowToolbox() {
		return syncTests.run;
	}

}


module.exports = new Tester();
