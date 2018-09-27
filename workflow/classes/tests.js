//-------------------------------------
//-- Tests
//-------------------------------------
'use strict';

const Reporter = require('~/classes/reporter');


class Tests {

	run() {
		return Promise.resolve(new Reporter());
	}

}


module.exports = Tests;
