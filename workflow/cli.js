//--------------------------------------------------------
//-- CLI bootstrap
//--------------------------------------------------------
'use strict';

//-- Start
const chalk    = require('chalk');
const meow     = require('meow');
const cli      = require('@absolunet/cli');
const terminal = require('@absolunet/terminal');
const cliUtil  = require('./helpers/cli-util');
const env      = require('./helpers/env');
const paths    = require('./helpers/paths');






module.exports = ({ cliPkg, cliPath }) => {

	//-- Initialize
	cliUtil.init();

	//-- Don't you dare sudo me
	if (cli.isRoot()) {
		terminal.dontSudoMe();

	//-- Initialize CLI
	} else {

		const cliBin      = `     cli${chalk.yellow('@')}${cliPkg.version} ${cliPath}`;
		const workflowBin = `workflow${chalk.yellow('@')}${env.workflowPkg.version} ${paths.workflow.root}`;

		cli.tasksRouter(meow({
			pkg:         cliPkg,
			description: `${env.logo}  ${env.workflowPkg.definition}`,
			help:        `${cli.fullUsage}\n${cliBin}\n${workflowBin}`
		}));
	}

};
