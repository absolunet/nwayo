//-------------------------------------
//-- Lazyload
//-------------------------------------

//= require bower_components/nwayo-toolbox/toolbox/scripts/wrapper/imagesloaded

(() => {
	'use strict';

	const STATUS       = 'data-lazyload-status';
	const PREPROCESSED = 'preprocessed';
	const PROCESSING1  = 'processing-start';
	const PROCESSING2  = 'processing-end';
	const PROCESSED    = 'processed';


	const local = { types:{} };

	const getOptions = (obj) => {
		const $obj = $(obj);
		const options = $obj.data('lazyload-options');

		return [$obj, $obj.data('lazyload-options'), $obj.data('lazyload-type') || options.type];
	};




	//-- Bind events once DOM is loaded
	local.bind = () => {
		__.$window.on('changed.zf.mediaquery', () => {
			local.firstPass();
		});
	};


	//-- Preprocess lazyload
	local.preprocess = () => {
		__.$component('lazyload-image').filter(`:not([${STATUS}])`)
			.attr(STATUS, PREPROCESSED)
			.each(function() {
				const [$this, options, type] = getOptions(this);

				if (type) {
					const callback = local.types[type].preprocess;

					if (callback) {
						callback($this, options);
					}
				} else {
					$this.attr(STATUS, PROCESSED);
				}
			})
		;

		PubSub.publish(`${PROJECT}.common.lazyload.preprocess-completed`);
	};


	// First pass to queue images
	local.firstPass = () => {
		__.$component('lazyload-image').filter(`[${STATUS}="${PREPROCESSED}"]:visible`)
			.attr(STATUS, PROCESSING1)
			.each(function() {
				const [$this, options, type] = getOptions(this);
				const callback = local.types[type].firstPass;

				if (callback) {
					callback($this, options);
				}
			})
			.attr(STATUS, PROCESSING2)
		;

		$(`[${STATUS}="${PROCESSING2}"]`).imagesLoaded({ background:true }).always(local.secondPass);

		PubSub.publish(`${PROJECT}.common.lazyload.firstPass-completed`);
	};


	// Second pass once initial batch processed
	local.secondPass = () => {
		__.$component('lazyload-image').filter(`[${STATUS}="${PROCESSING2}"]:visible`)
			.attr(STATUS, PROCESSED)
			.each(function() {
				const [$this, options, type] = getOptions(this);
				const callback = local.types[type].secondPass;

				if (callback) {
					callback($this, options);
				}
			})
		;

		PubSub.publish(`${PROJECT}.common.lazyload.secondPass-completed`);
	};





	//-- Public class
	app.lazyload = class {

		// Register new types
		static register(types) {
			_.merge(local.types, types);
		}

		static repass() {
			local.firstPass();
		}

	};





	// Outline

	// DOM Ready
	$.when(DOM_PARSE).then(() => {
		local.bind();
		local.preprocess();
	});

	// Document loaded
	$.when(DOCUMENT_LOAD).then(() => {
		local.firstPass();
	});

})();
