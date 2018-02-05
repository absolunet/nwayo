//-------------------------------------
//-- Wrapper for PubSubJS
//-------------------------------------

/* eslint-disable strict */
(() => {

	const ORIGINAL_GLOBAL = global.define;
	global.define = undefined;

	//= require bower_components/pubsub-js/src/pubsub

	global.define = ORIGINAL_GLOBAL;

})();
