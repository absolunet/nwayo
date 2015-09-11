//-------------------------------------
//-- nwayo dependencies
//-------------------------------------

/* jshint undef:false, strict:false */

(function(global, undefined) {

	//= require .nwayo-cache/konstan
	//= require bower_components/jquery/dist/jquery
	//= require bower_components/lodash/dist/lodash.min
	//= require bower_components/underscore.string/dist/underscore.string.min
	//= require bower_components/modernizr/modernizr
	//= require bower_components/pubsub-js/src/pubsub
	//= require bower_components/kafe/dist/kafe

	global.nwayo = {
		konstan:     konstan.konstan,
		projectname: konstan.projectname,
		version:     konstan.nwayoversion,
		vendor: {
			jQuery:       global.jQuery.noConflict(true),
			jQueryGlobal: global.jQuery,
			Modernizr:    global.Modernizr,
			LoDash:       global._
		}
	};

})(typeof window !== 'undefined' ? window : this);

