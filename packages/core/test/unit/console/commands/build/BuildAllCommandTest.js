//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Console - Commands - Build All Command
//--------------------------------------------------------
'use strict';

const BuildCommandTestCase = require('./BuildCommandTestCase');
const BuildAllCommand      = require('../../../../../dist/node/console/commands/build/BuildAllCommand');


class BuildAllCommandTest extends BuildCommandTestCase {

	//-- Helpers
	//--------------------------------------------------------

	getCommandClass() {
		return BuildAllCommand;
	}

	getType() {
		return 'all';
	}

	getExpectedNwayoBuildExtraArguments() {
		return [];
	}

	getExpectedPolicies() {
		return [];
	}

}


module.exports = BuildAllCommandTest;
