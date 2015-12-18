//-------------------------------------
//-- Util
//-------------------------------------

//= **require     components/foo/scripts/bar
//= **jshtml      components/common/templates/foobar
//= **jshtml_tree components/common/templates

(() => {
	'use strict';

	let foo = 1;
	let local = {};


	//-- Bar
	local.bar = () => {

		//

	};




	//-- Public class
	app.util = class {

		// Property foo
		static get foo() {
			return foo;
		}

		// Method bar()
		static bar( options={} ) {
			if (options.bar) {
				local.bar();
			}
		}

	};

})();
