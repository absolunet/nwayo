//-------------------------------------
//-- Dependencies starter kit
//-------------------------------------

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
	const vendor = {};
	addProp(vendor, 'jQuery',       global.jQuery);
	addProp(vendor, 'jQueryGlobal', global.jQuery);
	addProp(vendor, 'lodash',       global._);
	addProp(vendor, 'Modernizr',    global.Modernizr);
	addProp(vendor, 'PubSub',       global.PubSub);

	addProp(nwayo, 'vendor', vendor);

	// Promises
	const $ = vendor.jQuery;
	const deferredDOMParse = $.Deferred();
	const deferredDocumentLoad = $.Deferred();

	const promises = readonlyObj({
		DOMParse:     deferredDOMParse.promise(),
		documentLoad: deferredDocumentLoad.promise()
	});

	addProp(nwayo, 'promises', promises);

	addProp(global, 'nwayo', nwayo);



	//-- Initialize application
	const path = konstan.konstan.path;
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


	// When DOM ready
	$(() => {
		deferredDOMParse.resolve();
	});

	// When document loaded
	$(window).on('load', () => {  // eslint-disable-line no-restricted-globals
		deferredDocumentLoad.resolve();
	});

})();
