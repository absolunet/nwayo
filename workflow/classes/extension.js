//--------------------------------------------------------
//-- Extension
//--------------------------------------------------------
'use strict';

const terminal = require('@absolunet/terminal');
const flow     = require('~/helpers/flow');
const paths    = require('~/helpers/paths');
const toolbox  = require('~/helpers/toolbox');


class NwayoExtension {

	get id() {
		throw new Error('Id must be defined by extension');
	}

	get version() {
		throw new Error('Version must be defined by extension');
	}

	set options(options) {
		this._options = options;
	}

	get options() {
		return this._options;
	}



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
		flow.createTask(`${this.id}:${name}`, () => {
			try {
				return task();
			} catch (error) {
				return this.error(error);
			}
		});
	}

	log(taskName, msg, extra) {
		toolbox.log(`${this.id}:${taskName}`, msg, extra);
	}

	error(error) {
		terminal.error(`[nwayo-extension:${this.id} error]`);
		terminal.echo(error);
		terminal.exit();
	}

	getComponentDir(component) {
		return `${paths.dir.extensions.replace(paths.pattern.anytree, component)}/${this.id}`;
	}
	/* eslint-enable no-unused-vars */

}


module.exports = NwayoExtension;
