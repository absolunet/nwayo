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

		// tmpl
		/**
		$('script[type="text/x-jsrender"][id^="jshtml-"]').each(function() {
			var id = $(this).attr('id');
			app.tmpl['html-'+id.substring(7)] = $.templates('#'+id);
		});

		$.views.helpers({
			konstan: function(key) {
				return _.get(konstan, key);
			}
		});
		/**/
	};


	//-- Bind events
	local.bind = function() {

		global.FastClick.attach(document.body);

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
