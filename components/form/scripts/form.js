//-------------------------------------
//-- Form
//-------------------------------------

//= **require bower_components/jquery.inputmask/dist/inputmask/inputmask
//= **require bower_components/jquery.inputmask/dist/inputmask/inputmask.extensions
//= **require bower_components/jquery.inputmask/dist/inputmask/inputmask.numeric.extensions
//= **require bower_components/jquery.inputmask/dist/inputmask/jquery.inputmask

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
