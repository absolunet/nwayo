//-------------------------------------
//-- Dependencies starter kit
//-------------------------------------

global.nwayo = {
	version: konstan.nwayo,
	project: konstan.project,
	bundle:  konstan.bundle,
	konstan: konstan.konstan,
	vendor: {
		jQuery:       global.jQuery.noConflict(true),
		jQueryGlobal: global.jQuery,
		Modernizr:    global.Modernizr,
		LoDash:       global._
	}
};


