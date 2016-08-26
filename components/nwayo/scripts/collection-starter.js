//-------------------------------------
//-- Collection starter kit
//-------------------------------------

/* eslint-disable strict, no-unused-vars, no-redeclare */
const app     = global[global.nwayo.project];
const konstan = app.konstan;

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

	// Window
	shortcut.window = global;

	// DOM shortcuts
	shortcut.$window   = $(global);
	shortcut.$document = $(document);
	shortcut.$html     = $('html');
	shortcut.$body     = $('body');

	return shortcut;
})();
