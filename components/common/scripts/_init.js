//-------------------------------------
//-- Init
//-------------------------------------

//= **require     bower_components/foo/bar
//= **require     components/common/scripts/foobar
//= **jshtml      components/common/templates/foobar
//= **jshtml_tree components/common/templates

(() => {
	'use strict';

	let local = {};


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
			let id = $(this).attr('id');
			app.tmpl[`html-${id.substring(7)}`] = $.templates(`#${id}`);
		});
		/**/

	};


	//-- Bind events once DOM is loaded
	local.bind = () => {

		global.FastClick.attach(document.body);

	};


	//-- Subscribe to topics once DOM is loaded
	local.subscribe = () => {

		//

	};


	//-- Execute once DOM is loaded
	local.start = () => {

		//

	};


	//-- Execute once page is loaded
	local.delayedStart = () => {

		__.$body.addClass('page-loaded');

	};






	// Outline
	local.cache();

	$(() => {
		local.cacheDOM();
		local.bind();
		local.subscribe();
		local.start();
	});

	__.$window.on('load', () => {
		local.delayedStart();
	});

})();
