//-------------------------------------
//-- Collection starter kit
//-------------------------------------

//= require components/nwayo/scripts/exclusion-starter

/* eslint-disable strict, no-unused-vars, no-redeclare */
const PROJECT = global.nwayo.project;
const app     = global[PROJECT];
const konstan = app.konstan;

const DOM_PARSE     = global.nwayo.promises.DOMParse;
const DOCUMENT_LOAD = global.nwayo.promises.documentLoad;

const jQuery    = global.nwayo.vendor.jQuery;
const $         = global.nwayo.vendor.jQuery;
const $Global   = global.nwayo.vendor.jQueryGlobal;
const _         = global.nwayo.vendor.lodash;
const Modernizr = global.nwayo.vendor.Modernizr;
const PubSub    = global.nwayo.vendor.PubSub;



// Shortcuts
const __ = (() => {
	const shortcut = {};
	const selector = (key, value) => {
		return `[${key}${value ? `~="${value}"` : ''}]`;
	};

	// Shortcuts
	['name'].forEach((key) => {
		shortcut[key]       = (value) => { return selector(key, value); };
		shortcut[`$${key}`] = (value) => { return $(shortcut[key](value)); };
	});

	// Data - shortcuts
	['action', 'component', 'placeholder', 'showfor'].forEach((key) => {
		shortcut[key]       = (value) => { return selector(`data-${key}`, value); };
		shortcut[`$${key}`] = (value) => { return $(shortcut[key](value)); };
	});

	// DOM shortcuts
	shortcut.$window   = $(global);
	shortcut.$document = $(document);
	shortcut.$html     = $('html');
	shortcut.$body     = $('body');

	return shortcut;
})();
