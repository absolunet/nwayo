//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Console - Commands - Build Scripts Command
//--------------------------------------------------------
'use strict';

const BuildCommandTestCase = require('./BuildCommandTestCase');
const BuildScriptsCommand  = require('../../../../../dist/node/console/commands/build/BuildScriptsCommand');


class BuildScriptsCommandTest extends BuildCommandTestCase {

	//-- Helpers
	//--------------------------------------------------------

	getCommandClass() {
		return BuildScriptsCommand;
	}

	getType() {
		return 'scripts';
	}

	getExpectedNwayoBuildExtraArguments() {
		return [];
	}

}


module.exports = BuildScriptsCommandTest;
