/*------------------------------------------------------------------------------------//
// CORE
//------------------------------------------------------------------------------------*/

//>>excludeStart('excludeRequire', pragmas.excludeRequire);
require([
	'libs/kafe/kafe',

	//'../.tmp-nwayo/templateclient.js'
]);
//>>excludeEnd('excludeRequire');

window.{{NAME}} = (function(kafe,undefined){
	kafe.fn.deleteVar('window._');
	kafe.fn.deleteVar('window.Modernizr');

	var
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.underscore,
		Modernizr = kafe.dependencies.Modernizr,
		
		App       = {},
		Local     = {}
	;


	/*- Cache data -------------------------------------------------------------------*/
	Local.Cache = function() {

		// env
		App.env = {};

		App.env.culture = kafe.env('culture');
		App.env.lang    = kafe.env('lang');
		App.env.page    = kafe.env('page');
		App.env.tmpl    = kafe.env('tmpl');

		//App.env.isUniquePage = (App.env.page == 'UID');
		//App.env.isTypePage   = _.contains(App.env.tmpl, 'TYPE-ID');
		//App.env.isOneOfThese = !!_.intersection(App.env.tmpl, ['ID1', 'ID2']).length;


		// dom
		App.dom = {};
		App.dom.window     = $(window);
		App.dom.document   = $(document);
		App.dom.body       = $('body');
		//App.dom.header     = $('#Header');
		//App.dom.content    = $('#Content');
		//App.dom.lateralCol = $('#LateralCol') || undefined;
		//App.dom.footer     = $('#Footer');


		// path
		App.path = {};

		App.path.root  = '/nwayo/';
		App.path.builds = App.path.root+'builds/';
		App.path.images = App.path.builds+'images/';
		App.path.stubs  = App.path.root+'stubs/';


		// tmpl
		/**
		App.tmpl = window.nwayo_jshtml;
		kafe.fn.deleteVar('window.nwayo_jshtml');

		$('script[type="text/x-jsrender"]').each(function () {
			var id = $(this).attr('id');
			App.tmpl[id.substring(7)] = $.templates('#'+id);
		});
		/**/


		// colorbox default params
		/**
		kafe.ext.colorbox.setParams({
			close:      (App.env.lang == 'en') ? 'Close' : 'Fermer',
			opacity:     0.7,
			transition: 'elastic'
			// if popup is hash triggered
			// onClosed: function () { window.location = '#/'; }
		});
		/**/
	};


	/*- Bind events -------------------------------------------------------------------*/
	Local.Bind = function() {

		App.dom.body

			// external links
			.on('click', 'a[data-external="true"]', function() {
				$(this).attr('target', '_blank');
			})

			// anchors
			/**
			.on('click', 'a[href^="#"][href!="#"]', function(e) {
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


		// hashchange
		/**
		$window.on('hashchange', function (e) {
			var params = kafe.url.parseHashPath();
		}).trigger('hashchange');
		/**/
	};


	/*- To execute on start -------------------------------------------------------------------*/
	Local.Start = function() {
		
		
		// web font loader
		/**
		WebFont.load({
			custom:       { families: ['FontName1','FontName2','FontName3'] },
			loading:      function() { App.dom.body.trigger('WebFont:loading'); },
			active:       function() { App.dom.body.trigger('WebFont:active'); },
			inactive:     function() { App.dom.body.trigger('WebFont:inactive'); },
			fontloading:  function(familyName, fvd) { App.dom.body.trigger('WebFont:loading_font'); },
			fontactive:   function(familyName, fvd) { App.dom.body.trigger('WebFont:active_font'); },
			fontinactive: function(familyName, fvd) { App.dom.body.trigger('WebFont:inactive_font'); }
		});

		// fonts loaded
		App.dom.body.on('WebFont:active', function() {

		});
		/**/


		// addthis
		/**
		window.addthis_config = { ui_language: App.env.lang };
		window.addthis.init();
		/**/

	};


	$(function() {
		Local.Cache();
		Local.Bind();
		Local.Start();
	});



	//App.Utils = {};

	return App;

})(window.kafe);