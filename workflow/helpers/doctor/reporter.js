//-------------------------------------
//-- Reporter
//-------------------------------------
'use strict';


class Reporter {

	constructor() {
		this.reports = [];
	}


	add(data) {
		if (Array.isArray(data)) {
			const results = {};

			data.forEach((item) => {
				this.reports.push({
					success: item.success,
					message: item.message
				});

				results[item.type] = item.success;
			});

			return results;
		}

		this.reports.push(data);

		return data.success;
	}


	get last() {
		return this.reports[this.reports.length - 1];
	}


	get list() {
		return this.reports;
	}

}

module.exports = Reporter;
