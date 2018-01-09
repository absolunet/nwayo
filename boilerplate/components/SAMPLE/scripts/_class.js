//-------------------------------------
//-- SAMPLE - Class
//-------------------------------------

//= **require     bower_components/foobar
//= **require     components/nwayo/scripts/wrapper-foobar
//= **jshtml      components/SAMPLE/templates/foobar
//= **jshtml_tree components/SAMPLE/templates

(() => {
	'use strict';

	const foo = 1;
	const local = {};


	//-- Bar
	local.bar = () => {

		/* ... */

	};


	//-- Public class
	app.class = class {

		// Property foo
		static get foo() {
			return foo;
		}

		// Method bar()
		static bar(options = {}) {
			if (options.bar) {
				local.bar();
			}
		}

	};

})();
