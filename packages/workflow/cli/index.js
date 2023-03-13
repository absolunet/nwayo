//--------------------------------------------------------
//-- CLI bootstrap
//--------------------------------------------------------
"use strict";

//-- Start
const chalk = require("chalk");
const meow = require("meow");
const cli = require("@absolunet/cli");
const { terminal } = require("@valtech-commerce/terminal");
const env = require("../helpers/env"); // eslint-disable-line unicorn/prevent-abbreviations
const paths = require("../helpers/paths");
const util = require("../helpers/util");

module.exports = ({ cliPkg, cliPath, cliUsage }) => {
	//-- Initialize
	util.initCli(cliUsage);

	//-- Don't you dare sudo me
	if (cli.isRoot()) {
		terminal.dontSudoMe();

		//-- Initialize CLI
	} else {
		const cliBin = `     cli${chalk.yellow("@")}${cliPkg.version} ${cliPath}`;
		const workflowBin = `workflow${chalk.yellow("@")}${env.workflowConfig.version} ${paths.workflow.root}`;

		cli.tasksRouter(
			meow({
				pkg: cliPkg, // eslint-disable-line unicorn/prevent-abbreviations
				description: `${env.logo}  ${env.workflowConfig.definition}`,
				help: `${cli.fullUsage}\n${cliBin}\n${workflowBin}`,
			})
		);
	}
};
