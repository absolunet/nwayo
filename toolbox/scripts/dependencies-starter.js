//-------------------------------------
//-- Dependencies starter kit
//-------------------------------------
/* global nwayoStarterConfig */

(() => {
	'use strict';

	const addProperty = (object, property, value) => {
		Object.defineProperty(object, property, {
			enumerable:   true,
			writable:     false,
			configurable: false,
			value:        value
		});
	};

	const readonlyObject = (data) => {
		const object = {};

		Object.keys(data).forEach((property) => {
			if (typeof data[property] === 'object' && !Array.isArray(data[property])) {
				data[property] = readonlyObject(data[property]);
			}
			addProperty(object, property, data[property]);
		});

		return object;
	};



	//-- Initialize nwayo
	const nwayo = readonlyObject({
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

	let lodashScoped;
	switch (nwayoStarterConfig.lodash.scope) {

		case 'private': lodashScoped = global._.noConflict(); break;
		case 'public':  lodashScoped = global._; break;
		default: break;

	}

	const vendor = {};
	addProperty(vendor, 'jQuery',    jQueryScoped);
	addProperty(vendor, 'lodash',    lodashScoped);
	addProperty(vendor, 'Modernizr', global.Modernizr);
	addProperty(vendor, 'pinki',     global.pinki);

	addProperty(nwayo, 'vendor', vendor);

	// Redefine
	const $ = vendor.jQuery;
	const _ = vendor.lodash;



	// Vows
	const vows = readonlyObject({
		DOMParsed:          'nwayo-core.dom-parsed',
		documentLoaded:     'nwayo-core.document-loaded',
		globaljqueryLoaded: 'nwayo-core.globaljquery-loaded'
	});

	addProperty(nwayo, 'vows', vows);

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

	addProperty(nwayo, 'shortcuts', shortcuts);

	addProperty(nwayo, 'helpers', {});

	addProperty(global, 'nwayo', nwayo);



	//-- Initialize application
	const { path } = konstan.konstan;
	delete konstan.konstan.path;

	const culture   = $('html').attr('lang') || '';
	const $body     = $('body');
	const bodyClass = $body.attr('class');

	addProperty(global, konstan.project, readonlyObject({
		bundle:  konstan.bundle,
		konstan: konstan.konstan,
		path:    path,
		tmpl:    {},
		env:     {  // eslint-disable-line unicorn/prevent-abbreviations
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
