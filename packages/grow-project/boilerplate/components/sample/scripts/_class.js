//-------------------------------------
//-- Sample - Class
//-------------------------------------

//= **require     vendor/node_modules/foobar
//= **require     components/nwayo/scripts/wrapper-foobar
//= **jshtml      components/sample/templates/foobar
//= **jshtml_tree components/sample/templates

(() => {
	'use strict';

	const foo = 1;
	const local = {};


	//-- Bar
	local.bar = () => {

		/* ... */

	};


	//-- Public class
	class MyClass {

		// Property foo
		get foo() {
			return foo;
		}

		// Method bar()
		bar(options = {}) {
			if (options.bar) {
				local.bar();
			}
		}

	}

	app.myclass = new MyClass();

})();
