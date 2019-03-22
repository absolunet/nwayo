//-------------------------------------
//-- Wrapper for JsRender
//-------------------------------------

/* eslint-disable strict */
(() => {

	const ORIGINAL_GLOBAL = global.jQuery;
	this.jQuery = $;

	//= require vendor/node_modules/jsrender/jsrender

	this.jQuery = ORIGINAL_GLOBAL;

})();
