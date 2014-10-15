(function(global, undefined) {
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
	

	﻿//-------------------------------------
	//-- Variant
	//-------------------------------------
	
	//= **require ''
	
	(function(){
		'use strict';
	
		var Local = {};
	
		Local.dssd = '';
	
		/*- Home -------------------------------------------------------------------*/
		/**
		Local.InitHome = function() {
			if (App.env.isHome) {
	
			}
		};
		/**/
	
		/*- Lateral Column -------------------------------------------------------------------*/
		/**
		Local.InitLateralcolumn = function() {
			if (App.dom.lateralCol) {
	
			}
		};
		/**/
	
	
		$(function() {
			//Local.InitHome();
			//Local.InitLateralcolumn();
		});
	
	})();
	

	// [gulp-include] -- Skipping common/scripts/variant, already included.



/* global window */
})(typeof window !== 'undefined' ? window : this);
