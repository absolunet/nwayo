//--------------------------------------------------------
//-- Node IoC - Test - Unit - Console - Commands - Build Watch Command
//--------------------------------------------------------
'use strict';

const BuildCommandTestCase = require('./BuildCommandTestCase');
const BuildWatchCommand    = require('../../../../../dist/node/console/commands/build/BuildWatchCommand');


class BuildWatchCommandTest extends BuildCommandTestCase {

	//-- Helpers
	//--------------------------------------------------------

	getCommandClass() {
		return BuildWatchCommand;
	}

	getType() {
		return 'watch';
	}

	getBuildType() {
		return 'all';
	}

	getExpectedNwayoBuildExtraArguments() {
		return [{ watch: true }];
	}

	getExpectedDescription() {
		return 'Listen for changes on files and run appropriate build.';
	}

	getExpectedPolicies() {
		return [];
	}

}


module.exports = BuildWatchCommandTest;
