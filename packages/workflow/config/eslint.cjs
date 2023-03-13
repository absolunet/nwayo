/* eslint-env node */
/* eslint-disable camelcase, unicorn/prevent-abbreviations */
"use strict";

module.exports = {
	extends: "@valtech-commerce/eslint-config/browser",
	env: {
		jquery: true,
	},
	globals: {
		global: "readonly",
		konstan: "readonly",
		app: "readonly",
		__: "readonly",
		toolbox: "readonly",
		PROJECT: "readonly",
		DOM_PARSED: "readonly",
		DOCUMENT_LOADED: "readonly",
		GLOBAL_JQUERY_LOADED: "readonly",
		_: "readonly",
		Modernizr: "readonly",
		pinki: "readonly",
		addthis: "readonly",
		addthis_config: "writable",
		addthis_share: "writable",
		Cookies: "readonly",
		FastClick: "readonly",
		Foundation: "readonly",
		google: "readonly",
		kafe: "readonly",
		WebFont: "readonly",
		whatInput: "readonly",
	},
	rules: {
		"no-console": ["warn"],
		"no-debugger": ["warn"],
		"no-alert": ["warn"],
		"no-warning-comments": [
			"warn",
			{
				location: "anywhere",
			},
		],
		"unicorn/consistent-function-scoping": ["off"],
		"unicorn/prefer-module": ["off"],
		"unicorn/no-unreadable-iife": ["off"],
	},
};
