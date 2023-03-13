//--------------------------------------------------------
//-- Task
//--------------------------------------------------------
"use strict";

const { terminal } = require("@valtech-commerce/terminal");
const paths = require("../helpers/paths");

class Task {
	#filename;
	#deprecated;

	/* eslint-disable no-unused-vars */
	get filename() {
		return this.#filename;
	}

	set filename(filename) {
		this.#filename = filename;
	}

	get deprecate() {
		return this.#deprecated;
	}

	set deprecate(message) {
		this.#deprecated = message;
	}

	get bin() {
		if (this.#filename) {
			return this.#filename.split(`${paths.workflow.cliTasks}/`)[1].split(".js")[0].replace("/", ":");
		}

		throw new Error("Filename not defined by subclass");
	}

	cli(meowCli) {
		if (this.#deprecated) {
			terminal.spacer().warning(`DEPRECATED - ${this.#deprecated}`).spacer().exit();
		}

		throw new Error("Not overwritten by subclass");
	}

	run(options) {
		throw new Error("Not overwritten by subclass");
	}
	/* eslint-enable no-unused-vars */
}

module.exports = Task;
