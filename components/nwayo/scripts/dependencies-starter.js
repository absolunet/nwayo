//-------------------------------------
//-- Dependencies starter kit
//-------------------------------------

(() => {
	'use strict';

	let addProp = (obj, prop, value) => {
		Object.defineProperty(obj, prop, {
			enumerable:   false,
			writable:     false,
			configurable: false,
			value:        value
		});
	};

	let readonlyObj = (data) => {
		let obj = {};
		for (let prop of Object.keys(data)) {

			if (typeof data[prop] === 'object') {
				data[prop] = readonlyObj(data[prop]);
			}
			addProp(obj, prop, data[prop]);
		}
		return obj;
	};



	// Initialize nwayo
	let nwayo = readonlyObj({
		project: konstan.project,
		version: konstan.nwayo
	});

	let vendor = {};
	addProp(vendor, 'jQuery',       global.jQuery.noConflict(true));
	addProp(vendor, 'jQueryGlobal', global.jQuery);
	addProp(vendor, 'lodash',       global._);
	addProp(vendor, 'Modernizr',    global.Modernizr);
	addProp(vendor, 'PubSub',       global.PubSub);

	addProp(nwayo, 'vendor', vendor);

	addProp(global, 'nwayo', nwayo);



	// Initialize application
	let $    = vendor.jQuery;
	let path = konstan.konstan.path;
	delete konstan.konstan.path;

	let culture = $('html').attr('lang');
	let $body = $('body');
	let bodyClass = $body.attr('class');
	addProp(global, konstan.project, readonlyObj({
		bundle:  konstan.bundle,
		konstan: konstan.konstan,
		path:    path,
		tmpl:    {},
		env:     {
			culture:  culture,
			lang:     culture.substr(0,2),
			pageId:   $body.attr('id'),
			pageTags: !!bodyClass ? _.compact( bodyClass.split(' ') ) : []
		}
	}));

})();
