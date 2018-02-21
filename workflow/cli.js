//--------------------------------------------------------
//-- CLI bootstrap
//--------------------------------------------------------
'use strict';

//-- Get nwayo.yaml
const findUp = require('find-up');
const yaml   = require('js-yaml');
const path   = require('path');
const fss    = require('@absolunet/fss');

const configFilepath       = findUp.sync('nwayo.yaml', { cwd:process.cwd() });
const config               = yaml.safeLoad(fss.readFile(configFilepath, 'utf8'));
global.nwayoCLIProjectRoot = path.normalize(`${path.dirname(configFilepath)}/${config.root}`);






//-- Start
const chalk    = require('chalk');
const meow     = require('meow');
const cli      = require('@absolunet/cli');
const terminal = require('@absolunet/terminal');
const env      = require('./helpers/env');
const paths    = require('./helpers/paths');
const util     = require('./helpers/util');






module.exports = ({ cliPkg, cliPath }) => {

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
