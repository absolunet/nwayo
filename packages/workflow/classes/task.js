//--------------------------------------------------------
//-- Task
//--------------------------------------------------------
'use strict';

const __       = require('@absolunet/private-registry');
const terminal = require('@absolunet/terminal');
const paths    = require('~/helpers/paths');


class Task {

	/* eslint-disable no-unused-vars */
	set filename(filename) {
		__(this).set('filename', filename);
	}


	set deprecate(message) {
		__(this).set('deprecated', message);
	}


	get bin() {
		if (__(this).get('filename')) {
			return __(this).get('filename').split(`${paths.workflow.cliTasks}/`)[1].split('.js')[0].replace('/', ':');
		}

		throw new Error('Filename not defined by subclass');
	}


	cli(meowCli) {
		if (__(this).get('deprecated')) {
			terminal.spacer();
			terminal.warning(`DEPRECATED - ${__(this).get('deprecated')}`);
			terminal.exit();
		}

		throw new Error('Not overwritten by subclass');
	}


	run(options) {
		throw new Error('Not overwritten by subclass');
	}
	/* eslint-enable no-unused-vars */

}


module.exports = Task;
