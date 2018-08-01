//-------------------------------------
//-- Reporter
//-------------------------------------
'use strict';


const clean = (data) => {
	return {
		success:     data.success,
		message:     data.message,
		differences: data.differences
	};
};






class Reporter {

	constructor() {
		this.reports = [];
	}


	add(data) {
		if (Array.isArray(data)) {
			const results = {};

			data.forEach((item) => {
				this.reports.push(clean(item));

				results[item.type] = item.success;
			});

			return results;
		}

		this.reports.push(clean(data));

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
