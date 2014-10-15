//= require 'dependencies/bower/jquery.bbq/jquery.ba-bbq'

(function(global, undefined) { var kafe = global.kafe, $ = kafe.dependencies.jQuery; kafe.bonify({name:'ext.bbq', version:'0.1', obj:(function(){

	var
		_params = {
			symbol: '#!',
			delimiter: '&'
		},

		_unHashbangUrl = function() {
			return (global.location.href).replace(new RegExp( _params.symbol ), '#');
		},
		_reHashbangUrl = function(url) {
			return url.replace( /#/, _params.symbol );
		}
	;


	/**
	* ### Version 0.1
	* Extra methods for the jQuery BBQ plugin.
	*
	* @module kafe.ext
	* @class kafe.ext.bbq
	*/
	var bbq = {};


	/**
	* Get the default params.
	*
	* @method getParams
	* @return {Object} The default bbq params.
	*/
	bbq.getParams = function() {
		return _params;
	};


	/**
	* Set the default params.
	*
	* @method setParams
	* @param {Object} options Bbq params.
	*/
	bbq.setParams = function() {
		_params = arguments[0];
	};


	/**
	* Get the hashbang url parameters.
	*
	* @method getHashbang
	* @return {String} The hashbang url parameters.
	*/
	bbq.getHashbang = function() {
		return $.param.fragment( _unHashbangUrl() );
	};


	/**
	* Get the hashbang url parameters.
	*
	* @method getHashbangParams
	* @return {Object} The hashbang url parameters.
	*/
	bbq.getHashbangParams = function() {
		return $.deparam.fragment( _unHashbangUrl(), true );
	};


	/**
	* Set hashbang url parameters.
	*
	* @method setHashbang
	* @param {Object|String} params Parameters to apply.
	* @param {Number} [mergemode] Bbq merge mode `0-2`.
	*/
	bbq.setHashbang = function(params, mergemode) {
		global.location = _reHashbangUrl( $.param.fragment( _unHashbangUrl(), params, mergemode ) );
	};


	return bbq;

})()}); })(typeof window !== 'undefined' ? window : this);