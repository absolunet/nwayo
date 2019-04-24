//-------------------------------------
//-- Form - Base
//-------------------------------------

//= **require vendor/node_modules/inputmask/dist/inputmask/inputmask
//= **require vendor/node_modules/inputmask/dist/inputmask/inputmask.extensions
//= **require vendor/node_modules/inputmask/dist/inputmask/inputmask.date.extensions
//= **require vendor/node_modules/inputmask/dist/inputmask/inputmask.numeric.extensions
//= **require vendor/node_modules/inputmask.phone/dist/inputmask.phone/inputmask.phone.extensions
//= **require vendor/node_modules/inputmask/dist/inputmask/jquery.inputmask

(() => {
	'use strict';

	const local = {};

	//-- Input mask
	const bindInputMask = (/* $context = __.$body */) => {

		/**
		// Numeric
		$context.find('input[data-mask="numeric-integer"]').inputmask('integer', {
			allowPlus:     false,
			allowMinus:    false,
			min:           1,
			integerDigits: 3
		});

		$context.find('input[data-mask="numeric-integer-nomin"]').inputmask('integer', {
			allowPlus:     false,
			allowMinus:    false,
			integerDigits: 3
		});

		$context.find('input[data-mask="numeric-decimal"]').inputmask('decimal', {
			allowPlus:     false,
			allowMinus:    false,
			min:           1,
			integerDigits: 5,
			digits:        2
		});

		// Phone
		$context.find('input[type="tel"]').inputmask('(999) 999-9999');
		$context.find('input[type="tel"][data-mask="ext"]').inputmask('(999) 999-9999 [ext: 99999]');

		// Postal code
		$context.find('input[data-mask="postalcode"]').inputmask('A9A 9A9');

		// Date
		if (!Modernizr.inputtypes.date) {
			$context.find('input[type="date"]').inputmask('yyyy-mm-dd', { placeholder: app.env.lang === 'fr' ? 'aaaa-mm-jj' : 'yyyy-mm-dd' });
		}

		// Time
		$('input[data-mask="time"]').inputmask('hh:mm:ss');

		// Credit card
		$('input[data-mask="credit-card"]').inputmask('9{10}');
		$('input[data-mask="credit-card-cvv"]').inputmask('9{4}');

		/**/
	};


	//-- Numeric keyboard
	const bindNumericKeyboard = (/* $context = __.$body */) => {

		/**
		$context.find(`
			input[data-mask="numeric-integer"],
			input[data-mask="numeric-integer-nomin"],
			input[data-mask="credit-card"],
			input[data-mask="credit-card-cvv"]
		`)
			.attr('pattern', '\\d*')
		;
		/**/
	};


	//-- Form events
	const rebindFormEvent = ($context) => {
		bindInputMask($context);
		bindNumericKeyboard($context);

		pinki.message.publish(`${PROJECT}.form.rebindFormEvent`);
	};




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

		rebindFormEvent();

		/**
		// Bind on text field change
		$('input:text').on('input paste cut keyup', () => {});
		/**/

	};


	//-- Subscribe to topics
	local.subscribe = () => {

		/**
		pinki.message.subscribe('sample', (message, data) => {
			rebindFormEvent(data.$context);
		});
		/**/

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
	pinki.vow.when(DOM_PARSED).then(() => {
		local.cacheDOM();
		local.bind();
		local.start();
	});

	// Document loaded
	pinki.vow.when(DOCUMENT_LOADED).then(() => {
		local.delayedStart();
	});

})();
