/*------------------------------------------------------------------------------------//
// Client : -
//------------------------------------------------------------------------------------*/

window.MYSITE = (function(K,undefined){
	
	var 
		$         = K.jQuery,
//		$Drupal   = jQuery,
		$window   = $(window),
		$document = $(document),
		kEnv      = K.env,
		kString   = K.string,
		culture   = kEnv('culture'),
		lang      = kEnv('lang'),
		page      = kEnv('page'),
		tmpl      = kEnv('tmpl'),

		/*
		kColorbox = K.ext.colorbox,
		kUrl      = K.url,
		/**/
		
		isHome         = tmpl.K().contains('front'),
		isContent      = tmpl.K().contains('page-node-4','page-node-22'),
		isFirstArticle = (page == 'article-12345'),
		
		$header, 
		$fixedNav, 
		$mainMenu, 
		$content, 
		$lateralCol, 
		$footer
	;

	function _localFunction() {
		// do something
	}
	
	
	// ------------------------------------------
	// PUBLIC
	// ------------------------------------------
	var M = {};
	
	M.publicVariable = 'hi mister';
	
	M.publicFunction = function() {
		// do something
	};
	


	// ------------------------------------------
	// INIT
	// ------------------------------------------
	$(function(){
	
		var $body = $('body');
		
		$header     = $('#Header');
		$fixedNav   = $header.children('nav.Fixed');
		$mainMenu   = $('#MainMenu');
		$content    = $('#Content');
		$lateralCol = $('#LateralCol');
		$footer     = $('#Footer');

		// external links
		$body.on('click', 'a[data-external="true"]', function() {
			$(this).attr('target', '_blank');
		});

		/* addthis
		window.addthis_config = { ui_language: lang };
		window.addthis.init();
		/**/
		
		/* preload jquery templates
		$('script[type="text/x-jquery-tmpl"]').each(function () {
			var $this = $(this);
			$this.template($this.attr('id').substring(5));
		});
		/**/

		/* colorbox default params
		kColorbox.setParams({
			close:      (lang == 'en') ? 'Close' : 'Fermer',
			opacity:     0.7,
			transition: 'elastic',
			// if popup is hash triggered
			// onClosed: function () { window.location = '#/'; }
		});
		/**/
		
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



		if (isHome) {
			// do something
		}
		
		if (isContent) {
			// do something
		}
	});
	
	
	
	return M;
})(kafe);