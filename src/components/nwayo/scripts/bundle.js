//-------------------------------------
//-- Bundle starter kit
//-------------------------------------

/* jshint -W079, unused:false, singleGroups:false, strict:false */
var nwayo     = global.nwayo;
var konstan   = nwayo.konstan;
var jQuery    = nwayo.vendor.jQuery;
var $         = nwayo.vendor.jQuery;
var $Global   = nwayo.vendor.jQueryGlobal;
var Modernizr = nwayo.vendor.Modernizr;
var _         = nwayo.vendor.LoDash;
var app       = global[nwayo.projectname] = global[nwayo.projectname] || {};

app.tmpl = app.tmpl || {};

// shortcuts
var __ = (function() {
	var attr     = ['name'];
	var attrData = ['action','component','placeholder','field','showfor'];


	var calls = {};
	var selector = function(key, value) { return '['+key+(value ? '~="'+value+'"' : '' )+']'; };

	// shortcuts
	_.forEach(attr, function(key) {
		calls[key] = function() { return selector(key, arguments[0]); };
	});

	// data - shortcuts
	_.forEach(attrData, function(key) {
		calls[key] = function() { return selector('data-'+key, arguments[0]); };
	});

	return calls;

})();
