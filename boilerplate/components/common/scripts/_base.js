//-------------------------------------
//-- Common - Base
//-------------------------------------

//= **require bower_components/kafe/dist/kafe
//= **require bower_components/nwayo-toolbox/toolbox/scripts/wrapper/jsrender
//= **require bower_components/nwayo-toolbox/toolbox/scripts/helpers/lazyload

(() => {
	'use strict';

	class CommonBaseRegistrable extends app.js.Registrable {


		//-- Cache data instantly
		cache() {

			/**
			// JSRender
			$.views.helpers({
				konstan:   (key) => { return _.get(konstan, key); },
				translate: (key) => { return app.translation[key]; }
			});
			/**/

			/**
			// Lazyload
			toolbox.lazyload.register({
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
					preprocess: ($this) => {
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
								.then(() => {
									$hover.addClass('hover');
								})
							;
						}
					}
				}
			});
			/**/


			// Optional scroll
			app.scrollTransition = Modernizr.touchevents ? 0 : konstan.transition.animation;

		}


		//-- Cache data once DOM is loaded
		cacheDOM() {

			/**
			// Translation
			app.translation = {};
			$('[data-translation]').each(function() {
				$.extend(app.translation, $(this).data('translation'));
			});
			/**/


			/**
			// tmpl
			$('script[type="text/x-jsrender"][id^="jshtml-"]').each(function() {
				const id = $(this).attr('id');
				app.tmpl[`html${_.upperFirst(_.camelCase(id.substring(7)))}`] = $.templates(`#${id}`);
			});
			/**/

		}


		//-- Bind events once DOM is loaded
		bind() {

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
					$.scrollTo($(this).attr('href'), app.scrollTransition, { offset:{ top:-15 } });
				})
				/**/


				/**
				// Simple toggler
				.on('click', `${__.component('toggle-wrapper')} ${__.action('toggle-content')}`, function() {
					$(this).closest(__.component('toggle-wrapper')).toggleClass('opened');
				})
				/**/
			;

		}


		//-- Subscribe to topics
		subscribe() {

			// pinki.message.subscribe('foo.bar', () => {});

		}


		//-- Execute once DOM is loaded
		start() {

			__.$document.foundation();

			/**
			// When global jQuery is ready
			pinki.vow.when(GLOBAL_JQUERY_LOADED).then(([$Global]) => {
				$Global().on('click');
			});
			/**/

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


		}


		//-- Execute once page is loaded
		delayedStart() {

			__.$body.addClass('document-loaded');

		}

	}

	app.js.registrar.register(CommonBaseRegistrable);

})();
