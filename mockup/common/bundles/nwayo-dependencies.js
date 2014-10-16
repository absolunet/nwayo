/* jshint ignore:start */

(function(global, undefined) {

	//= require 'bower_components/jquery/dist/jquery.min'
	//= require 'bower_components/lodash/dist/lodash.min'
	//= require 'bower_components/underscore.string/dist/underscore.string.min'
	//= require 'bower_components/modernizr/modernizr'
	//= require 'bower_components/kafe/dist/kafe'

	global.nwayo = {
		version: '/* @echo version */',
		vendor: {
			jQuery:        global.jQuery.noConflict(true),
			jQuery_Global: global.jQuery,
			Modernizr:     global.Modernizr,
			LoDash:        global._
		}
	};

})(typeof window !== 'undefined' ? window : this);

/* jshint ignore:end */
