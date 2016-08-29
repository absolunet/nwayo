//-------------------------------------
//-- Bar
//-------------------------------------

//= **require     bower_components/foo/bar
//= **require     components/foo/scripts/bar
//= **jshtml      components/foo/templates/foobar
//= **jshtml_tree components/foo/templates

(() => {
	'use strict';

	const foo = 1;
	const local = {};


	//-- Bar
	local.bar = () => {

		//

	};




	//-- Public class
	app.foobar = class {

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
