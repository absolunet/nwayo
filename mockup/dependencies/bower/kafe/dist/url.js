(function(global, undefined) { var kafe = global.kafe, $ = kafe.dependencies.jQuery; kafe.bonify({name:'url', version:'1.0', obj:(function(){

	var
		// parse url
		_parseIt = function(str,type) {
			switch (type) {
				case 'params':
					var
						data  = {},
						pairs = str.toString().split('&')
					;
					for (var i in pairs) {
						var e = pairs[i].toString().split('=');
						data[e[0]] = decodeURI(e[1]);
					}
					return data;

				case 'path':
					return str.toString().split('/');
			}
		}
	;


	/**
	* ### Version 1.0
	* Manipulation tools for route-based urls.
	*
	* @module kafe
	* @class kafe.url
	*/
	var url = {};

	/**
	* Parses a querystring as a key/value list and creates a javascript object.
	*
	* @method parseSearchParams
	* @param {String} [querystring=CURRENT_LOCATION_SEARCH]
	* @return {Object} An object represention of the querystring.
	* @example
	*	kafe.url.parseSearchParams('?group=players&team=blue&ranking=3');
	*	// returns Object {group: "players", team: "blue", ranking: "3"}
	*/
	url.parseSearchParams = function(s) {
		s = (s) ? s : global.location.search;
		return _parseIt(s.toString().substring(1), 'params');
	};


	/**
	* Parses a querystring as a path and creates an ordered array.
	*
	* @method parseSearchPath
	* @param {String} [querystring=CURRENT_LOCATION_SEARCH]
	* @return {Array(String)} An array represention of the querystring path.
	* @example
	*	kafe.url.parseSearchPath('?/Players/Teams/Blue');
	*	// returns ["Players", "Teams", "Blue"]
	*/
	url.parseSearchPath = function(s) {
		s = (s) ? s : global.location.search;
		return (s.toString().substring(1,2) == '/') ? _parseIt(s.toString().substring(2), 'path') : [];
	};


	/**
	* Parses a hash string as a key/value list and creates a javascript object.
	*
	* @method parseHashParams
	* @param {String} [hash=CURRENT_LOCATION_HASH]
	* @return {Object} An object represention of the hash string.
	* @example
	*	kafe.url.parseHashParams('#color=blue&size=large&extras=false');
	*	// returns Object {color: "blue", size: "large", extras: "false"}
	*/
	url.parseHashParams = function(s) {
		s = (s) ? s : global.location.hash;
		return _parseIt(s.toString().substring(1), 'params');
	};


	/**
	* Parses a hash string as a path and creates an ordered array.
	*
	* @method parseHashPath
	* @param {String} [hash=CURRENT_LOCATION_HASH]
	* @return {Array(String)} An array represention of the hash path.
	* @example
	*	kafe.url.parseHashPath('#/clothing/man/shirts');
	*	// returns ["clothing", "man", "shirts"]
	*/
	url.parseHashPath = function(s) {
		s = (s) ? s : global.location.hash;
		return (s.toString().substring(1,2) == '/') ? _parseIt(s.toString().substring(2), 'path') : [];
	};


	/**
	* Parses a hashbang (#!) as a key/value list and creates a javascript object.
	*
	* @method parseAjaxParams
	* @param {String} [hashbang=CURRENT_LOCATION_HASH]
	* @return {Object} An object represention of the hashbang.
	* @example
	*	kafe.url.parseAjaxParams('#!color=blue&size=large&extras=false');
	*	// returns Object {color: "blue", size: "large", extras: "false"}
	*/
	url.parseAjaxParams = function(s) {
		s = (s) ? s : global.location.hash;
		return (s.toString().substring(1,2) == '!') ? _parseIt(s.toString().substring(2), 'params') : {};
	};


	/**
	* Parses a hashbang (#!) as a path and creates an ordered array.
	*
	* @method parseAjaxPath
	* @param {String} [hashbang=CURRENT_LOCATION_HASH]
	* @return {Array(String)} An array represention of the hashbang path.
	* @example
	*	kafe.url.parseAjaxPath('#!/clothing/man/shirts');
	*	// returns ["clothing", "man", "shirts"]
	*/
	url.parseAjaxPath = function(s) {
		s = (s) ? s : global.location.hash;
		return (s.toString().substring(1,3) == '!/') ? _parseIt(s.toString().substring(3), 'path') : [];
	};


	return url;

})()}); })(typeof window !== 'undefined' ? window : this);