//--------------------------------------------------------
//-- Grow extension
//--------------------------------------------------------
"use strict";

const chalk = require("chalk");
const figures = require("figures");
const { fsSync } = require("@valtech-commerce/fs");

const LOCAL = fsSync.realpath(".");
const EXTENSION = `${LOCAL}/my-extension`;

const ROOT = fsSync.realpath(__dirname);
const BOILERPLATE = `${ROOT}/boilerplate`;
const PACKAGE = fsSync.readJson(`${ROOT}/package.json`);

const echo = console.log; // eslint-disable-line no-console

const error = (message) => {
	console.error(chalk.red(`\n  ${figures.cross} ${message}`)); // eslint-disable-line no-console
	process.exit(); // eslint-disable-line no-process-exit, unicorn/no-process-exit
};

class GrowExtension {
	cli() {
		if (fsSync.exists(EXTENSION)) {
			error(`There is already a 'my-extension' folder`);
		}

		echo(chalk.blue(`\n${figures.play} Generating extension ${figures.ellipsis}`));

		// Duplicate boilerplate
		fsSync.copy(BOILERPLATE, EXTENSION);
		fsSync.rename(`${EXTENSION}/-gitignore`, `${EXTENSION}/.gitignore`);
		fsSync.rename(`${EXTENSION}/-npmignore`, `${EXTENSION}/.npmignore`);

		// Confirmation
		echo(`
${chalk.green(`${figures.tick} ${chalk.bold(`nwayo ${PACKAGE.version}`)} extension created!`)}
		`);
	}
}

module.exports = new GrowExtension();
