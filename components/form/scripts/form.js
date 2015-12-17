//-------------------------------------
//-- Form
//-------------------------------------

//= **require bower_components/jquery.inputmask/dist/inputmask/inputmask
//= **require bower_components/jquery.inputmask/dist/inputmask/inputmask.extensions
//= **require bower_components/jquery.inputmask/dist/inputmask/inputmask.numeric.extensions
//= **require bower_components/jquery.inputmask/dist/inputmask/jquery.inputmask

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

		$('input[data-mask="credit-card"]').inputmask('9{10}');
		$('input[data-mask="credit-card-cvv"]').inputmask('9{4}');

		$('input[data-mask="quantity"]').inputmask('numeric', { min:0, max:10, allowPlus:false, allowMinus:false, digits:0, rightAlign:false });
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
