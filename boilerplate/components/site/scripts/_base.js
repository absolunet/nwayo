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
		// app.env.isOneOfThese = !!_.intersection(app.env.pageTags, ['ID1', 'ID2']).length;

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

		// PubSub.subscribe('foo.bar',  () => {});

		// Bind on the global jQuery elements
		// PubSub.subscribe('nwayo.jQueryGlobal.ready', (msg, $Global) => {
		// 	$Global('[data-block="minicart"]').dropdownDialog('close');
		// });

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
	$.when(DOM_PARSE).then(() => {
		local.cacheDOM();
		local.bind();
		local.start();
	});

	// Document loaded
	$.when(DOCUMENT_LOAD).then(() => {
		local.delayedStart();
	});

})();
