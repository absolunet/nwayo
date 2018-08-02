//-------------------------------------
//-- Reporter
//-------------------------------------
'use strict';

const chalk = require('chalk');


const clean = (data) => {
	return {
		success:     data.success,
		message:     data.message,
		differences: data.differences
	};
};






class Reporter {

	constructor() {
		this._reports = [];
	}


	add(data) {
		if (Array.isArray(data)) {
			const results = {};

			data.forEach((item) => {
				this._reports.push(clean(item));

				results[item.type] = item.success;
			});

			return results;
		}

		this._reports.push(clean(data));

		return data.success;
	}


	get last() {
		return this._reports[this._reports.length - 1];
	}


	get list() {
		return this._reports;
	}

	static get theme() {
		return {
			title:   chalk.cyan,
			comment: chalk.blue
		};
	}

}

module.exports = Reporter;
