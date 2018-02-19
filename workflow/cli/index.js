//--------------------------------------------------------
//-- CLI bootstrap
//--------------------------------------------------------
'use strict';

const chalk    = require('chalk');
const meow     = require('meow');
const cli      = require('@absolunet/cli');
const terminal = require('@absolunet/terminal');
const env      = require('../helpers/env');
const paths    = require('../helpers/paths');
const util     = require('../helpers/util');






module.exports = ({ cliPkg, cliPath /* config, cwd */  }) => {

	//-- Initialize
	util.initCLI();

	//-- Don't you dare sudo me
	if (cli.isRoot()) {
		terminal.dontSudoMe();

	//-- Initialize CLI
	} else {

		const cliBin      = `     cli${chalk.yellow('@')}${cliPkg.version} ${cliPath}`;
		const workflowBin = `workflow${chalk.yellow('@')}${env.workflowPkg.version} ${paths.workflow.root}`;

		cli.tasksRouter(meow({
			pkg:         cliPkg,
			description: `${util.logo}  ${env.workflowPkg.definition}`,
			help:        `${cli.fullUsage}\n${cliBin}\n${workflowBin}`
		}));
	}

};
