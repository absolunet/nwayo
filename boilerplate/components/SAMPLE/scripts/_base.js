//-------------------------------------
//-- SAMPLE - Base
//-------------------------------------

//= **require     bower_components/foobar
//= **require     components/nwayo/scripts/wrapper-foobar
//= **jshtml      components/SAMPLE/templates/foobar
//= **jshtml_tree components/SAMPLE/templates

(() => {
	'use strict';

	class SAMPLEBaseRegistrable extends app.js.Registrable {

		//-- Cache data instantly
		cache() {

			//

		}


		//-- Cache data once DOM is loaded
		cacheDOM() {

			//

		}


		//-- Bind events once DOM is loaded
		bind() {

			//

		}


		//-- Subscribe to topics
		subscribe() {

			//

		}


		//-- Execute once DOM is loaded
		start() {

			//

		}


		//-- Execute once page is loaded
		delayedStart() {

			//

		}

	}

	app.js.registrar.register(SAMPLEBaseRegistrable);

})();
