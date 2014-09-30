//-------------------------------------
//-- nwayo: Globals
//-------------------------------------

/* jshint ignore:start */
var jQuery    = nwayo.vendor.jQuery;
var $         = nwayo.vendor.jQuery;
var $Global   = global.jQuery;
var Modernizr = nwayo.vendor.Modernizr;
var _         = nwayo.vendor._;
var App       = global.POUEL;

var __shortcut   = function(type,value) { return '[data-'+type+'="'+value+'"]'; };
var _action      = function() { return __shortcut('action', arguments[0]); };
var _component   = function() { return __shortcut('component', arguments[0]); };
var _placeholder = function() { return __shortcut('placeholder', arguments[0]); };
var _field       = function() { return __shortcut('field', arguments[0]); };
var _showfor     = function() { return __shortcut('showfor', arguments[0]); };
/* jshint ignore:end */
