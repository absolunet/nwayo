//-------------------------------------
//-- Reporter
//-------------------------------------
'use strict';

const chalk = require('chalk');


const clean = (data) => {
	return {
		success:     data.success,
		message:     data.message,
		differences: data.differences,
		outdated:    data.outdated
	};
};


// Pseudo private methods
const __ = (self) => {
	return {

		tickCounter: (success) => {
			if (success) {
				++self._successes;
			} else {
				++self._failures;
			}
		}

	};
};






class Reporter {

	constructor() {
		this._reports = [];
		this._successes = 0;
		this._failures = 0;
	}


	add(data) {
		if (Array.isArray(data)) {
			const results = {};

			data.forEach((item) => {
				this._reports.push(clean(item));
				__(this).tickCounter(item.success);

				results[item.type] = item.success;
			});

			return results;
		}

		this._reports.push(clean(data));
		__(this).tickCounter(data.success);

		return data.success;
	}


	get last() {
		return this._reports[this._reports.length - 1];
	}


	get list() {
		return this._reports;
	}


	get summary() {
		return {
			success: this._failures === 0,
			nb: {
				success: this._successes,
				failure: this._failures,
				total:   this._reports.length
			}
		};
	}


	static get theme() {
		return {
			title:   chalk.cyan,
			comment: chalk.blue
		};
	}

}

module.exports = Reporter;
