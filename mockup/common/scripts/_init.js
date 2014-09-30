//-------------------------------------
//-- nwayo: Initialization
//-------------------------------------

//= require 'dependencies/bower/jquery/dist/jquery.min'
//= require 'dependencies/bower/lodash/dist/lodash.min'
//= require 'dependencies/bower/underscore.string/dist/underscore.string.min'
//= require 'dependencies/bower/modernizr/modernizr'
//= require 'dependencies/bower/kafe/dist/kafe'

/* jshint ignore:start */
var nwayo = {
	version: '/* @echo version */',
	vendor: {
		jQuery:        global.jQuery.noConflict(true),
		jQuery_Global: global.jQuery,
		Modernizr:     global.Modernizr,
		LoDash:        global._
	}
};
global.nwayo = nwayo;
/* jshint ignore:end */
