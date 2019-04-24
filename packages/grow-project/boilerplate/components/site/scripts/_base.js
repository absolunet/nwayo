//-------------------------------------
//-- Site - Base
//-------------------------------------

(() => {
	'use strict';

	const local = {};


	//-- Cache data instantly
	local.cache = () => {

		// Env
		// app.env.isUniquePage = app.env.pageId === 'UID';
		// app.env.isTypePage   = _.includes(app.env.pageTags, 'TYPE-ID');
		// app.env.isOneOfThese = Boolean(_.intersection(app.env.pageTags, ['ID1', 'ID2']).length);

	};


	//-- Cache data once DOM is loaded
	local.cacheDOM = () => {

		//

	};


	//-- Bind events once DOM is loaded
	local.bind = () => {

		//

	};


	//-- Subscribe to topics
	local.subscribe = () => {

		// pinki.message.subscribe('foo.bar',  () => {});

	};


	//-- Execute once DOM is loaded
	local.start = () => {

		//

	};


	//-- Execute once page is loaded
	local.delayedStart = () => {

		//

	};






	// Outline
	local.cache();
	local.subscribe();

	// DOM Ready
	pinki.vow.when(DOM_PARSED).then(() => {
		local.cacheDOM();
		local.bind();
		local.start();
	});

	// Document loaded
	pinki.vow.when(DOCUMENT_LOADED).then(() => {
		local.delayedStart();
	});

})();
