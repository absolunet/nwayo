//-------------------------------------
//-- Reporter
//-------------------------------------
'use strict';

const chalk = require('chalk');
const __    = require('@absolunet/private-registry');


const addReport = (self, report) => {
	const { reports }           = __(self).get();
	let { successes, failures } = __(self).get();

	reports.push(report);

	if (report.success) {
		++successes;
	} else {
		++failures;
	}

	__(self).set({ reports, successes, failures });
};






class Reporter {

	constructor() {
		__(this).set({
			reports: [],
			successes: 0,
			failures:  0
		});
	}


	add(data) {
		if (Array.isArray(data)) {
			const results = {};

			data.forEach((item) => {
				addReport(this, item);
				results[item.type] = item.success;
			});

			return results;
		}

		addReport(this, data);

		return data.success;
	}


	get last() {
		return this.list[this.list.length - 1];
	}


	get list() {
		return __(this).get('reports');
	}


	get summary() {
		const { reports, successes, failures } = __(this).get();

		return {
			success: failures === 0,
			nb: {
				success: successes,
				failure: failures,
				total:   reports.length
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
