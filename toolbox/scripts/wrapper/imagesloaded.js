//-------------------------------------
//-- Wrapper for imagesLoaded
//-------------------------------------

/* eslint-disable strict */
(() => {

	const ORIGINAL_GLOBAL = global.jQuery;
	this.jQuery = $;

	//= require bower_components/imagesloaded/imagesloaded.pkgd

	this.jQuery = ORIGINAL_GLOBAL;

})();
