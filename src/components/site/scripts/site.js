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

		// env
		//app.env.isUniquePage = (app.env.page == 'UID');
		//app.env.isTypePage   = _.contains(app.env.tmpl, 'TYPE-ID');
		//app.env.isOneOfThese = !!_.intersection(app.env.tmpl, ['ID1', 'ID2']).length;


		// dom
		//app.dom.header     = $('.header');
		//app.dom.content    = $('.content');
		//app.dom.lateralCol = $('.lateral-col') || undefined;
		//app.dom.footer     = $('.footer');


		// colorbox default params
		/**
		kafe.ext.colorbox.setParams({
			close:      (app.env.lang == 'en') ? 'Close' : 'Fermer',
			opacity:     0.7,
			transition: 'elastic'
			// if popup is hash triggered
			// onClosed: function () { window.location = '#/'; }
		});
		/**/
	};


	//-- Bind events
	local.bind = function() {

		app.dom.body

			// external links
			.on('click', 'a[data-external]', function() {
				$(this).attr('target', '_blank');
			})

			// anchors
			/**
			.on('click', 'a[data-anchor="true"]', function(e) {
				e.preventDefault();
				$.scrollTo($(this).attr('href'), (Modernizr.touch) ? 0 : 500, {offset:{top:-15}});
			})
			/**/
		;
	};


	//-- To execute on start
	local.start = function() {

		// foundation
		// app.dom.document.foundation();
		// $Global(document).foundation();


		// web font loader
		/**
		global.WebFont.load({
			custom:       { families: ['FontName1','FontName2','FontName3'] },
			loading:      function() { app.dom.body.trigger('WebFont:loading'); },
			active:       function() { app.dom.body.trigger('WebFont:active'); },
			inactive:     function() { app.dom.body.trigger('WebFont:inactive'); },
			fontloading:  function(familyName, fvd) { app.dom.body.trigger('WebFont:loading_font'); },
			fontactive:   function(familyName, fvd) { app.dom.body.trigger('WebFont:active_font'); },
			fontinactive: function(familyName, fvd) { app.dom.body.trigger('WebFont:inactive_font'); }
		});


		// fonts loaded
		app.dom.body.on('WebFont:active', function() {

		});
		/**/

	};


	$(function() {
		local.cache();
		local.bind();
		local.start();
	});

})();
