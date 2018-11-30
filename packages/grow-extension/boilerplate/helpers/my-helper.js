//--------------------------------------------------------
//-- MyExtension - MyHelper
//--------------------------------------------------------
'use strict';


class MyHelper {

	get foo() {
		return 'bar';
	}


	doIt(x, y, z) {
		return x + y + z;
	}

}


module.exports = new MyHelper();
