(function(global, undefined) { var kafe = global.kafe, $ = kafe.dependencies.jQuery; kafe.bonify({name:'number', version:'1.0.0', obj:(function(){

	/**
	* ### Version 1.0.0
	* Additionnal manipulation methods for numbers.
	*
	* @module kafe
	* @class kafe.number 
	*/
	var number = {};

	/**
	* Converts a number to its roman numeral value.
	*
	* @method toRoman
	* @param {Number} number
	* @return {String} The roman numeral value.
	* @example
	*	kafe.number.toRoman(1954);
	*	// returns "MCMLIV"
	*/
	number.toRoman = function(n) {

		var
			// repeat string n times
			repeat = function (s,nb) {
				return new Array(Number(nb)+1).join(s);
			},

			data   = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},
			result = ''
		;

		// transform to int
		n = parseInt(n,10);

		// foreach numeral
		for (var i in data) {
			var matches = parseInt(n / data[i], 10);
			if (!!matches) {
				result += repeat(i, matches);
				n = n % data[i];
			}
		}
		return result;
	};

	/**
	* Gets the float precision of a given number.
	*
	* @method getPrecision
	* @param {Number} number
	* @return {Number} Amount of numbers after the radix point.
	* @example
	*	kafe.number.getPrecision(5.458);
	*	// returns 3
	* @example
	*	kafe.number.getPrecision(11);
	*	// returns 0
	*/
	number.getPrecision = function(n) {
		var _precision = (n + '').split('.')[1];
		return !!_precision ? _precision.length : 0;
	};

	/**
	* Modifies, if needed, a number to only allow a miximum float precision.
	*
	* @method trimPrecision
	* @param {Number} number
	* @param {Number} precision Maximum amount of numbers after the radix point.
	* @return {Number} The modified number
	* @example
	*	kafe.number.trimPrecision(5.458, 2);
	*	// returns 5.45
	* @example
	*	kafe.number.trimPrecision(5.458, 0);
	*	// returns 5
	* @example
	*	kafe.number.trimPrecision(5.458, 6);
	*	// returns 5.458
	*/
	number.trimPrecision = function(n, precision) {
		return Math.floor(n * Math.pow(10, precision)) / Math.pow(10, precision);
	};

	/**
	* Multiply two numbers while avoiding the javascript multiplication irregularities.
	*
	* @method product
	* @param {Number} number
	* @param {Number} factor The factor causing the javascript calculation irregularity.
	* @return {Number} Product of the equation.
	* @example
	*	3 * 5.3
	*	// returns 15.8999999
	* @example
	*	kafe.number.product(3, 5.3);
	*	// returns 15.9
	*/
	number.product = function(n, factor) {
		var _power = Math.pow(10, number.getPrecision(factor));
		return (n * (factor * _power)) / _power;
	};


	return number;

})()}); })(typeof window !== 'undefined' ? window : this);