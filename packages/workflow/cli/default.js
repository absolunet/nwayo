//--------------------------------------------------------
//-- Default
//--------------------------------------------------------
'use strict';

const Task = require('~/classes/task');


class DefaultTask extends Task {

	constructor() {
		super();
		this.filename = __filename;
	}


	cli(meowCli) {
		meowCli.showHelp();
	}

}


module.exports = new DefaultTask();
