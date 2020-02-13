//-------------------------------------
//-- Tests
//-------------------------------------
'use strict';

const Reporter = require('./reporter');


class Tests {

	// eslint-disable-next-line require-await
	async run() {
		return new Reporter();
	}

}


module.exports = Tests;
