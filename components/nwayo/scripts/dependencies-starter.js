//-------------------------------------
//-- Dependencies starter kit
//-------------------------------------

// Initialize nwayo
global.nwayo = {
	project: konstan.project,
	version: konstan.nwayo,
	vendor:  {
		jQuery:       global.jQuery.noConflict(true),
		jQueryGlobal: global.jQuery,
		lodash:       global._,
		Modernizr:    global.Modernizr,
		PubSub:       global.PubSub
	}
};


// Initialize application
var path = konstan.konstan.path;
delete konstan.konstan.path;

global[konstan.project] = {
	bundle:  konstan.bundle,
	konstan: konstan.konstan,
	path:    path,
	tmpl:    {}
};


// Add to application when document is ready
global.nwayo.vendor.jQuery(function($) {
	'use strict';
	var app = global[konstan.project];

	// Environment
	app.env = {};
	app.env.culture  = $('html').attr('lang');
	app.env.lang     = app.env.culture.substr(0,2);
	app.env.pageId   = $('body').attr('id');
	app.env.pageTags = _.compact( $('body').attr('class').split(' ') );
});


// Avoid `console` errors in browsers that lack a console.
// (c) HTML5 Boilerplate
(function() {
	'use strict';

	var method;
	var noop = function () {};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = global.console = global.console || {};

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());
