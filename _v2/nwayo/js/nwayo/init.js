var nwayo = {
	version: '/* @echo version */',
	vendor: {
		jQuery:        global.jQuery.noConflict(true),
		jQuery_Global: global.jQuery,
		Modernizr:     global.Modernizr,
		LoDash:        global._
	}
};
global.nwayo = nwayo;