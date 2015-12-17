//-------------------------------------
//-- Site
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

		// Optional scroll
		//app.scrollTransition = (Modernizr.touchevents) ? 0 : konstan.transition.animation;


		// Addthis
		//global['addthis_config'] = { 'ui_language': app.env.lang };


		// Env
		//app.env.isUniquePage = (app.env.pageId == 'UID');
		//app.env.isTypePage   = _.includes(app.env.pageTags, 'TYPE-ID');
		//app.env.isOneOfThese = !!_.intersection(app.env.pageTags, ['ID1', 'ID2']).length;


		// Colorbox default params
		/**
		kafe.ext.colorbox.setParams({
			close:      (app.env.lang == 'en') ? 'Close' : 'Fermer',
			opacity:     0.7,
			transition: 'elastic'
			// if popup is hash triggered
			// onClosed: function () { window.location = '#/'; }
		});
		/**/


		// Magento jsrender helper
		/**
		$.views.helpers({
			translate: function(key) {
				return global.Translator.translate(key);
			}
		});
		/**/

	};


	//-- Bind events
	local.bind = function() {

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


	//-- Subscribe to topics
	local.subscribe = function() {

		// PubSub.subscribe('foo.bar',  function() {});
		// PubSub.subscribe('foo.bar2', function() {});

	};


	//-- To execute on start
	local.start = function() {

		// Webfont loader
		/**
		global.WebFont.load({
			custom:       { families: ['FontName1','FontName2','FontName3'] },
			loading:      function() { __.$body.trigger('WebFont:loading'); },
			active:       function() { __.$body.trigger('WebFont:active'); },
			inactive:     function() { __.$body.trigger('WebFont:inactive'); },
			fontloading:  function(familyName, fvd) { __.$body.trigger('WebFont:loading_font'); },
			fontactive:   function(familyName, fvd) { __.$body.trigger('WebFont:active_font'); },
			fontinactive: function(familyName, fvd) { __.$body.trigger('WebFont:inactive_font'); }
		});


		// Fonts loaded
		__.$body.on('WebFont:active', function() {

		});
		/**/

	};


	$(function() {
		local.cache();
		local.bind();
		local.subscribe();
		local.start();
	});

})();
