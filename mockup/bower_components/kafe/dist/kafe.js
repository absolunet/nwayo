/*!
 * kafe 3.0.1
 * http://absolunet.github.io/kafe
 *
 * Copyright 2011-2014 Absolunet, http://absolunet.com/
 * Released under the MIT license
 * https://github.com/absolunet/kafe/tree/master/LICENSE.md
 */

/**
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
		* ### Version 3.0.1
		* kafe core
		*
		* @module kafe
		* @class kafe
		*/
		core = {

			/**
			* kafe version
			*
			* @property VESYON 
			* @type String
			**/
			VESYON: '3.0.1',

			/**
			* kafe author
			*
			* @property PARAN 
			* @type String
			**/
			PARAN: 'absolunet.com',

			/**
			* Versions of dependencies / kafe modules
			*
			* @property chaje 
			* @type Object
			**/
			chaje: {
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

			core.chaje[options.name] = options.version;
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