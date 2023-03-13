//--------------------------------------------------------
//-- Extension
//--------------------------------------------------------
"use strict";

const { terminal } = require("@valtech-commerce/terminal");
const paths = require("../helpers/paths");
const toolbox = require("../helpers/toolbox");

class NwayoExtension {
	get id() {
		throw new Error("Id must be defined by extension");
	}

	get version() {
		throw new Error("Version must be defined by extension");
	}

	get options() {
		return this._options;
	}

	set options(options) {
		this._options = options;
	}

	// Params kept to show methods signature, on-the-spot require to avoid inclusion loop
	/* eslint-disable no-unused-vars */
	init({ options }) {
		this.options = options;
	}

	taskExists(name) {
		return false;
	}

	requireTask(name) {
		//
	}

	createTask(name, task) {
		const flow = require("../helpers/flow"); // eslint-disable-line node/global-require

		flow.createTask(`${this.id}:${name}`, () => {
			try {
				return task();
			} catch (error) {
				return this.error(error);
			}
		});
	}

	log(taskName, message, extra) {
		toolbox.log(`${this.id}:${taskName}`, message, extra);
	}

	error(error) {
		terminal.error(`[nwayo-extension:${this.id} error]`).echo(error).exit();
	}

	getComponentDirectory(component) {
		return `${paths.directory.extensions.replace(paths.pattern.anytree, component)}/${this.id}`;
	}

	getGeneratedBanner(name, type) {
		const util = require("../helpers/util"); // eslint-disable-line node/global-require

		return util.getGeneratedBanner(name, type, this);
	}
	/* eslint-enable no-unused-vars, global-require */
}

module.exports = NwayoExtension;
