//= require 'dependencies/bower/kafe/dist/string'

(function(global, undefined) { var kafe = global.kafe, $ = kafe.dependencies.jQuery; kafe.bonify({name:'string.validate', version:'1.0', obj:(function(){

	/**
	* ### Version 1.0
	* String validation tools.
	*
	* @module kafe
	* @class kafe.string.validate
	* @extensionfor kafe.string
	*/
	var validate = {};

	/**
	* Checks if a string is numeric.
	*
	* @method isNum
	* @param {String} string
	* @return {Boolean} If true, the string could be converted to a number.
	* @example
	*	kafe.string.validate.isNum('k4f3');
	*	// returns false
	* @example
	*	kafe.string.validate.isNum('43');
	*	// returns true
	*/
	validate.isNum = function(str) {
		return (str === Number(str).toString());
	};


	/**
	* Checks if a string is a valid email address.
	*
	* @method isEmail
	* @param {String} string
	* @return {Boolean} If true, the string is a valid email address.
	* @example
	*	kafe.string.validate.isEmail('mailbox@mailaddress');
	*	// returns false
	* @example
	*	kafe.string.validate.isEmail('kafe.feedback@absolunet.com');
	*	// returns true
	*/
	validate.isEmail = function(str) {
		str = str.replace(/^\s*|\s*$/g, '');
		str = str.replace(/^\t*|\t*$/g, '');
		return (/^\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(str));
	};


	/**
	* Checks if a string is a valid or part of a valid Canadian postal code.
	*
	* @method isPostalCode
	* @param {String} string
	* @param {String} [format] Validation pattern (Regular expression). Default pattern is *([a-z][0-9]){3}*. Can also be set to *A1A 1A1* for a single precise value or as *A1A* and *1A1* when divided into two values.
	* @return {Boolean} If true, the string matches the validation format.
	* @example
	*	kafe.string.validate.isPostalCode('KAF123');
	*	// returns false
	* @example
	*	kafe.string.validate.isPostalCode('K4F 3F3', 'A1A 1A1');
	*	// returns true
	*/
	validate.isPostalCode = function(str,format) {
		switch (format) {
			case 'A1A 1A1': format='[a-z][0-9][a-z] [0-9][a-z][0-9]'; break;
			case 'A1A':     format='[a-z][0-9][a-z]';                 break;
			case '1A1':     format='[0-9][a-z][0-9]';                 break;
			default:        format='([a-z][0-9]){3}';                 break;
		}
		return new RegExp('^'+format+'$','i').test(str);
	};


	/**
	* Checks if a string passes the Luhn algorithm.
	*
	* Source: [https://gist.github.com/2134376](https://gist.github.com/2134376)
	* Source: [http://jsperf.com/credit-card-validator/7](http://jsperf.com/credit-card-validator/7)
	*
	* @method isLuhnAlgorithm
	* @param {String} string
	* @return {Boolean} If true, the string passes the Luhn algorithm.
	* @example
	*	kafe.string.validate.isLuhn('79927398713');
	*	// returns true
	*/
	validate.isLuhnAlgorithm = function(str) {
		var
			len     = str.length,
			mul     = 0,
			prodArr = [[0,1,2,3,4,5,6,7,8,9],[0,2,4,6,8,1,3,5,7,9]],
			sum     = 0
		;

		while (len--) {
			sum += prodArr[mul][parseInt(str.charAt(len), 10)];
			mul ^= 1;
		}

		return sum % 10 === 0 && sum > 0;
	};


	/**
	* Checks if a string is a valid credit card number and fits a specific brand pattern.
	* 
	* Source: [http://www.regular-expressions.info/creditcard.html](http://www.regular-expressions.info/creditcard.html)
	*
	* @method isCreditCard
	* @param {String} string
	* @param {String} creditcard A credit card brand abbreviation. Possible values are **visa**, **mastercard**, **americanexpress**, **dinersclub**, **discover**, **jcb**.
	* @return {Boolean} If true, the string is a valid credit card number.
	* @example
	*	kafe.string.validate.isCreditCard('k789 kafe 3789', 'mc');
	*	// returns false
	* @example
	*	kafe.string.validate.isCreditCard('1234 5678 1234 5678', 'vi');
	*	// returns true
	*/
	validate.isCreditCard = function(str,cc) {
		str = str.replace(/[\s\-]/g, '');

		var pattern = {
			visa:            '4[0-9]{12}([0-9]{3})?',
			mastercard:      '5[1-5][0-9]{14}',
			americanexpress: '3[47][0-9]{13}',
			dinersclub:      '3(?:0[0-5]|[68][0-9])[0-9]{11}',
			discover:        '6(?:011|5[0-9]{2})[0-9]{12}'
		};

		return validate.isLuhnAlgorithm(str) && new RegExp('^'+pattern[cc]+'$','i').test(str);
	};


	return validate;

})()}); })(typeof window !== 'undefined' ? window : this);