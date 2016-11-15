//-------------------------------------
//-- Init
//-------------------------------------

//= **require     bower_components/foo/bar
//= **require     components/common/scripts/foobar
//= **jshtml      components/common/templates/foobar
//= **jshtml_tree components/common/templates

(() => {
	'use strict';

	const local = {};


	//-- Cache data instantly
	local.cache = () => {

		// tmpl
		/**
		$.views.helpers({
			konstan: key => { return _.get(konstan, key); }
		});
		/**/

	};


	//-- Cache data once DOM is loaded
	local.cacheDOM = () => {

		// tmpl
		/**
		$('script[type="text/x-jsrender"][id^="jshtml-"]').each(function() {
			const id = $(this).attr('id');
			app.tmpl[`html${_.upperFirst(_.camelCase(id.substring(7)))}`] = $.templates(`#${id}`);
		});
		/**/

	};


	//-- Bind events once DOM is loaded
	local.bind = () => {

		FastClick.attach(document.body);

	};


	//-- Subscribe to topics
	local.subscribe = () => {

		// When global jQuery is ready
		/**
		PubSub.subscribe('nwayo.jQueryGlobal.ready', () => {
			$Global.on('click');
		});
		/**/

	};


	//-- Execute once DOM is loaded
	local.start = () => {

		//

	};


	//-- Execute once page is loaded
	local.delayedStart = () => {

		__.$body.addClass('document-loaded');

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
