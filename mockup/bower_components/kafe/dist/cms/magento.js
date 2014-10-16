(function(global, undefined) { var kafe = global.kafe, $ = kafe.dependencies.jQuery; kafe.bonify({name:'cms.magento', version:'0.1.0', obj:(function(){

	var
		_privateFunction = function () {

		}
	;


	/**
	* ### Version 0.1.0
	* Additionnal methods for Magento
	*
	* @module kafe.cms
	* @class kafe.cms.magento
	*/
	var magento = {};


	/**
	* Bind listener on Magento's Prototype ajax complete.
	*
	* @method onAjaxComplete
	* @param {Function} callback Callback
	*/
	magento.onAjaxComplete = function(func) {
		Ajax.Responders.register({ onComplete: func });
	};

	return magento;

})()}); })(typeof window !== 'undefined' ? window : this);