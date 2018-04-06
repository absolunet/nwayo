//-------------------------------------
//-- Wrapper for pinki
//-------------------------------------

/* eslint-disable strict */
(() => {

	const ORIGINAL_GLOBAL = global.define;
	global.define = undefined;

	//= require bower_components/pubsub-js/src/pubsub
	//= require bower_components/pinki/vendor/rsvp
	//= require bower_components/pinki/index

	global.define = ORIGINAL_GLOBAL;

})();
