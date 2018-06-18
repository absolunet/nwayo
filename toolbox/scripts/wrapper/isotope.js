//-------------------------------------
//-- Wrapper for Isotope
//-------------------------------------

/* eslint-disable strict */
(() => {

	const ORIGINAL_GLOBAL = global.jQuery;
	this.jQuery = $;

	//= require bower_components/isotope-layout/dist/isotope.pkgd

	this.jQuery = ORIGINAL_GLOBAL;

})();
