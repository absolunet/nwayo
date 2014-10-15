(function(global, undefined) { var kafe = global.kafe, $ = kafe.dependencies.jQuery; kafe.bonify({name:'ext.addthis', version:'0.1', obj:(function(){

	/**
	* ### Version 0.1
	* Additionnal methods for AddThis
	*
	* @module kafe.ext
	* @class kafe.ext.addthis
	*/
	var addthis = {};

	/**
	* Refresh addthis share data
	*
	* @method refreshData
	* @param {Object} options Options
	*	@param {String} options.url The url
	*	@param {String} options.title The page title
	*/
    addthis.refreshData = function (options) {
		options = options || {};
		global.addthis.ost = 0;
		global.addthis.update('share', 'url',   (options.url)   ? options.url   : global.location.toString());
		global.addthis.update('share', 'title', (options.title) ? options.title : document.title);
		global.addthis.ready();
		global.addthis.toolbox('.addthis_toolbox');
    };

	return addthis;

})()}); })(typeof window !== 'undefined' ? window : this);