//--------------------------------------------------------
//-- Node IoC - Test - Unit - Console - Commands - Build Styles Command
//--------------------------------------------------------
'use strict';

const BuildCommandTestCase = require('./BuildCommandTestCase');
const BuildStylesCommand   = require('../../../../../dist/node/console/commands/build/BuildStylesCommand');


class BuildStylesCommandTest extends BuildCommandTestCase {

	//-- Helpers
	//--------------------------------------------------------

	getCommandClass() {
		return BuildStylesCommand;
	}

	getType() {
		return 'styles';
	}

	getExpectedNwayoBuildExtraArguments() {
		return [];
	}

}


module.exports = BuildStylesCommandTest;
