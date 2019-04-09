//-------------------------------------
//-- Wrapper for imagesLoaded
//-------------------------------------

/* eslint-disable strict */
(() => {

	const ORIGINAL_GLOBAL = global.jQuery;
	this.jQuery = $;

	//= require vendor/node_modules/imagesloaded/imagesloaded.pkgd

	this.jQuery = ORIGINAL_GLOBAL;

})();
