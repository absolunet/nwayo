//-------------------------------------
//-- Bundle starter kit
//-------------------------------------

/* jshint ignore:start */
var nwayo     = global.nwayo;
var jQuery    = nwayo.vendor.jQuery;
var $         = nwayo.vendor.jQuery;
var $Global   = nwayo.vendor.jQuery_Global;
var Modernizr = nwayo.vendor.Modernizr;
var _         = nwayo.vendor._;
var app       = global.POUEL = global.POUEL || {};

app.tmpl = app.tmpl || {}

var __ = {
	shortcut:    function(type,value) { return '[data-'+type+'="'+value+'"]'; },
	action:      function() { return __.shortcut('action', arguments[0]); },
	component:   function() { return __.shortcut('component', arguments[0]); },
	placeholder: function() { return __.shortcut('placeholder', arguments[0]); },
	field:       function() { return __.shortcut('field', arguments[0]); },
	showfor:     function() { return __.shortcut('showfor', arguments[0]); }
};
/* jshint ignore:end */
