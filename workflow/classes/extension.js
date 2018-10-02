//--------------------------------------------------------
//-- Extension
//--------------------------------------------------------
'use strict';

const flow = require('~/helpers/flow');


class NwayoExtension {

	static createTask(id, name, action) {
		flow.createTask(`${id}:${name}`, action);
	}



	get id() {
		throw new Error('Id must be defined by extension');
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
	/* eslint-enable no-unused-vars */

}


module.exports = NwayoExtension;
