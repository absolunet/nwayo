//-------------------------------------
//-- Wrapper for pinki
//-------------------------------------

/* eslint-disable strict */
(() => {

	const ORIGINAL_GLOBAL = global.define;
	global.define = undefined;

	//= require vendor/node_modules/pubsub-js/src/pubsub
	//= require vendor/node_modules/rsvp/dist/rsvp
	//= require vendor/node_modules/@absolunet/pinki/dist/browser

	global.define = ORIGINAL_GLOBAL;

})();
