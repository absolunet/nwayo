//-------------------------------------
//-- Main
//-------------------------------------

//= require 'components/vendor-misc/scripts/jsrender'
//= jshtml 'components/common/templates/*'
//= jshtml 'components/common/templates/patate'
//= jshtml 'components/common/templates/pouel'

(function(){
	'use strict';

	var local = {};


	/*- Cache data -------------------------------------------------------------------*/
	local.cache = function() {

		// env
		app.env = {};

		app.env.culture = kafe.env('culture');
		app.env.lang    = kafe.env('lang');
		app.env.page    = kafe.env('page');
		app.env.tmpl    = kafe.env('tmpl');

		//app.env.isUniquePage = (app.env.page == 'UID');
		//app.env.isTypePage   = _.contains(app.env.tmpl, 'TYPE-ID');
		//app.env.isOneOfThese = !!_.intersection(app.env.tmpl, ['ID1', 'ID2']).length;


		// dom
		app.dom = {};
		app.dom.window     = $(global);
		app.dom.document   = $(document);
		app.dom.body       = $('body');
		//app.dom.header     = $('.header');
		//app.dom.content    = $('.content');
		//app.dom.lateralCol = $('.lateral-col') || undefined;
		//app.dom.footer     = $('.footer');


		// path
		app.path = {};

		app.path.root  = '/nwayo/';
		app.path.builds = app.path.root+'builds/';
		app.path.images = app.path.builds+'images/';
		app.path.stubs  = app.path.root+'stubs/';


		// tmpl
		/**
		app.tmpl = window.nwayo_jshtml;
		kafe.fn.deleteVar('window.nwayo_jshtml');

		$('script[type="text/x-jsrender"]').each(function () {
			var id = $(this).attr('id');
			app.tmpl[id.substring(7)] = $.templates('#'+id);
		});
		/**/


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


	/*- Bind events -------------------------------------------------------------------*/
	local.bind = function() {

		app.dom.body

			// external links
			.on('click', 'a[data-external="true"]', function() {
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


		// input mask
		/**
		$('input[data-mask]').each(function() {
			var
				$this = $(this),
				mask  = $this.data('mask')
			;

			switch (mask) {
				case 'phone':       $this.inputmask('(999) 999-9999'); break;
				case 'phone-ext':   $this.inputmask('(999) 999-9999 [ext: 99999]'); break;
				case 'date':        $this.inputmask('yyyy-mm-dd'); break;
				case 'time':        $this.inputmask('hh:mm:ss'); break;
				case 'postalcode':  $this.inputmask('A9A 9A9'); break;
				case 'numeric':     $this.inputmask('non-negative-decimal', {radixPoint:',', digits:2 }); break;
				case 'numeric-int': $this.inputmask('9', {repeat:6, greedy:false }); break;
				default:            $this.inputmask(mask); break;
			}
		});
		/**/
	};


	/*- To execute on start -------------------------------------------------------------------*/
	local.start = function() {

		// svg replacement
		if(!Modernizr.svg) {
			$('img[src*="svg"]').attr('src', function() {
				return $(this).attr('src').replace('.svg', '.png');
			});
		}

		// web font loader
		/**
		WebFont.load({
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


		// addthis
		/**
		window.addthis_config = { ui_language: app.env.lang };
		window.addthis.init();
		/**/

	};


	$(function() {
		local.cache();
		local.bind();
		local.start();
	});

})();
