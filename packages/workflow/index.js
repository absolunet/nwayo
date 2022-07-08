//--------------------------------------------------------
//-- nwayo
//--------------------------------------------------------
'use strict';

/* eslint-disable node/global-require */
class NwayoClasses {

	get extension() { return require('./classes/extension'); }

}


class NwayoHelpers {

	get env()     { return require('./helpers/env'); }  // eslint-disable-line unicorn/prevent-abbreviations
	get paths()   { return require('./helpers/paths'); }
	get toolbox() { return require('./helpers/toolbox'); }
	get util()    { return require('./helpers/util'); }

}
/* eslint-enable global-require */


class NwayoWorkflow {

	get classes() { return new NwayoClasses(); }
	get helpers() { return new NwayoHelpers(); }

}


module.exports = new NwayoWorkflow();
