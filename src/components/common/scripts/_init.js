//-------------------------------------
//-- Init
//-------------------------------------

//= **require     bower_components/foo/bar
//= **require     components/common/scripts/foobar
//= **jshtml      components/common/templates/foobar
//= **jshtml_tree components/common/templates

(function(){
	'use strict';

	var local = {};


	//-- Cache data
	local.cache = function() {

		// env
		app.env = {};
		app.env.culture = kafe.env('culture');
		app.env.lang    = kafe.env('lang');
		app.env.page    = kafe.env('page');
		app.env.tmpl    = kafe.env('tmpl');


		// dom
		app.dom = {};
		app.dom.window     = $(global);
		app.dom.document   = $(document);
		app.dom.body       = $('body');


		// path
		app.path = konstan.path;

		// transition
		app.transition = konstan.transition;


		// tmpl
		/**
		app.tmpl = app.tmpl || {};

		$('script[type="text/x-jsrender"][id^="jshtml-"]').each(function() {
			var id = $(this).attr('id');
			app.tmpl['html-'+id.substring(7)] = $.templates('#'+id);
		});

		$.views.helpers({
			konstan: function(key) {
				var value = '';
				// jshint evil:true
				eval('value = konstan["' + key.split('.').join('"]["') + '"];');
				// jshint evil:false
				return value;
			}
		});
		/**/
	};


	//-- Bind events
	local.bind = function() {

		//

	};


	//-- To execute on start
	local.start = function() {

		//

	};


	$(function() {
		local.cache();
		local.bind();
		local.start();
	});

})();
