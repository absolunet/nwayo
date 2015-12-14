//-------------------------------------
//-- Collection starter kit
//-------------------------------------

/* jshint -W079, unused:false, singleGroups:false, strict:false */
var app       = global[global.nwayo.project];
var konstan   = app.konstan;
var jQuery    = global.nwayo.vendor.jQuery;
var $         = global.nwayo.vendor.jQuery;
var $Global   = global.nwayo.vendor.jQueryGlobal;
var _         = global.nwayo.vendor.lodash;
var Modernizr = global.nwayo.vendor.Modernizr;
var PubSub    = global.nwayo.vendor.PubSub;


// Shortcuts
var __ = (function() {
	var shortcut = {};
	var selector = function(key, value) { return '['+key+(value ? '~="'+value+'"' : '' )+']'; };

	// Shortcuts
	_.forEach(['name'], function(key) {
		shortcut[key] = function() { return selector(key, arguments[0]); };
		shortcut['$'+key] = function() { return $(shortcut[key](arguments[0])); };
	});

	// Data - shortcuts
	_.forEach(['action','component','placeholder','showfor'], function(key) {
		shortcut[key] = function() { return selector('data-'+key, arguments[0]); };
		shortcut['$'+key] = function() { return $(shortcut[key](arguments[0])); };
	});

	// Window
	shortcut.window = global;

	return shortcut;
})();


// DOM shortcuts
$(function() {
	__.$window   = $(global);
	__.$document = $(document);
	__.$html     = $('html');
	__.$body     = $('body');
});
