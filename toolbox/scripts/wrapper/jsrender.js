//-------------------------------------
//-- Wrapper for JsRender
//-------------------------------------

/* eslint-disable strict */
(() => {

	const ORIGINAL_GLOBAL = global.jQuery;
	this.jQuery = $;

	//= require bower_components/jsrender/jsrender

	this.jQuery = ORIGINAL_GLOBAL;

})();
