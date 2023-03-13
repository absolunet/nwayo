//--------------------------------------------------------
//-- Grow project
//--------------------------------------------------------
"use strict";

const chalk = require("chalk");
const figures = require("figures");
const inquirer = require("inquirer");
const replaceInFile = require("replace-in-file");
const { fsSync } = require("@valtech-commerce/fs");

const LOCAL = fsSync.realpath(".");
const NWAYO = `${LOCAL}/nwayo`;
const CONFIG_ORIGINAL = `${NWAYO}/nwayo.yaml`;
const BUNDLE = `${NWAYO}/bundles/site/site.yaml`;
const CONFIG = `${LOCAL}/nwayo.yaml`;

const ROOT = fsSync.realpath(__dirname);
const BOILERPLATE = `${ROOT}/boilerplate`;
const PACKAGE = fsSync.readJson(`${ROOT}/package.json`);

const echo = console.log; // eslint-disable-line no-console

const error = (message) => {
	console.error(chalk.red(`\n  ${figures.cross} ${message}`)); // eslint-disable-line no-console
	process.exit(); // eslint-disable-line no-process-exit, unicorn/no-process-exit
};

class GrowProject {
	async cli() {
		if (fsSync.exists(NWAYO)) {
			error(`There is already a 'nwayo' folder`);
		}

		if (fsSync.exists(CONFIG)) {
			error(`There is already a 'nwayo.yaml' file`);
		}

		const { projectId } = await inquirer.prompt([
			{
				name: "projectId",
				message: `What is your project's id ?`,
				type: "input",
				validate: (id) => {
					if (id.length >= 3) {
						if (/^(?<kebab1>[a-z][a-z0-9]*)(?<kebab2>-[a-z0-9]+)*$/u.test(id)) {
							return true;
						}

						return "The project id must be kebab-case";
					}

					return "The project id must be at least 3 characters long";
				},
			},
		]);

		echo(chalk.blue(`\n${figures.play} Generating project ${figures.ellipsis}`));

		// Duplicate boilerplate
		fsSync.copy(BOILERPLATE, NWAYO);
		fsSync.rename(`${NWAYO}/-gitignore`, `${NWAYO}/.gitignore`);

		// Configuration
		const config = fsSync.readYaml(CONFIG_ORIGINAL);
		fsSync.writeYaml(CONFIG, config);
		fsSync.remove(CONFIG_ORIGINAL);

		// Bundle
		const bundle = fsSync.readYaml(BUNDLE);
		bundle.output.konstan = "../pub/build";
		bundle.output.build = "../pub/build";
		fsSync.writeYaml(BUNDLE, bundle);

		// Change project name
		await replaceInFile({
			files: [`${NWAYO}/package.json`, `${NWAYO}/vendor/package.json`],
			from: "PROJECT_NAME",
			to: projectId,
		});

		// Confirmation
		echo(`
${chalk.green(`${figures.tick} ${chalk.bold(projectId)} via nwayo ${PACKAGE.version} created!`)}


  1. If not already present, install nwayo CLI via ${chalk.yellow("npm i -g @absolunet/nwayo-cli")}
  2. Run ${chalk.yellow("npm install")} in the nwayo root folder
  3. Run ${chalk.yellow("nwayo rebuild")} in the nwayo root folder
  4. Enjoy !
		`);
	}
}

module.exports = new GrowProject();
