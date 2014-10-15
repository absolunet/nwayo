(function(global, undefined) { var kafe = global.kafe, $ = kafe.dependencies.jQuery; kafe.bonify({name:'ext.disqus', version:'0.1', obj:(function(){

	var
		_params = {
			shortname: '',
			language: ''
		},

		_interval = null,
		_callback = null,

		_isDisqusLoaded = function() {
			if ($('#dsq-content #dsq-reply').length) {
				global.clearInterval(disqus.interval);
				disqus.loaded = true;
				disqus.callback();
			}
		}
	;

	global.disqus_title      = null;
	global.disqus_shortname  = null;
	global.disqus_url        = null;
	global.disqus_identifier = null;


	/**
	* ### Version 0.1
	* Extra methods for the Disqus API.
	*
	* @module kafe.ext
	* @class kafe.ext.disqus
	*/
	var disqus = {};


	/**
	* Init Disqus async.
	*
	* @method init
	* @param {Object} options Options.
	*	@param {String} options.title TODO
	*	@param {String} options.shortname TODO
	*	@param {String} options.url TODO
	*	@param {String} options.identifier TODO
	*	@param {String} options.language TODO
	*	@param {Function} [options.callback] TODO
	*/
	disqus.init = function (options) {
		var p = $.extend({}, _params, options);

		global.disqus_title = p.title;
		global.disqus_shortname = p.shortname;
		global.disqus_url = p.url;
		global.disqus_identifier = p.identifier;

		global.disqus_config = function () {
			this.language = p.language;
		};

		var dsq = document.createElement('script');
		dsq.type = 'text/javascript';
		dsq.async = true;

		dsq.src = '//' + p.shortname + '.disqus.com/embed.js';
		(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);

		if (p.callback && typeof (p.callback) == 'function') {
			if ($('#dsq-content #dsq-reply').length === 0) {
				_callback = p.callback;
				_interval = global.setInterval(_isDisqusLoaded, 200);
			} else {
				p.callback();
			}
		}
	};


	/**
	* Reset Disqus.
	*
	* @method reset
	* @param {String} pageId TODO
	* @param {String} url TODO
	*/
	disqus.reset = function (pageId, url) {
		DISQUS.reset({
			reload: true,
			config: function () {
				this.page.identifier = pageId;
				this.page.url = url;
			}
		});
	};


	return disqus;

})()}); })(typeof window !== 'undefined' ? window : this);