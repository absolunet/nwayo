//-------------------------------------
//-- Dependencies starter kit
//-------------------------------------
/* global nwayoStarterConfig */

(() => {
	'use strict';

	const addProp = (obj, prop, value) => {
		Object.defineProperty(obj, prop, {
			enumerable:   false,
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
	addProp(vendor, 'PubSub',    global.PubSub);

	addProp(nwayo, 'vendor', vendor);

	// Redefine
	const $ = vendor.jQuery;
	const _ = vendor.lodash;



	// Promises
	const deferredDOMParse         = $.Deferred();
	const deferredDocumentLoad     = $.Deferred();
	const deferredGlobalJQueryLoad = $.Deferred();

	const promises = readonlyObj({
		DOMParse:         deferredDOMParse.promise(),
		documentLoad:     deferredDocumentLoad.promise(),
		globalJQueryLoad: deferredGlobalJQueryLoad.promise()
	});

	addProp(nwayo, 'promises', promises);

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

	addProp(nwayo, 'shortcuts', shortcuts);

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
		deferredDOMParse.resolve();
		DOMParsed = true;

		if (waitingOnDOM) {
			deferredDocumentLoad.resolve();
		}
	});

	// When document loaded
	$(window).on('load', () => {  // eslint-disable-line no-restricted-globals
		if (!DOMParsed) {
			waitingOnDOM = true;
		} else {
			deferredDocumentLoad.resolve();
		}
	});

	// When global jQuery is loaded
	PubSub.subscribe('nwayo.jQueryGlobal.loaded', () => {
		addProp(global.nwayo.vendor, 'jQueryGlobal', global.jQuery);
		deferredGlobalJQueryLoad.resolve(global.jQuery);
	});



	// If global jQuery is already loaded
	if (global.jQuery) {
		PubSub.publish('nwayo.jQueryGlobal.loaded');
	}

})();
