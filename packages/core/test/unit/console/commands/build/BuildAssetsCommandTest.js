//--------------------------------------------------------
//-- Node IoC - Test - Unit - Console - Commands - Build Assets Command
//--------------------------------------------------------
'use strict';

const BuildCommandTestCase = require('./BuildCommandTestCase');
const BuildAssetsCommand   = require('../../../../../dist/node/console/commands/build/BuildAssetsCommand');


class BuildAssetsCommandTest extends BuildCommandTestCase {

	//-- Helpers
	//--------------------------------------------------------

	getCommandClass() {
		return BuildAssetsCommand;
	}

	getType() {
		return 'assets';
	}

	getExpectedNwayoBuildExtraArguments() {
		return [];
	}

}


module.exports = BuildAssetsCommandTest;
