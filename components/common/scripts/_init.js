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


	//-- Cache data
	local.cache = () => {

		// tmpl
		/**
		$.views.helpers({
			konstan: key => { return _.get(konstan, key); }
		});
		/**/

	};


	//-- Cache DOM data
	local.cacheDOM = () => {

		// tmpl
		/**
		$('script[type="text/x-jsrender"][id^="jshtml-"]').each(function() {
			let id = $(this).attr('id');
			app.tmpl[`html-${id.substring(7)}`] = $.templates(`#${id}`);
		});
		/**/

	};


	//-- Bind events
	local.bind = () => {

		global.FastClick.attach(document.body);

	};


	//-- Subscribe to topics
	local.subscribe = () => {

		//

	};


	//-- To execute on start
	local.start = () => {

		//

	};






	// Outline
	local.cache();

	$(() => {
		local.cacheDOM();
		local.bind();
		local.subscribe();
		local.start();
	});

})();
