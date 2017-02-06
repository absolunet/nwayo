//-------------------------------------
//-- SITE2 SUB
//-------------------------------------

//= **require     bower_components/foobar
//= **require     components/nwayo/scripts/wrapper-foobar
//= **jshtml      components/SITE2-SUB/templates/foobar
//= **jshtml_tree components/SITE2-SUB/templates

(() => {
	'use strict';

	const local = {};


	//-- Cache data instantly
	local.cache = () => {

		//

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

		//

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
	$.when(DOM_PARSE).done(() => {
		local.cacheDOM();
		local.bind();
		local.start();
	});

	// Document loaded
	$.when(DOCUMENT_LOAD).done(() => {
		local.delayedStart();
	});

})();
