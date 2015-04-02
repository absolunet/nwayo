//-------------------------------------
//-- Form
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

		//

	};


	//-- Bind events
	local.bind = function() {

		//-- input mask
		/**
		if (!Modernizr.inputtypes.date) {
			$('input[type="date"]').inputmask('yyyy-mm-dd');
		}
		$('input[type="tel"]').inputmask('(999) 999-9999');
		$('input[type="tel"][data-mask="ext"]').inputmask('(999) 999-9999 [ext: 99999]');

		$('input[data-mask="time"]').inputmask('hh:mm:ss');
		$('input[data-mask="postalcode"]').inputmask('A9A 9A9');
		$('input[data-mask="numeric"]').inputmask('non-negative-decimal', {radixPoint:',', digits:2 });
		$('input[data-mask="numeric-int"]').inputmask('9', {repeat:6, greedy:false });
		/**/

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
