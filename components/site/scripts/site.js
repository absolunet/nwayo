//-------------------------------------
//-- Site
//-------------------------------------

//= **require     bower_components/foo/bar
//= **require     components/common/scripts/foobar
//= **jshtml      components/common/templates/foobar
//= **jshtml_tree components/common/templates

(() => {
	'use strict';

	let local = {};


	//-- Cache data instantly
	local.cache = () => {

		// Optional scroll
		//app.scrollTransition = Modernizr.touchevents ? 0 : konstan.transition.animation;


		// Addthis
		//global['addthis_config'] = { 'ui_language': app.env.lang };


		// Env
		//app.env.isUniquePage = app.env.pageId === 'UID';
		//app.env.isTypePage   = _.includes(app.env.pageTags, 'TYPE-ID');
		//app.env.isOneOfThese = !!_.intersection(app.env.pageTags, ['ID1', 'ID2']).length;


		// Colorbox default params
		/**
		kafe.ext.colorbox.setParams({
			close:      app.env.lang === 'en' ? 'Close' : 'Fermer',
			opacity:     0.7,
			transition: 'elastic'
			//if popup is hash triggered
			onClosed: () => { __.window.location = '#/'; }
		});
		/**/


		// Magento jsrender helper
		/**
		$.views.helpers({
			translate: key => { return global.Translator.translate(key); }
		});
		/**/

	};


	//-- Cache data once DOM is loaded
	local.cacheDOM = () => {

		//

	};


	//-- Bind events once DOM is loaded
	local.bind = () => {

		__.$body

			// External links
			.on('click', 'a[data-external]', function() {
				$(this).attr('target', '_blank');
			})


			// Open links in top window
			/**
			.on('click', __.action('open-top'), function() {
				$(this).attr('target', '_top');
			})
			/**/


			// Anchors
			/**
			.on('click', 'a[data-anchor="true"]', function(e) {
				e.preventDefault();
				$.scrollTo($(this).attr('href'), app.scrollTransition, {offset:{top:-15}});
			})
			/**/


			// Simple toggler
			/**
			.on('click', __.component('toggle-wrapper')+' '+__.action('toggle-content'), function() {
				$(this).closest(__.component('toggle-wrapper')).toggleClass('opened');
			})
			/**/
		;
	};


	//-- Subscribe to topics once DOM is loaded
	local.subscribe = () => {

		// PubSub.subscribe('foo.bar',  () => {});
		// PubSub.subscribe('foo.bar2', () => {});

	};


	//-- Execute once DOM is loaded
	local.start = () => {

		__.$document.foundation();

		// Webfont loader
		/**
		global.WebFont.load({
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

		//

	};






	// Outline
	local.cache();

	$(() => {
		local.cacheDOM();
		local.bind();
		local.subscribe();
		local.start();
	});

	__.$window.on('load', () => {
		local.delayedStart();
	});

})();
