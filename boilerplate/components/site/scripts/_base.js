//-------------------------------------
//-- Site - Base
//-------------------------------------

(() => {
	'use strict';

	class SiteBaseRegistrable extends app.js.Registrable {

		//-- Cache data instantly
		cache() {

			// Env
			// app.env.isUniquePage = app.env.pageId === 'UID';
			// app.env.isTypePage   = _.includes(app.env.pageTags, 'TYPE-ID');
			// app.env.isOneOfThese = !!_.intersection(app.env.pageTags, ['ID1', 'ID2']).length;

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

			// pinki.message.subscribe('foo.bar',  () => {});

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

	app.js.registrar.register(SiteBaseRegistrable);

})();
