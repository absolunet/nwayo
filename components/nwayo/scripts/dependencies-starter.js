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
		LoDash:       global._,
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
