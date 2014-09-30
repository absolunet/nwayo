(function(global, undefined) {
var nwayo = {
	version: '/* @echo version */',
	vendor: {
		jQuery:        global.jQuery.noConflict(true),
		jQuery_Global: global.jQuery,
		Modernizr:     global.Modernizr,
		LoDash:        global._
	}
};
global.nwayo = nwayo;

var jQuery    = nwayo.vendor.jQuery;
var $         = nwayo.vendor.jQuery;
var $Global   = global.jQuery;
var Modernizr = nwayo.vendor.Modernizr;
var _         = nwayo.vendor._;
var App       = global.POUEL;


﻿/*------------------------------------------------------------------------------------//
// CORE
//------------------------------------------------------------------------------------*//*                                                    
                +-`-:::::::::::::::::/::::::.          
          `::::/:-`                       `.:///      
          o.                                   /:     
        `o`                                     /-    
      -:/.                                       .:/- 
     :/    ``...-------:///+yyysyyssso++++++/:----.-s`
    /mhhddsoo+++++///::---..`````````````....-:+dmdhho
    .-::om`                                     d+.`` 
        .d`                                    `m-    
         -h`                                   y+     
          so `````......---://///////////::--./m      
          ydoooooooooooo+///-------:::://///+ohN`     
          hy.``                               /N      
           m`                                 +d      
           `m                                .N-      
            :`                               sy       
             d-                             :m`       
             m+                             +m        
             `h/                           .N-        
              :d.                          hs         
               m+                         .d:         
               -sdoossso+++-//+++oossooohy:.          
                `d-````.--:/::--..```` `y/            
                 d/                    `d:            
                 -d`                   /y             
                 `d-                  +h              
                  `y:                 os               
                   +h                h/               
                    so               os                
                    `+ssooossosososs/:.                 
*/

/**
* ### Version 2.1.1
* Mixing javascript crops for a perfect flavour.
* /kæfˈeɪ/ (haitian creole) A beverage made by infusing the beans of the coffee plant in hot water.
* http://absolunet.github.io/kafe
*
* @module kafe
* @main kafe
*/
(function(global, $, undefined) {

	var
		// check if module imported
		_exists = function(name) {
			try {
				return eval("("+name+" != undefined)");
			} catch(e) {
				return false;
			}
		},

		// delete var (try/catch for ie8)
		_delete = function(name) {
			try {
				eval("delete "+name+";");
			} catch(e) {
				eval(name+" = undefined;");
			}
		},

		// ie version
		_ie = (function(){
			var
				v = 3,
				div = document.createElement('div'),
				all = div.getElementsByTagName('i')
			;
			while ((
				div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
				all[0]
			));

			return v > 4 ? v : undefined;
		})(),

		// jquery methods
		_jQueryMethods = {},


		/**
		* ### Version 2.1.1
		* kafe core
		*
		* @module kafe
		* @class kafe
		*/
		core = {

			/**
			* kafe version
			*
			* @property _vesyon 
			* @type String
			**/
			_vesyon: '2.1.1',

			/**
			* kafe author
			*
			* @property _griyaj 
			* @type String
			**/
			_griyaj: 'absolunet.com',

			/**
			* Versions of dependencies / kafe modules
			*
			* @property _chaje 
			* @type Object
			**/
			_chaje: {
				'dependencies.jQuery':    $().jquery,
				'dependencies.LoDash':    _.VERSION,
				'dependencies.Modernizr': Modernizr._version
			},

			// isolate core dependencies
			dependencies: {
			
				/**
				* local jQuery copy 
				* ref: [http://jquery.com/](http://jquery.com/)
				*
				* @property dependencies.jQuery 
				* @type Object
				**/
				jQuery: $

			},

			cms:    {},
			ext:    {},
			plugin: {}
		}
	;

	// add flags for ie9 and less
	if (_ie && _ie < 10) {
		var classes = ['is-ie'+_ie];

		for (var i=6; i<10; ++i) {
			if (_ie < i) { classes.push('lt-ie'+_ie); }
			if (_ie > i) { classes.push('gt-ie'+_ie); }
		}

		$(function() { $('html').addClass(classes.join(' ')); });
	}


	// miscellaneous core functions
	core.fn = {

		/**
		* Create a instantiable object  
		* By John Resig (MIT Licensed)  
		* ref: [http://ejohn.org/blog/simple-class-instantiation/](http://ejohn.org/blog/simple-class-instantiation/)
		*
		* @method fn.createInstantiableObject
		* @return {Object} The instantiable object
		*/
		createInstantiableObject: function() {
			return function(args){
				if (this instanceof arguments.callee) {
					if (typeof this.__constructor == 'function') {
						this.__ = {};
						this.__constructor.apply(this, (args.callee) ? args : arguments);
					}
				} else {
					return new arguments.callee(arguments);
				}
			};
		},


		/**
		* Return the language if available or else 'en'
		*
		* @method fn.lang
		* @param {Object} dict The dictionary to check against
		* @param {String} lang The language to check
		* @return {String} The available language
		*/
		lang: function(dict, lang) {
			lang = (!!lang) ? lang : core.env('lang');
			return (!!dict[lang]) ? lang : 'en';
		},


		/**
		* Delete the variable (patch for ie8)
		*
		* @method fn.deleteVar
		* @param {String} name Name of the variable to delete
		*/
		deleteVar: function(name) {
			_delete(name);
		},


		/**
		* Add method as jQuery plugin
		*
		* @method fn.plugIntojQuery
		* @param {String} name The jQuery plugin name
		* @param {Object[Function]} methods Action:Method hash
		*/
		plugIntojQuery: function(name, methods) {
			var id = 'kafe'+name;
			name = name || 'CORE';

			if ($.fn[id] === undefined) {
				_jQueryMethods[name] = {};

				$.fn[id] = function() {
					var args = $.makeArray(arguments);
					return this.each(function() {
						_jQueryMethods[name][args.shift()]( this, args );
					});
				};
			}

			$.extend(_jQueryMethods[name], methods);
		}
	};



	/**
	* Environment constants
	*
	* @method env
	* @param {String} name The constant to get/set
	* @param {String} [value] The value to set
	* @return {String} The value of the environment constant
	*/
	core.env = (function(){

		// base vals
		var _data = {
			culture: '',
			lang:    '',
			page:    '',
			tmpl:    '',
			ie:      _ie
		};

		// grab kafe env
		_data.culture = document.documentElement.id.toLowerCase()   || '';
		_data.lang    = document.documentElement.lang.toLowerCase() || '';
		_data.page    = document.documentElement.getAttribute('data-kafe-page') || '';
		_data.tmpl    = document.documentElement.getAttribute('data-kafe-tmpl') || '';
		_data.tmpl    = _data.tmpl.split(' ');

		// public method
		return function(name, value) {
			var updatable = '';

			if (value !== undefined) {

				// if not already set 
				if (!(_data[name] !== undefined && updatable.search(new RegExp(':'+name+':')) == -1)) {
					_data[name] = value;

				// throw error
				} else {
					throw core.error(new Error("kafe.env > property '"+name+"' already defined"));
				}
			}

			return _data[name];
		};
	})();


	/**
	* Add module to core
	*
	* @method bonify
	* @param {Object} options The options
	*	@param {String} options.name The module name
	*	@param {String} options.version The module version
	*	@param {Object} options.obj The module itself
	*/
	core.bonify = function(options) {

		// if not already extended
		if (!_exists('core.'+options.name)) {

			core._chaje[options.name] = options.version;
			eval('this.'+options.name+' = arguments[0].obj;');

		// throw error
		} else {
			throw core.error('kafe.'+options.name+' already exists');
		}
	};


	/**
	* Throw kafe errors
	*
	* @method error
	* @param {Error} error The error with description
	* @return {Error} error The error
	* @example
	*	kafe.error(new Error('barf'));
	*/
	core.error = function(e) {
		var msg = ((!!e.description) ? e.description : e.message);
		e.description = e.message = '<kafe:erè> : '+ ((!!msg) ? msg : 'anonim');
		return (_ie && _ie == 8) ? new Error(e) : e;
	};


	global.kafe = core;

})(typeof window !== 'undefined' ? window : this, jQuery);





// Avoid `console` errors in browsers that lack a console.
// (c) HTML5 Boilerplate
(function() {
	var method;
	var noop = function () {};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());


//= **require '.nwayo-cache/templateclient.js'

(function(){
	'use strict';
	
	var Local = {};


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
		App.dom.window     = $(global);
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
	Local.Start = function() {

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

})();

/*------------------------------------------------------------------------------------//
// UTILS
//------------------------------------------------------------------------------------*/

// **@import ''

(function(){
	'use strict';

	App.Utils = {};

	/*- Do something -------------------------------------------------------------------*/
	App.Utils.Something = function() {

	};


})();

﻿/*------------------------------------------------------------------------------------//
// VARIANTS
//------------------------------------------------------------------------------------*/

// **@import ''

(function(){
	'use strict';

	var Local = {};

	Local.dssd = '';

	/*- Home -------------------------------------------------------------------*/
	/**
	Local.InitHome = function() {
		if (App.env.isHome) {

		}
	};
	/**/

	/*- Lateral Column -------------------------------------------------------------------*/
	/**
	Local.InitLateralcolumn = function() {
		if (App.dom.lateralCol) {

		}
	};
	/**/


	$(function() {
		//Local.InitHome();
		//Local.InitLateralcolumn();
	});

})();


	
/* global window */
})(typeof window !== 'undefined' ? window : this);
