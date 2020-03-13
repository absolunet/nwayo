//--------------------------------------------------------
//-- Tests - Unit - Console - Commands - Build - Stubs - Fake Date Helper
//--------------------------------------------------------
'use strict';


const fakeDateHelperFactory = (app) => {
	const dateHelper = app.make('helper.date');

	return () => {
		return () => {
			return dateHelper.utc(0); // January 1st, 1970 00:00:00
		};
	};
};


module.exports = fakeDateHelperFactory;
