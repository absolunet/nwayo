//= require 'bower_components/jquery-json/src/jquery.json'

(function(global, undefined) { var kafe = global.kafe, $ = kafe.dependencies.jQuery; kafe.bonify({name:'string', version:'1.2.0', obj:(function(){

	/**
	* ### Version 1.2.0
	* Additionnal methods for string manipulation and generation.
	*
	* @module kafe
	* @class kafe.string
	*/
	var string = {};

	/**
	* Removes accented charaters from a string.
	*
	* @method removeAccent
	* @param {String} string
	* @return {String} The unaccented string.
	* @example
	*	kafe.string.removeAccent('Kafe signifie café en créole.');
	*	// returns "Kafe signifie cafe en creole."
	*/
	string.removeAccent = function() {
		return arguments[0]
			.replace(/[àáâãäå]/g, 'a') .replace(/[ÀÁÂÃÄÅ]/g, 'A')
			.replace(/æ/g, 'ae')       .replace(/Æ/g, 'AE')
			.replace(/ç/g, 'c')        .replace(/Ç/g, 'C')
			.replace(/[èéêë]/g, 'e')   .replace(/[ÈÉÊË]/g, 'E')
			.replace(/[ìíîï]/g, 'i')   .replace(/[ÌÍÎÏ]/g, 'I')
			.replace(/ñ/g, 'n')        .replace(/Ñ/g, 'N')
			.replace(/[òóôõö]/g, 'o')  .replace(/[ÒÓÔÕÖ]/g, 'O')
			.replace(/œ/g, 'oe')       .replace(/Œ/g, 'OE')
			.replace(/[ùúûü]/g, 'u')   .replace(/[ÙÚÛÜ]/g, 'U')
			.replace(/[ýÿ]/g, 'y')     .replace(/[ÝŸ]/g, 'Y')
		;
	};


	/**
	* Transforms a JSON string into a javascript object.
	*
	* @method toObject
	* @param {String} string A JSON string.
	* @return {Object} A valid javascript object.
	* @example
	*	kafe.string.toObject('{"UserId":"456","Items":["first", "second", "last"],"State":true,"TotalAmount":52,"Taxes":[]}');
	*	// returns Object {UserId: "456", Items: Array[3], State: true, TotalAmount: 52, Taxes: Array[0]}
	*/
	string.toObject = function(s) {

		var cast = function(o) {
			for (var i in o) {
				// object
				if (typeof(o[i]) == 'object') {
					o[i] = cast(o[i]);

				// date
				} else if (/^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(o[i])) {
					o[i] = new Date(o[i]);
				}
			}
			return o;
		};

		return cast($.evalJSON(s));
	};


	/**
	* Generates a .NET random GUID/UUID. (Version 4, random)
	*
	* @method generateGuid
	* @return {String} A random valid GUID/UUID.
	* @example
	*	kafe.string.generateGuid();
	*	// returns "c573f4f3-982a-4046-818a-083757f98804"
	*/
	string.generateGuid = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	};


	return string;

})()}); })(typeof window !== 'undefined' ? window : this);