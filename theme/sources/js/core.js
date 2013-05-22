/*------------------------------------------------------------------------------------//
// Client : MySite
//------------------------------------------------------------------------------------*/

//>>excludeStart('excludeRequire', pragmas.excludeRequire);
require([
	'libs/kafe/kafe'
]);
//>>excludeEnd('excludeRequire');

window.MySite = (function(kafe,undefined){

	var
		//$Drupal   = window.jQuery,
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

		App.env.isHome          = (App.env.page == 'page-homepage');
		App.env.isSousclientele = _.contains(App.env.tmpl, 'node-type-sous-clientele');


		// dom
		App.dom = {};
		App.dom.window     = $(window);
		App.dom.document   = $(document);
		App.dom.body       = $('body');
		App.dom.header     = $('#Header');
		App.dom.content    = $('#Content');
		App.dom.lateralCol = $('#LateralCol') || undefined;
		App.dom.footer     = $('#Footer');

		/* preload jquery templates
		$('script[type="text/x-jquery-tmpl"]').each(function () {
			var $this = $(this);
			$this.template($this.attr('id').substring(5));
		});
		/**/
	};


	/*- Bind events -------------------------------------------------------------------*/
	Local.Bind = function() {

		// external links
		App.dom.body.on('click', 'a[data-external="true"]', function() {
			$(this).attr('target', '_blank');
		});

		/* input mask
		$('input[data-mask]').each(function() {
			var 
				$this = $(this),
				mask  = $this.data('mask')
			;
			switch (mask) {
				case 'phone':
					$this.inputmask('(999) 999-9999 [ext: 99999]');
				break;

				case 'numeric':
					$this.inputmask('non-negative-decimal', {radixPoint:',', digits:2 });
				break;
				
				case 'numeric-integer':
					$this.inputmask('9', {repeat:6, greedy:false });
				break;
				
				default:
					$this.inputmask(mask);
				break;
			}
		});
		/**/

		/* tabs
		$('div[data-structure="tabs"] > section > h1').on('click', function() {
			$(this).parent()
				.siblings('section.On').removeClass('On').end()
				.addClass('On')
			;
		}).first().trigger('click');
		/**/


		/* hashchange
		$window.on('hashchange', function (e) {
			var params = kUrl.parseHashPath();

			// if popup
			if (params.length == 1 && $('#tmpl-' + params[0]).length) {
				kColorbox.tmpl(params[0]);
			} else {
				// do your stuff
			}
		}).trigger('hashchange');
		/**/
	};


	/*- To execute on start -------------------------------------------------------------------*/
	Local.Start = function() {

		/* web font loader
		WebFont.load({
			custom:       { families: ['FontName1','FontName2','FontName3'] },
			loading:      function() { App.dom.body.trigger('WebFont:loading'); },
			active:       function() { App.dom.body.trigger('WebFont:active'); },
			inactive:     function() { App.dom.body.trigger('WebFont:inactive'); },
			fontloading:  function(familyName, fvd) { App.dom.body.trigger('WebFont:loading_font'); },
			fontactive:   function(familyName, fvd) { App.dom.body.trigger('WebFont:active_font'); },
			fontinactive: function(familyName, fvd) { App.dom.body.trigger('WebFont:inactive_font'); }
		});
		/**/

		/* addthis
		window.addthis_config = { ui_language: lang };
		window.addthis.init();
		/**/

		/* colorbox default params
		kafe.ext.colorbox.setParams({
			close:      (App.env.lang == 'en') ? 'Close' : 'Fermer',
			opacity:     0.7,
			transition: 'elastic',
			// if popup is hash triggered
			// onClosed: function () { window.location = '#/'; }
		});
		/**/

	};


	$(function() {
		Local.Cache();
		Local.Bind();
		Local.Start();
	});



	App.Utils = {};

	return App;

})(window.kafe);