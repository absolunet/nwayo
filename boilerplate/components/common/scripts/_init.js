//-------------------------------------
//-- Init
//-------------------------------------

//= **require     bower_components/foo/bar
//= **require     components/common/scripts/foobar
//= **jshtml      components/common/templates/foobar
//= **jshtml_tree components/common/templates

(() => {
	'use strict';

	const local = {};


	//-- Cache data instantly
	local.cache = () => {

		// tmpl
		/**
		$.views.helpers({
			konstan: (key) => { return _.get(konstan, key); },
			trans:   (key) => { return app.translation[key]; }
		});
		/**/

		app.lazyload.register({
			'image': {
				firstPass: ($this, options) => {
					$this.attr('src', options.url);
				}
			},

			'bg-image': {
				firstPass: ($this, options) => {
					$this.css('background-image', `url('${options.url}')`);
				}
			},

			'SAMPLE': {
				preprocess: ($this/* , options */) => {
					setTimeout(() => { $this.addClass('placeholder'); }, 1000);
				},
				firstPass: ($this, options) => {
					if (options.url) {
						$this.find(`${__.component('main-image')} > img`).attr('src', options.url);
					}
				},
				secondPass: ($this, options) => {
					if (options.hoverUrl && !Modernizr.touchevents) {
						const $hover = $this.find(__.component('main-image'));
						$hover.css('background-image', `url('${options.hoverUrl}')`);

						$hover.imagesLoaded({ background:true })
							.done(() => {
								$hover.addClass('hover');
							})
						;
					}
				}
			}
		});


		// Optional scroll
		app.scrollTransition = Modernizr.touchevents ? 0 : konstan.transition.animation;

	};


	//-- Cache data once DOM is loaded
	local.cacheDOM = () => {

		/**
		// translation
		app.translation = {};
		$('[data-translation]').each(function() {
			$.extend(app.translation, $(this).data('translation'));
		});
		/**/


		/** lodash: camelCase
		// tmpl
		$('script[type="text/x-jsrender"][id^="jshtml-"]').each(function() {
			const id = $(this).attr('id');
			app.tmpl[`html${_.upperFirst(_.camelCase(id.substring(7)))}`] = $.templates(`#${id}`);
		});
		/**/

	};


	//-- Bind events once DOM is loaded
	local.bind = () => {

		FastClick.attach(document.body);

		__.$body

			// External links
			.on('click', 'a[data-external]', function() {
				$(this).attr('target', '_blank');
			})


			/**
			// Open links in top window
			.on('click', __.action('open-top'), function() {
				$(this).attr('target', '_top');
			})
			/**/


			/**
			// Anchors
			.on('click', 'a[data-anchor="true"]', function(e) {
				e.preventDefault();
				$.scrollTo($(this).attr('href'), app.scrollTransition, {offset:{top:-15}});
			})
			/**/


			/**
			// Simple toggler
			.on('click', `${__.component('toggle-wrapper')} ${__.action('toggle-content')}`, function() {
				$(this).closest(__.component('toggle-wrapper')).toggleClass('opened');
			})
			/**/
		;

	};


	//-- Subscribe to topics
	local.subscribe = () => {

		// When global jQuery is ready
		/**
		PubSub.subscribe('nwayo.jQueryGlobal.ready', (msg, $Global) => {
			$Global.on('click');
		});
		/**/

	};


	//-- Execute once DOM is loaded
	local.start = () => {

		__.$document.foundation();

		/**
		// Webfont loader
		WebFont.load({
			custom:       { families: ['FontName1','FontName2','FontName3'] },
			loading:      () => { __.$body.trigger('WebFont:loading'); },
			active:       () => { __.$body.trigger('WebFont:active'); },
			inactive:     () => { __.$body.trigger('WebFont:inactive'); },
			fontloading:  (familyName, fvd) => { __.$body.trigger('WebFont:loading_font'); },
			fontactive:   (familyName, fvd) => { __.$body.trigger('WebFont:active_font'); },
			fontinactive: (familyName, fvd) => { __.$body.trigger('WebFont:inactive_font'); }
		});


		// Fonts loaded
		__.$body.on('WebFont:active', () => {

		});
		/**/


	};


	//-- Execute once page is loaded
	local.delayedStart = () => {

		__.$body.addClass('document-loaded');

		/**
		// Equalizer
		kafe.ext.foundation.equalizer({
			wrapper: __.$component('element-list'),
			item:    __.$component('element-list-item'),
			rows:    {
				small:  2,
				medium: 3,
				large:  4
			}
		});
		/**/

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
