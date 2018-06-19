//-------------------------------------
//-- Dependencies starter kit
//-------------------------------------
/* global nwayoStarterConfig */

(() => {
	'use strict';

	const addProp = (obj, prop, value) => {
		Object.defineProperty(obj, prop, {
			enumerable:   true,
			writable:     false,
			configurable: false,
			value:        value
		});
	};

	const readonlyObj = (data) => {
		const obj = {};

		Object.keys(data).forEach((prop) => {
			if (typeof data[prop] === 'object' && !Array.isArray(data[prop])) {
				data[prop] = readonlyObj(data[prop]);
			}
			addProp(obj, prop, data[prop]);
		});

		return obj;
	};



	//-- Initialize nwayo
	const nwayo = readonlyObj({
		project: konstan.project,
		version: konstan.nwayo
	});

	// Vendors
	let jQueryScoped;
	switch (nwayoStarterConfig.jQuery.scope) {

		case 'private': jQueryScoped = global.jQuery.noConflict(true); break;
		case 'semi':    jQueryScoped = global.jQuery.noConflict(); break;
		case 'public':  jQueryScoped = global.jQuery; break;
		default: break;

	}

	const vendor = {};
	addProp(vendor, 'jQuery',    jQueryScoped);
	addProp(vendor, 'lodash',    global._.noConflict());
	addProp(vendor, 'Modernizr', global.Modernizr);
	addProp(vendor, 'pinki',     global.pinki);

	addProp(nwayo, 'vendor', vendor);

	// Redefine
	const $ = vendor.jQuery;
	const _ = vendor.lodash;



	// Vows
	const vows = readonlyObj({
		DOMParsed:          'nwayo-core.dom-parsed',
		documentLoaded:     'nwayo-core.document-loaded',
		globaljqueryLoaded: 'nwayo-core.globaljquery-loaded'
	});

	addProp(nwayo, 'vows', vows);

	// Shortcuts
	const shortcuts = (() => {
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
		['action', 'component', 'placeholder'].forEach((key) => {
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

	addProp(nwayo, 'shortcuts', shortcuts);

	addProp(nwayo, 'helpers', {});

	addProp(global, 'nwayo', nwayo);



	//-- Initialize application
	const { path } = konstan.konstan;
	delete konstan.konstan.path;

	const culture   = $('html').attr('lang') || '';
	const $body     = $('body');
	const bodyClass = $body.attr('class');

	addProp(global, konstan.project, readonlyObj({
		bundle:  konstan.bundle,
		konstan: konstan.konstan,
		path:    path,
		tmpl:    {},
		env:     {
			culture:  culture,
			lang:     culture.substr(0, 2),
			country:  culture.substr(3, 2).toLowerCase(),
			pageId:   $body.attr('id'),
			pageTags: bodyClass ? _.compact(bodyClass.split(' ')) : []
		}
	}));


	let DOMParsed    = false;
	let waitingOnDOM = false;

	// When DOM ready
	$(() => {
		pinki.vow.fulfill(vows.DOMParsed);
		DOMParsed = true;

		if (waitingOnDOM) {
			pinki.vow.fulfill(vows.documentLoaded);
		}
	});

	// When document loaded
	$(window).on('load', () => {  // eslint-disable-line no-restricted-globals
		if (!DOMParsed) {
			waitingOnDOM = true;
		} else {
			pinki.vow.fulfill(vows.documentLoaded);
		}
	});

	// If global jQuery is already loaded
	if (global.jQuery) {
		pinki.vow.fulfill(vows.globaljqueryLoaded, global.jQuery);
	}

})();
