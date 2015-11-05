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

		# https://lodash.com/docs#get
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
