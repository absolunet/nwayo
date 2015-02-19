//-------------------------------------
//-- Bundle starter kit
//-------------------------------------

/* jshint -W098, -W079, strict:false */
var nwayo     = global.nwayo;
var jQuery    = nwayo.vendor.jQuery;
var $         = nwayo.vendor.jQuery;
var $Global   = nwayo.vendor.jQueryGlobal;
var Modernizr = nwayo.vendor.Modernizr;
var _         = nwayo.vendor.LoDash;
var app       = global.ΦΦnameΦΦ = global.ΦΦnameΦΦ || {};

app.tmpl = app.tmpl || {};

var __ = {
	shortcut:    function(type,value) { return '[data-'+type+'~="'+value+'"]'; },

	action:      function() { return __.shortcut('action', arguments[0]); },
	component:   function() { return __.shortcut('component', arguments[0]); },
	placeholder: function() { return __.shortcut('placeholder', arguments[0]); },
	field:       function() { return __.shortcut('field', arguments[0]); },
	showfor:     function() { return __.shortcut('showfor', arguments[0]); },

	name:        function() { return '[name="'+arguments[0]+'"]'; }
};
